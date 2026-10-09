import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiUploadCloud, FiSearch, FiCopy, FiCheck, FiTrash2, FiX, FiImage, FiSave,
} from "react-icons/fi";
import { compressUnder2MB, MAX_UPLOAD_BYTES } from "@/components/compressImage";

// Shared Media library (backed by /api/images, i.e. ecom_images). Used by the
// Media page to manage images and by editors to pick / upload images.

const ACCEPTED_TYPES = /^image\/(jpe?g|png|webp)$/;

const SOURCE_LABELS = { media: "Media", blog: "Blog", festival: "Festival" };

export function mediaErrorText(err, fallback = "Something went wrong.") {
  const data = err?.response?.data;
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return data?.message || err?.message || fallback;
}

function baseNameOf(fileName) {
  const slug = (fileName || "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return slug || "image";
}

const fileNameOf = (im) => (im.image_path || "").split("/").pop();
const sourceOf = (im) => im.page_key || "other";
const sourceLabel = (key) => SOURCE_LABELS[key] || (key === "other" ? "Other" : key.charAt(0).toUpperCase() + key.slice(1));

function formatBytes(n) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Upload one File into the library. Anything over the backend's 2 MB cap (or
// in a format it rejects, e.g. GIF) is re-encoded to JPEG first.
export async function uploadToMediaLibrary(api, file, { pageKey = "media", altText = "", title = "" } = {}) {
  const baseName = baseNameOf(file.name);
  let upload = file;
  if (!ACCEPTED_TYPES.test(file.type) || file.size > MAX_UPLOAD_BYTES) {
    upload = await compressUnder2MB(file, baseName);
    if (!upload) throw new Error("still over 2 MB after compression");
  }
  const fd = new FormData();
  fd.append("image", upload);
  fd.append("image_type", "general");
  fd.append("page_key", pageKey);
  fd.append("name", baseName);
  if (altText) fd.append("alt_text", altText);
  if (title) fd.append("title", title);
  const res = await api("post", "/images", fd);
  return res.data?.data;
}

// ── Details panel ────────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

function MediaDetails({ api, item, mode, selectLabel, inUse, onSaved, onDeleted, onClose, onSelect }) {
  const [alt, setAlt] = useState(item.alt_text || "");
  const [title, setTitle] = useState(item.title || "");
  const [caption, setCaption] = useState(item.caption || "");
  const [natural, setNatural] = useState(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const dirty =
    alt !== (item.alt_text || "") || title !== (item.title || "") || caption !== (item.caption || "");

  const save = async () => {
    const res = await api("put", `/images/${item.id}`, {
      alt_text: alt.trim(),
      title: title.trim(),
      caption: caption.trim(),
    });
    const updated = res.data?.data || { ...item, alt_text: alt.trim(), title: title.trim(), caption: caption.trim() };
    onSaved(updated);
    return updated;
  };

  const handleSave = async () => {
    setBusy("save");
    setMsg(null);
    try {
      await save();
      setMsg({ ok: true, text: "Saved." });
    } catch (err) {
      setMsg({ ok: false, text: mediaErrorText(err, "Could not save.") });
    }
    setBusy("");
  };

  const handleSelect = async () => {
    setBusy("select");
    setMsg(null);
    try {
      const current = dirty ? await save() : item;
      onSelect(current);
    } catch (err) {
      setMsg({ ok: false, text: mediaErrorText(err, "Could not save the alt text.") });
    }
    setBusy("");
  };

  const handleDelete = async () => {
    const warning = inUse
      ? "This image is IN USE on the site.\n\nRemove it from the Media library anyway? The pages using it will keep showing it."
      : "Remove this image from the Media library?";
    if (!window.confirm(warning)) return;
    setBusy("delete");
    try {
      await api("delete", `/images/${item.id}`);
      onDeleted(item.id);
    } catch (err) {
      setMsg({ ok: false, text: mediaErrorText(err, "Could not delete.") });
      setBusy("");
    }
  };

  const copyUrl = () => {
    navigator.clipboard?.writeText(item.image_path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const width = item.width || natural?.w;
  const height = item.height || natural?.h;

  const rows = [
    ["File name", fileNameOf(item)],
    ["Dimensions", width && height ? `${width} × ${height}px` : "—"],
    ["File size", formatBytes(item.file_size)],
    ["Type", item.mime_type || (fileNameOf(item).split(".").pop() || "").toUpperCase() || "—"],
    ["Uploaded", formatDate(item.created_at)],
    ["Source", sourceLabel(sourceOf(item))],
  ];

  const inputCls =
    "mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      <div className="relative bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px] rounded-xl overflow-hidden border border-gray-100">
        <img
          src={item.image_path}
          alt={alt}
          onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          className="w-full max-h-44 object-contain"
        />
        <button type="button" onClick={onClose} title="Close details"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-500 hover:text-gray-900 shadow-sm">
          <FiX size={14} />
        </button>
      </div>

      <Field label="Alt text" hint="Describe what the image shows. Used by Google and screen readers.">
        <input value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={255}
          placeholder="e.g. Man wearing a natural-looking hair patch, side view"
          className={`${inputCls} ${alt.trim() ? "" : "border-amber-300 bg-amber-50/40"}`} />
      </Field>
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} className={inputCls} />
      </Field>
      <Field label="Caption">
        <textarea rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={1000}
          className={`${inputCls} resize-none`} />
      </Field>

      {msg && <p className={`text-xs font-semibold ${msg.ok ? "text-emerald-600" : "text-red-500"}`}>{msg.text}</p>}

      <div className="flex flex-wrap gap-2">
        {mode === "pick" && (
          <button type="button" onClick={handleSelect} disabled={!!busy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            <FiImage size={14} /> {busy === "select" ? "Saving…" : selectLabel}
          </button>
        )}
        <button type="button" onClick={handleSave} disabled={!dirty || !!busy}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 ${
            mode === "pick" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "flex-1 bg-[#04A9FF] hover:bg-[#0070cc] text-white"
          }`}>
          <FiSave size={14} /> {busy === "save" ? "Saving…" : "Save details"}
        </button>
        {mode === "manage" && (
          <button type="button" onClick={handleDelete} disabled={!!busy} title="Remove from library"
            className="px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
            <FiTrash2 size={15} />
          </button>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 space-y-3">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-gray-400">{k}</dt>
              <dd className="text-gray-700 font-medium break-all">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex gap-1.5">
          <input readOnly value={item.image_path} onFocus={(e) => e.target.select()}
            className="flex-1 min-w-0 text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 outline-none" />
          <button type="button" onClick={copyUrl} title="Copy URL"
            className="px-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {copied ? <FiCheck size={13} className="text-emerald-600" /> : <FiCopy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Browser: grid + filters + upload + details ───────────────────────────────
export function MediaBrowser({ api, mode = "manage", pageKey = "media", selectLabel = "Use this image", onSelect, fill = false }) {
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [uploading, setUploading] = useState(0);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [usedIds, setUsedIds] = useState(null); // Set of ids referenced on the site; null = unknown
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const [res, usedRes] = await Promise.all([
        api("get", "/images"),
        api("get", "/images/used").catch(() => null),
      ]);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setItems(list.slice().sort((a, b) => b.id - a.id));
      const used = usedRes?.data?.data;
      setUsedIds(Array.isArray(used) ? new Set(used) : null);
    } catch (err) {
      setLoadError(mediaErrorText(err, "Could not load the media library."));
      setItems([]);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setUploadErrors([]);
    setUploading((n) => n + files.length);
    const failures = [];
    for (const file of files) {
      try {
        const saved = await uploadToMediaLibrary(api, file, { pageKey });
        if (saved) {
          setItems((prev) => [saved, ...(prev || [])]);
          setSelectedId(saved.id);
          setFilter("all");
        }
      } catch (err) {
        failures.push(`${file.name}: ${mediaErrorText(err, "upload failed")}`);
      }
      setUploading((n) => n - 1);
    }
    setUploadErrors(failures);
  };

  const all = items || [];
  const isUnused = (im) => !!usedIds && !usedIds.has(im.id);
  const missingAlt = all.filter((im) => !im.alt_text).length;
  const unused = all.filter(isUnused).length;
  const sources = [...new Set(all.map(sourceOf))].sort();

  const filtered = all.filter((im) => {
    if (filter === "missing-alt" && im.alt_text) return false;
    if (filter === "unused" && !isUnused(im)) return false;
    if (filter.startsWith("src:") && sourceOf(im) !== filter.slice(4)) return false;
    if (!q) return true;
    const hay = `${im.name || ""} ${im.alt_text || ""} ${im.title || ""} ${fileNameOf(im)}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const selected = all.find((im) => im.id === selectedId) || null;

  const chips = [
    { key: "all", label: `All (${all.length})` },
    ...(missingAlt ? [{ key: "missing-alt", label: `Missing alt (${missingAlt})` }] : []),
    ...(unused ? [{ key: "unused", label: `Unused (${unused})` }] : []),
    ...sources.map((s) => ({ key: `src:${s}`, label: sourceLabel(s) })),
  ];
  const chipCls = (key, active) => {
    if (key === "missing-alt") return active ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100";
    if (key === "unused") return active ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200";
    return active ? "bg-[#04A9FF] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50";
  };

  return (
    <div className={`flex flex-col gap-4 ${fill ? "h-full min-h-0" : ""}`}>
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by file name, alt text or title…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#04A9FF] transition-colors" />
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading > 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60">
          <FiUploadCloud size={15} /> {uploading ? `Uploading ${uploading}…` : "Upload images"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <button key={c.key} type="button" onClick={() => setFilter(c.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${chipCls(c.key, filter === c.key)}`}>
            {c.label}
          </button>
        ))}
      </div>

      {uploadErrors.length > 0 && (
        <div className="bg-red-50 text-red-600 text-xs rounded-xl px-4 py-3 space-y-0.5">
          {uploadErrors.map((e) => <p key={e}>{e}</p>)}
        </div>
      )}

      <div className={`flex flex-col lg:flex-row gap-4 ${fill ? "flex-1 min-h-0" : ""}`}>
        {/* Grid (also a drop zone) */}
        <div
          className={`relative flex-1 min-w-0 rounded-2xl ${fill ? "overflow-y-auto" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          {dragOver && (
            <div className="absolute inset-0 z-10 rounded-2xl border-2 border-dashed border-[#04A9FF] bg-blue-50/80 flex items-center justify-center text-sm font-bold text-[#0070cc] pointer-events-none">
              Drop images to upload
            </div>
          )}

          {items === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : loadError ? (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{loadError}</p>
          ) : filtered.length === 0 ? (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-16 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors">
              <FiUploadCloud size={28} className="mb-2" />
              <span className="text-sm font-semibold">{all.length ? "No images match." : "No images yet. Click or drop images here to upload."}</span>
            </button>
          ) : (
            <div className={`grid grid-cols-2 sm:grid-cols-3 ${selected ? "xl:grid-cols-4" : "xl:grid-cols-5"} gap-3`}>
              {filtered.map((im) => (
                <button key={im.id} type="button"
                  onClick={() => setSelectedId(im.id)}
                  onDoubleClick={mode === "pick" ? () => onSelect(im) : undefined}
                  title={im.alt_text || fileNameOf(im)}
                  className={`group relative text-left rounded-xl overflow-hidden bg-white border-2 transition-colors ${
                    im.id === selectedId ? "border-[#04A9FF] ring-2 ring-[#04A9FF]/25" : "border-gray-100 hover:border-gray-300"
                  }`}>
                  <div className="relative aspect-square bg-gray-50">
                    <img src={im.image_path} alt={im.alt_text || ""} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                      {!im.alt_text && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold tracking-wide">NO ALT</span>
                      )}
                      {isUnused(im) && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white text-[9px] font-bold tracking-wide">UNUSED</span>
                      )}
                    </div>
                    {im.file_size > 0 && (
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px] font-semibold tabular-nums">
                        {formatBytes(im.file_size)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 px-2 py-1.5 truncate">{im.title || fileNameOf(im)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        {selected && (
          // Capped to the visible height (minus the admin header and page padding)
          // so its fields scroll inside the panel instead of running off-screen.
          <aside className={`lg:w-80 flex-shrink-0 ${
            fill ? "overflow-y-auto" : "lg:sticky lg:top-0 self-start lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto"
          }`}>
            <MediaDetails
              key={selected.id}
              api={api}
              item={selected}
              mode={mode}
              selectLabel={selectLabel}
              inUse={!!usedIds && usedIds.has(selected.id)}
              onClose={() => setSelectedId(null)}
              onSelect={onSelect}
              onSaved={(updated) => setItems((prev) => prev.map((im) => (im.id === updated.id ? { ...im, ...updated } : im)))}
              onDeleted={(id) => { setItems((prev) => prev.filter((im) => im.id !== id)); setSelectedId(null); }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

// ── Modal picker ─────────────────────────────────────────────────────────────
export function MediaPickerModal({ api, title = "Choose an image", selectLabel, pageKey = "media", onSelect, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="bg-gray-50 rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white rounded-t-2xl">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700" title="Close (Esc)">
            <FiX size={18} />
          </button>
        </div>
        <div className="flex-1 min-h-0 p-5">
          <MediaBrowser api={api} mode="pick" pageKey={pageKey} selectLabel={selectLabel} onSelect={onSelect} fill />
        </div>
      </div>
    </div>
  );
}
