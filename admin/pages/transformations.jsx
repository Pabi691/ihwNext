import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { compressUnder2MB } from "@/components/compressImage";
import { FiUploadCloud, FiTrash2, FiArrowLeft, FiArrowRight, FiAlertCircle, FiImage } from "react-icons/fi";

const SETTINGS_KEY = "transformation_gallery";

// How many photos the homepage and branch pages show on mobile.
const MOBILE_COUNT = 4;

// What the storefront shows while no list is saved (the original four photos).
// Keep in sync with DEFAULT_IMAGES in the storefront's
// components/gallery/TransformationsGallery.jsx.
const DEFAULT_TRANSFORMATIONS = [
  { url: "https://www.indianhairworld.com/images/our-work-img4.jpg", alt: "Hair Weaving Services in Kolkata" },
  { url: "https://www.indianhairworld.com/images/our-work-img2.jpg", alt: "Best Hair Replacement Service Kolkata" },
  { url: "https://www.indianhairworld.com/images/our-work-img1.jpg", alt: "Hair Weaving Services in Salt Lake" },
  { url: "https://www.indianhairworld.com/images/our-work-img3.jpg", alt: "Best Hair Patch Service in Kolkata" },
];

// An empty or missing list means "the original four", same as the storefront.
function listFromSettings(raw) {
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
    const list = Array.isArray(arr) ? arr.filter((i) => i && typeof i.url === "string" && i.url.trim()) : [];
    return list.length ? list : DEFAULT_TRANSFORMATIONS;
  } catch {
    return DEFAULT_TRANSFORMATIONS;
  }
}

const iconBtn =
  "w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#04A9FF] hover:text-[#04A9FF] disabled:opacity-40 disabled:pointer-events-none transition-colors";

export default function Transformations() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [altDirty, setAltDirty]   = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");
  const busy = saving || uploading;

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_settings");
      setItems(listFromSettings(res.data?.settings?.[SETTINGS_KEY]));
    } catch {
      setError("Couldn't load the gallery.");
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchList();
  }, [ready, fetchList]);

  // Every change is saved straight away; update_settings only touches this key.
  const persist = async (next) => {
    setItems(next);
    setSaving(true); setError(""); setSuccess("");
    try {
      await api("post", "/update_settings", { [SETTINGS_KEY]: JSON.stringify(next) });
      setSuccess("Saved. The website shows the change within a minute.");
    } catch {
      setError("Couldn't save. Please try again.");
    }
    setSaving(false);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next);
  };

  const remove = (i) => {
    if (!window.confirm("Remove this photo from the Transformations gallery?")) return;
    persist(items.filter((_, k) => k !== i));
  };

  const setAlt = (i, alt) => {
    setItems((cur) => cur.map((it, k) => (k === i ? { ...it, alt } : it)));
    setAltDirty(true);
  };

  const saveAlt = () => {
    if (!altDirty) return;
    setAltDirty(false);
    persist(items);
  };

  // Upload the picked photos to the CDN and put them at the front (newest first).
  const pickFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length || busy) return;
    setUploading(true); setError(""); setSuccess("");
    const added = [];
    const failed = [];
    for (const [i, file] of files.entries()) {
      try {
        const baseName = `transformation-${Date.now()}-${i + 1}`;
        const small = await compressUnder2MB(file, baseName);
        if (!small) throw new Error("still over 2 MB after compression");
        const fd = new FormData();
        fd.append("image", small);
        fd.append("image_type", "transformation");
        fd.append("page_key", "gallery");
        fd.append("name", baseName);
        const up = await api("post", "/images", fd);
        const url = up.data?.data?.image_path;
        if (!url) throw new Error("no image_path in response");
        added.push({ url, alt: "Hair transformation before and after", addedAt: new Date().toISOString() });
      } catch {
        failed.push(file.name);
      }
    }
    setUploading(false);
    if (added.length) await persist([...added, ...items]);
    if (failed.length) setError(`Couldn't upload: ${failed.join(", ")}. Use JPG, PNG or WebP photos.`);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Transformations">
      <Head><title>Transformations — IHW Admin</title></Head>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="font-bold text-gray-900 text-xl">Transformations</h2>
          <p className="text-sm text-gray-400 mt-0.5 max-w-2xl">
            Before/after photos for the Transformations section. On mobile, the homepage and branch pages
            show the first {MOBILE_COUNT}; the gallery page shows all of them. New uploads go to the front.
            Square photos (1080 × 1080) fit best. Changes save automatically.
          </p>
        </div>
        <label
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#04A9FF] hover:bg-[#0090dd] transition-colors cursor-pointer ${
            busy ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <FiUploadCloud size={15} /> {uploading ? "Uploading…" : "Upload photos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => { pickFiles(e.target.files); e.target.value = ""; }}
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          <FiAlertCircle size={15} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <FiImage size={28} className="text-gray-300" />
          <p className="text-sm font-medium text-gray-600">No photos in the list</p>
          <p className="text-xs text-gray-400">The website shows the original four photos until you upload some.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <div key={`${i}-${it.url}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative aspect-square bg-gray-50">
                <img src={it.url} alt={it.alt || ""} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 min-w-[24px] h-6 px-1.5 inline-flex items-center justify-center rounded-full bg-black/60 text-white text-xs font-bold">
                  {i + 1}
                </span>
                {i < MOBILE_COUNT && (
                  <span className="absolute top-2 right-2 rounded-full bg-[#04A9FF] text-white text-[10px] font-bold px-2 py-0.5">
                    On mobile
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                <input
                  value={it.alt || ""}
                  onChange={(e) => setAlt(i, e.target.value)}
                  onBlur={saveAlt}
                  placeholder="Describe the photo (for Google)"
                  maxLength={120}
                  disabled={busy}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#04A9FF] transition-colors"
                />
                <div className="flex items-center gap-1.5">
                  <button type="button" title="Move earlier" aria-label="Move earlier" className={iconBtn}
                    disabled={busy || i === 0} onClick={() => move(i, -1)}>
                    <FiArrowLeft size={14} />
                  </button>
                  <button type="button" title="Move later" aria-label="Move later" className={iconBtn}
                    disabled={busy || i === items.length - 1} onClick={() => move(i, 1)}>
                    <FiArrowRight size={14} />
                  </button>
                  <button type="button" title="Remove" aria-label="Remove photo"
                    className={`${iconBtn} ml-auto hover:!border-red-300 hover:!text-red-500`}
                    disabled={busy} onClick={() => remove(i)}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
