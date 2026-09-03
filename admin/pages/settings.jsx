import { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSave, FiTag, FiAlertCircle, FiZap, FiImage, FiTrash2, FiBookmark, FiFolder, FiUploadCloud, FiGrid, FiChevronDown } from "react-icons/fi";

function Section({ title, icon: Icon, children, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <button
        type="button"
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-6 py-4 text-left ${collapsible ? "" : "cursor-default"}`}
        aria-expanded={open}
      >
        {Icon && <Icon size={15} className="text-[#04A9FF] flex-shrink-0" />}
        <h3 className="font-semibold text-gray-800 text-sm flex-1">{title}</h3>
        {collapsible && (
          <FiChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
        )}
      </button>
      {open && <div className="px-6 pb-6 pt-1 space-y-5 border-t border-gray-50">{children}</div>}
    </div>
  );
}

const L = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const I = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors";

const COLOR_OPTIONS = [
  { value: "red",    label: "Red",    preview: "bg-red-500" },
  { value: "orange", label: "Orange", preview: "bg-orange-500" },
  { value: "purple", label: "Purple", preview: "bg-purple-500" },
  { value: "blue",   label: "Blue",   preview: "bg-blue-500" },
  { value: "green",  label: "Green",  preview: "bg-green-500" },
];

// --- Festival theme --------------------------------------------------------

const PALETTE_FIELDS = [
  ["--rb-primary",         "Primary"],
  ["--rb-primary-hover",   "Primary hover"],
  ["--rb-primary-mid",     "Primary mid"],
  ["--rb-primary-mid2",    "Primary mid 2"],
  ["--rb-dark",            "Dark"],
  ["--rb-accent",          "Accent"],
  ["--rb-accent-light",    "Accent light"],
  ["--rb-accent-lighter",  "Accent lighter"],
  ["--rb-cream",           "Section bg"],
  ["--rb-cream-border",    "Card border"],
];

const DEFAULT_PALETTE = {
  "--rb-primary": "#7a1420",
  "--rb-primary-hover": "#8f1826",
  "--rb-primary-mid": "#6b0f16",
  "--rb-primary-mid2": "#5c0f16",
  "--rb-dark": "#4a0a10",
  "--rb-accent": "#d9932e",
  "--rb-accent-light": "#f0c96b",
  "--rb-accent-lighter": "#f5d98a",
  "--rb-cream": "#fdf3e4",
  "--rb-cream-border": "#f0e4cf",
};

const RANGOLI_POSITIONS = [
  ["top-left", "Top left"],
  ["top-center", "Top center"],
  ["top-right", "Top right"],
  ["left-center", "Left"],
  ["right-center", "Right"],
  ["bottom-left", "Bottom left"],
  ["bottom-center", "Bottom center"],
  ["bottom-right", "Bottom right"],
];
const RANGOLI_DEFAULT = { url: "", position: "top-right", size: 40, rotation: 0, opacity: 20 };

// absolute-position style for one rangoli placement (shared shape with the storefront)
function rangoliBoxStyle({ position = "top-right", size = 40, rotation = 0, opacity = 20 }) {
  const s = { position: "absolute", width: `${size}%`, opacity: (opacity ?? 20) / 100, pointerEvents: "none" };
  const OFF = "-4%";
  const tf = [];
  const isCenter = position.includes("center");
  if (position.includes("top")) s.top = OFF;
  if (position.includes("bottom")) s.bottom = OFF;
  if (position === "top-center" || position === "bottom-center") { s.left = "50%"; tf.push("translateX(-50%)"); }
  else if (position === "left-center") { s.left = OFF; s.top = "50%"; tf.push("translateY(-50%)"); }
  else if (position === "right-center") { s.right = OFF; s.top = "50%"; tf.push("translateY(-50%)"); }
  else if (!isCenter) {
    if (position.includes("left")) s.left = OFF;
    if (position.includes("right")) s.right = OFF;
  }
  if (rotation) tf.push(`rotate(${rotation}deg)`);
  if (tf.length) s.transform = tf.join(" ");
  return s;
}

const EMPTY_FESTIVAL = {
  active: false,
  mode: "custom", // "ai" | "custom" — in custom mode the AI generate button is hidden
  name: "",
  palette: { ...DEFAULT_PALETTE },
  hero: { eyebrow: "", line1: "", line2: "", tagline: "", trustedBy: "" },
  promo: { label: "", subtitle: "" },
  heroImages: [],
  rangoli: [], // up to 3 { url, position, size, rotation, opacity } — overrides the built-in motif
  bottomNav: { bg: "", bgImage: "", icons: ["", "", "", ""] }, // mobile bottom-nav overrides
  saleSection: { bg: "" }, // Special Sale Offers section background
};

const BOTTOM_NAV_LABELS = ["Home", "Shop", "Cart", "Profile"];

function normalizeBottomNav(d) {
  const b = d && d.bottomNav;
  const base = { bg: "", bgImage: "", icons: ["", "", "", ""] };
  if (!b || typeof b !== "object") return base;
  return {
    bg: typeof b.bg === "string" ? b.bg : "",
    bgImage: typeof b.bgImage === "string" ? b.bgImage : "",
    icons: [0, 1, 2, 3].map((i) => (Array.isArray(b.icons) && typeof b.icons[i] === "string" ? b.icons[i] : "")),
  };
}

function cleanBottomNav(b) {
  const bn = normalizeBottomNav({ bottomNav: b });
  bn.bg = bn.bg.trim();
  bn.bgImage = bn.bgImage.trim();
  bn.icons = bn.icons.map((s) => s.trim());
  return bn;
}

function festivalFromSettings(raw) {
  if (!raw) return { ...EMPTY_FESTIVAL };
  let d;
  try { d = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { return { ...EMPTY_FESTIVAL }; }
  if (!d || typeof d !== "object") return { ...EMPTY_FESTIVAL };
  const lines = Array.isArray(d.hero?.titleLines) ? d.hero.titleLines : [];
  const images = Array.isArray(d.heroImages)
    ? d.heroImages.filter(Boolean)
    : (d.heroImageUrl ? [d.heroImageUrl] : []);
  return {
    active: !!d.active,
    mode: d.mode === "ai" ? "ai" : "custom",
    name: d.name || "",
    palette: { ...DEFAULT_PALETTE, ...(d.palette || {}) },
    hero: {
      eyebrow: d.hero?.eyebrow || "",
      line1: lines[0] || "",
      line2: lines[1] || "",
      tagline: d.hero?.tagline || "",
      trustedBy: d.hero?.trustedBy || "",
    },
    promo: {
      label: d.promo?.label || "",
      subtitle: d.promo?.subtitle || "",
    },
    heroImages: images.slice(0, 3),
    rangoli: normalizeRangoli(d),
    bottomNav: normalizeBottomNav(d),
    saleSection: { bg: typeof d.saleSection?.bg === "string" ? d.saleSection.bg : "" },
  };
}

function normalizeRangoli(d) {
  if (Array.isArray(d.rangoli)) {
    return d.rangoli
      .filter((r) => r && typeof r.url === "string" && r.url.trim())
      .map((r) => ({ ...RANGOLI_DEFAULT, ...r, url: r.url.trim() }))
      .slice(0, 3);
  }
  if (typeof d.rangoliImage === "string" && d.rangoliImage.trim()) {
    return [{ ...RANGOLI_DEFAULT, url: d.rangoliImage.trim() }];
  }
  return [];
}

function festivalToSettings(f) {
  const images = (f.heroImages || []).filter(Boolean).slice(0, 3);
  return JSON.stringify({
    active: !!f.active,
    mode: f.mode === "ai" ? "ai" : "custom",
    name: f.name.trim(),
    palette: f.palette,
    hero: {
      eyebrow: f.hero.eyebrow.trim(),
      titleLines: [f.hero.line1.trim(), f.hero.line2.trim()].filter(Boolean),
      tagline: f.hero.tagline.trim(),
      trustedBy: f.hero.trustedBy.trim(),
    },
    promo: { label: f.promo.label.trim(), subtitle: f.promo.subtitle.trim() },
    heroImages: images,
    heroImageUrl: images[0] || "", // back-compat for anything still reading the single key
    rangoli: (f.rangoli || [])
      .filter((r) => r && r.url)
      .map((r) => ({
        url: r.url.trim(),
        position: r.position || "top-right",
        size: Number(r.size) || 40,
        rotation: Number(r.rotation) || 0,
        opacity: r.opacity == null ? 20 : Number(r.opacity),
      }))
      .slice(0, 3),
    bottomNav: cleanBottomNav(f.bottomNav),
    saleSection: { bg: (f.saleSection?.bg || "").trim() },
  });
}

function b64toBlob(b64, mime) {
  const chars = atob(b64);
  const bytes = new Uint8Array(chars.length);
  for (let i = 0; i < chars.length; i++) bytes[i] = chars.charCodeAt(i);
  return new Blob([bytes], { type: mime || "image/png" });
}

// Downscale + re-encode a blob to a JPEG File under the backend's 2 MB
// /api/images cap. AI-generated PNGs routinely come back 2-4 MB. Returns null
// only if it cannot be made to fit at all.
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const ACCEPTED_UPLOAD_TYPE = /^image\/(jpeg|png|webp)$/;
const uploadExt = (t) => (t === "image/webp" ? "webp" : t === "image/png" ? "png" : "jpg");

async function decodeBlob(blob) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob);
    } catch {
      /* fall through to <img> decode */
    }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image decode failed"));
    };
    img.src = url;
  });
}

async function compressUnder2MB(blob, baseName) {
  const passthrough = () =>
    blob.size <= MAX_UPLOAD_BYTES && ACCEPTED_UPLOAD_TYPE.test(blob.type)
      ? new File([blob], `${baseName}.${uploadExt(blob.type)}`, { type: blob.type })
      : null;

  // Already small enough and an accepted type — no re-encode needed.
  const asIs = passthrough();
  if (asIs) return asIs;

  try {
    const bmp = await decodeBlob(blob);
    const srcW = bmp.width || bmp.naturalWidth || 1280;
    const srcH = bmp.height || bmp.naturalHeight || 1280;
    const scale = Math.min(1, 1280 / srcW);
    const w = Math.max(1, Math.round(srcW * scale));
    const h = Math.max(1, Math.round(srcH * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    ctx.drawImage(bmp, 0, 0, w, h);
    if (typeof bmp.close === "function") bmp.close();
    for (const q of [0.85, 0.75, 0.65, 0.55]) {
      const out = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", q));
      if (out && out.size <= MAX_UPLOAD_BYTES) {
        return new File([out], `${baseName}.jpg`, { type: "image/jpeg" });
      }
    }
  } catch {
    /* re-encode unavailable — fall back to raw passthrough if it already fits */
  }
  return passthrough();
}

// ---- saved theme library -------------------------------------------------

function libraryFromSettings(raw) {
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(arr) ? arr.filter((e) => e && e.name) : [];
  } catch { return []; }
}

// editor state -> a stored library entry (no `active` flag; images are URLs)
function festToEntry(f, id) {
  return {
    id: id || `t_${Date.now()}`,
    name: f.name.trim(),
    savedAt: new Date().toISOString(),
    mode: f.mode === "ai" ? "ai" : "custom",
    palette: f.palette,
    hero: { ...f.hero },
    promo: { ...f.promo },
    heroImages: (f.heroImages || []).filter(Boolean).slice(0, 3),
    rangoli: (f.rangoli || []).filter((r) => r && r.url).map((r) => ({ ...r })).slice(0, 3),
    bottomNav: cleanBottomNav(f.bottomNav),
    saleSection: { bg: (f.saleSection?.bg || "").trim() },
  };
}

// a stored library entry -> editor state (keep current `active` as-is)
function entryToFest(entry, active) {
  return {
    active: !!active,
    mode: entry.mode === "ai" ? "ai" : "custom",
    name: entry.name || "",
    palette: { ...DEFAULT_PALETTE, ...(entry.palette || {}) },
    hero: { ...EMPTY_FESTIVAL.hero, ...(entry.hero || {}) },
    promo: { ...EMPTY_FESTIVAL.promo, ...(entry.promo || {}) },
    heroImages: Array.isArray(entry.heroImages) ? entry.heroImages.filter(Boolean).slice(0, 3) : [],
    rangoli: normalizeRangoli(entry),
    bottomNav: normalizeBottomNav(entry),
    saleSection: { bg: typeof entry.saleSection?.bg === "string" ? entry.saleSection.bg : "" },
  };
}

// Picker for images already on cdn.indianhairworld.com/page-images/ (GET /api/images).
function MediaPicker({ api, onPick, onClose }) {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const [festOnly, setFestOnly] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api("get", "/images");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) setItems(list.slice().reverse()); // newest first
      } catch {
        if (!cancelled) { setErr("Could not load the media library."); setItems([]); }
      }
    })();
    return () => { cancelled = true; };
  }, [api]);

  const filtered = (items || []).filter((im) => {
    if (festOnly && im.page_key !== "festival") return false;
    if (q && !`${im.name || ""} ${im.image_path || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">cdn.indianhairworld.com/page-images/</h3>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
            className="ml-auto text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#04A9FF]" />
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            <input type="checkbox" checked={festOnly} onChange={(e) => setFestOnly(e.target.checked)} /> Festival only
          </label>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
        </div>
        <div className="p-4 overflow-y-auto">
          {items === null ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : err ? (
            <p className="text-sm text-red-500">{err}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400">No images found.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((im) => (
                <button key={im.id} type="button" onClick={() => onPick(im.image_path)}
                  className="text-left border border-gray-200 rounded-xl overflow-hidden hover:border-[#04A9FF] transition-colors">
                  <div className="aspect-square bg-gray-50">
                    <img src={im.image_path} alt={im.name || ""} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-500 px-1.5 py-1 truncate">{im.name || im.image_path.split("/").pop()}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact labelled slider used for rangoli size / rotation / opacity.
function Range({ label, value, min, max, step = 1, suffix = "", onChange }) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-gray-500">
      <span className="w-14 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[#04A9FF]" />
      <span className="w-10 text-right tabular-nums text-gray-600">{value}{suffix}</span>
    </label>
  );
}

// Decorative rangoli / mandala — palette-tinted, drawn (not AI).
function RangoliMotif({ color, className, style }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none" aria-hidden>
      <g stroke={color} strokeWidth="1.4">
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            <path d="M100 18 C 113 44, 113 62, 100 82 C 87 62, 87 44, 100 18 Z" fill={color} fillOpacity="0.16" />
            <circle cx="100" cy="24" r="2.6" fill={color} />
            <path d="M100 86 q 13 11 0 24 q -13 -13 0 -24" fill={color} fillOpacity="0.1" />
          </g>
        ))}
        <circle cx="100" cy="100" r="13" />
        <circle cx="100" cy="100" r="6" fill={color} />
        <circle cx="100" cy="100" r="28" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="44" strokeDasharray="1 7" />
      </g>
    </svg>
  );
}

// Renders the configured rangoli images (with placement) over a container,
// or two drawn motifs when none are set.
function RangoliLayer({ rangoli, color }) {
  if (rangoli && rangoli.length) {
    return rangoli.map((r, i) => (
      <img key={i} src={r.url} alt="" aria-hidden className="select-none" style={rangoliBoxStyle(r)} />
    ));
  }
  return (
    <>
      <RangoliMotif color={color} className="absolute -right-8 -top-8 w-28 h-28 opacity-30 pointer-events-none" />
      <RangoliMotif color={color} className="absolute -left-10 bottom-6 w-24 h-24 opacity-20 pointer-events-none" />
    </>
  );
}

// Crossfade cycler — one image fades out, the next fades in ("vanish" style).
function FadeSlider({ images, palette, interval = 2200 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    if (!images || images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-40 rounded-xl mt-3 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${palette["--rb-primary-mid"]}, ${palette["--rb-dark"]})` }}>
        <span className="absolute inset-0 flex items-center justify-center text-white/40 text-[11px]">
          images appear here after Generate / upload
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 rounded-xl mt-3 overflow-hidden bg-black/20">
      {images.map((src, i) => (
        <img key={src + i} src={src} alt="" draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }} />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
          {images.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: i === idx ? palette["--rb-accent"] : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
      )}
    </div>
  );
}

// Live preview — iframes the real storefront (/theme-preview/live) and pushes
// the in-editor theme to it over postMessage. Scrollable, full page. Phone or
// desktop: the frame is rendered at a real logical width so the storefront's
// responsive breakpoints apply, then scaled down to fit this column.
const PREVIEW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// `box` = rendered width in the CRM column (phone) / the wider popped-out panel
// (desktop). The right column is 340px, so desktop shifts left over the editor.
const PREVIEW_COLUMN = 340;
const PREVIEW_FRAMES = {
  phone:   { w: 390,  h: 780,  box: 320 },
  desktop: { w: 1280, h: 1440, box: 560 },
};

function FestivalPreview({ fest }) {
  const iframeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("phone");

  const frame = PREVIEW_FRAMES[view];
  const scale = frame.box / frame.w;

  // iframe announces itself
  useEffect(() => {
    const onMsg = (e) => { if (e?.data?.type === "ihw-preview-ready") setReady(true); };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // push the current editor theme (debounced), exactly as it would be saved
  useEffect(() => {
    if (!ready || !iframeRef.current) return;
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "ihw-festival-theme", theme: festivalToSettings(fest), view },
        "*"
      );
    }, 250);
    return () => clearTimeout(t);
  }, [fest, ready, view]);

  const switchView = (v) => {
    if (v === view) return;
    setReady(false);      // new iframe load will re-announce, re-pushing the theme
    setView(v);
  };

  const popLeft = view === "desktop" ? Math.max(0, frame.box - PREVIEW_COLUMN) : 0;

  return (
    <div
      style={{
        width: frame.box,
        marginLeft: -popLeft,
        position: "relative",
        zIndex: popLeft ? 20 : "auto",
      }}
    >
      <div className="flex justify-center gap-1 mb-2">
        {["phone", "desktop"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => switchView(k)}
            className={`px-3 py-1 text-[11px] font-semibold rounded-full border capitalize transition-colors ${
              view === k
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div
        className={`bg-gray-900 shadow-xl overflow-hidden ${
          view === "phone"
            ? "rounded-[30px] border-[3px] border-gray-900 pb-3"
            : "rounded-xl border border-gray-300"
        }`}
      >
        <div style={{ width: frame.box, height: frame.h * scale, overflow: "hidden" }}>
          <iframe
            key={view}
            ref={iframeRef}
            src={`${PREVIEW_SITE}/theme-preview/live?view=${view}`}
            title="Live storefront preview"
            style={{
              width: frame.w,
              height: frame.h,
              border: 0,
              background: "#fff",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
      <p className="text-[11px] text-gray-400 text-center mt-2">
        Live storefront · scroll inside · updates as you edit
      </p>
    </div>
  );
}

// ------------------------------------------------------------------------

export default function Settings() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  const [form, setForm] = useState({
    sale_label:        "SALE",
    sale_banner_text:  "Limited time offers — shop now!",
    sale_badge_color:  "red",
  });
  const [fest, setFest]         = useState({ ...EMPTY_FESTIVAL });
  const [library, setLibrary]   = useState([]);
  const [libBusy, setLibBusy]   = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pickerFor, setPickerFor] = useState(null); // { kind: "hero" | "rangoli" }
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genStep, setGenStep]       = useState("");
  const [genError, setGenError]     = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setFestPalette = (key, v) => setFest((f) => ({ ...f, palette: { ...f.palette, [key]: v } }));
  const setFestHero = (k, v) => setFest((f) => ({ ...f, hero: { ...f.hero, [k]: v } }));
  const setFestPromo = (k, v) => setFest((f) => ({ ...f, promo: { ...f.promo, [k]: v } }));

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_settings");
      if (res.data?.settings) {
        const s = res.data.settings;
        setForm((f) => ({ ...f, ...s }));
        setFest(festivalFromSettings(s.festival_theme));
        setLibrary(libraryFromSettings(s.festival_theme_library));
      }
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchSettings();
  }, [ready, fetchSettings]);

  // Persist the library (and the current active theme) to the backend now.
  const persistLibrary = async (nextLib) => {
    await api("post", "/update_settings", {
      ...form,
      festival_theme: festivalToSettings(fest),
      festival_theme_library: JSON.stringify(nextLib),
    });
  };

  // Save the current editor state into the library (upsert by name).
  const saveToLibrary = async () => {
    const name = fest.name.trim();
    if (!name || libBusy) return;
    setLibBusy("save"); setError(""); setSuccess("");
    try {
      const i = library.findIndex((e) => e.name.trim().toLowerCase() === name.toLowerCase());
      const entry = festToEntry(fest, i >= 0 ? library[i].id : undefined);
      const nextLib = i >= 0
        ? library.map((e, idx) => (idx === i ? entry : e))
        : [...library, entry];
      await persistLibrary(nextLib);
      setLibrary(nextLib);
      setSuccess(i >= 0 ? `Updated “${name}” in the library.` : `Saved “${name}” to the library.`);
    } catch {
      setError("Could not save to the library.");
    }
    setLibBusy("");
  };

  const loadFromLibrary = (entry) => {
    setFest(entryToFest(entry, fest.active));
    setGenError(""); setSuccess(`Loaded “${entry.name}”. Tick Active + Save Settings to make it live.`);
  };

  const deleteFromLibrary = async (entry) => {
    if (libBusy || !window.confirm(`Delete “${entry.name}” from the library?`)) return;
    setLibBusy(entry.id); setError(""); setSuccess("");
    try {
      const nextLib = library.filter((e) => e.id !== entry.id);
      await persistLibrary(nextLib);
      setLibrary(nextLib);
      setSuccess(`Deleted “${entry.name}”.`);
    } catch {
      setError("Could not delete from the library.");
    }
    setLibBusy("");
  };

  const slugify = (s) => (s || "festival").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Upload a File to the backend -> https://cdn.indianhairworld.com/page-images/<name>.<ext>
  const uploadToCdn = async (file, baseName) => {
    const fd = new FormData();
    fd.append("image", file);
    fd.append("image_type", "festival_hero");
    fd.append("page_key", "festival");
    fd.append("name", baseName);
    const up = await api("post", "/images", fd);
    return up.data?.data?.image_path || "";
  };

  // Upload one AI-generated (base64) image, compressed to clear the 2 MB cap.
  const uploadImage = async (img, name, i) => {
    const slug = slugify(name);
    const baseName = `festival-${slug}-${i + 1}`;
    const file = await compressUnder2MB(b64toBlob(img.base64, img.mime), baseName);
    if (!file) throw new Error("image still over 2 MB after compression");
    return uploadToCdn(file, baseName);
  };

  // Upload hero images the user picked from their computer.
  const pickHeroImages = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => /^image\/(jpe?g|png|webp)$/.test(f.type));
    if (!files.length || uploadBusy) return;
    setUploadBusy(true); setError(""); setSuccess(""); setGenError("");
    const slug = slugify(fest.name.trim());
    const existing = fest.heroImages.filter(Boolean);
    const picked = files.slice(0, Math.max(0, 3 - existing.length));
    const added = [];
    for (const file of picked) {
      if (file.size > 2 * 1024 * 1024) { setError(`"${file.name}" is over 2 MB and was skipped.`); continue; }
      try {
        const u = await uploadToCdn(file, `festival-${slug}-${existing.length + added.length + 1}`);
        if (u) added.push(u);
      } catch { setError("An image upload failed."); }
    }
    if (added.length) {
      setFest((f) => ({ ...f, heroImages: [...f.heroImages.filter(Boolean), ...added].slice(0, 3) }));
      setSuccess(`Uploaded ${added.length} image${added.length > 1 ? "s" : ""} to the CDN.`);
    }
    if (files.length > picked.length) setError("Only 3 hero images are kept — extra files were ignored.");
    setUploadBusy(false);
  };

  // Upload one or more rangoli / decoration images (up to 3, like hero images).
  const pickRangoli = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => /^image\/(jpe?g|png|webp|svg\+xml)$/.test(f.type));
    if (!files.length || uploadBusy) return;
    setUploadBusy(true); setError(""); setSuccess("");
    const slug = slugify(fest.name.trim());
    const existing = fest.rangoli.filter((r) => r.url);
    const picked = files.slice(0, Math.max(0, 3 - existing.length));
    const startPos = ["top-right", "bottom-left", "top-left"];
    const added = [];
    for (const file of picked) {
      if (file.size > 2 * 1024 * 1024) { setError(`"${file.name}" is over 2 MB and was skipped.`); continue; }
      try {
        const u = await uploadToCdn(file, `festival-${slug}-rangoli-${existing.length + added.length + 1}`);
        if (u) added.push({ ...RANGOLI_DEFAULT, url: u, position: startPos[existing.length + added.length] || "top-right" });
      } catch { setError("A rangoli upload failed."); }
    }
    if (added.length) {
      setFest((f) => ({ ...f, rangoli: [...f.rangoli.filter((r) => r.url), ...added].slice(0, 3) }));
      setSuccess(`Uploaded ${added.length} rangoli image${added.length > 1 ? "s" : ""} to the CDN.`);
    }
    setUploadBusy(false);
  };

  const setRangoliField = (i, k, v) =>
    setFest((f) => ({ ...f, rangoli: f.rangoli.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)) }));
  const setRangoliUrl = (i, url) =>
    setFest((f) => {
      const arr = [...f.rangoli];
      if (arr[i]) arr[i] = { ...arr[i], url };
      else arr[i] = { ...RANGOLI_DEFAULT, url };
      return { ...f, rangoli: arr.filter((r, idx) => r.url || idx < arr.length - 1) };
    });
  const removeRangoli = (i) =>
    setFest((f) => ({ ...f, rangoli: f.rangoli.filter((_, idx) => idx !== i) }));

  // ---- bottom nav ----
  const setBottomNav = (k, v) =>
    setFest((f) => ({ ...f, bottomNav: { ...f.bottomNav, [k]: v } }));
  const setBottomNavIcon = (i, url) =>
    setFest((f) => {
      const icons = [...(f.bottomNav.icons || ["", "", "", ""])];
      icons[i] = url;
      return { ...f, bottomNav: { ...f.bottomNav, icons } };
    });

  const pickBottomNavBg = async (fileList) => {
    const file = Array.from(fileList || [])[0];
    if (!file || uploadBusy) return;
    if (file.size > 2 * 1024 * 1024) { setError(`"${file.name}" is over 2 MB.`); return; }
    setUploadBusy(true); setError(""); setSuccess("");
    try {
      const u = await uploadToCdn(file, `festival-${slugify(fest.name.trim())}-navbg`);
      if (u) { setBottomNav("bgImage", u); setSuccess("Bottom-nav background uploaded."); }
    } catch { setError("Upload failed."); }
    setUploadBusy(false);
  };

  const pickBottomNavIcon = async (i, fileList) => {
    const file = Array.from(fileList || [])[0];
    if (!file || uploadBusy) return;
    if (file.size > 512 * 1024) { setError(`Icon "${file.name}" is over 512 KB.`); return; }
    setUploadBusy(true); setError(""); setSuccess("");
    try {
      const u = await uploadToCdn(file, `festival-${slugify(fest.name.trim())}-navicon-${i + 1}`);
      if (u) { setBottomNavIcon(i, u); setSuccess(`${BOTTOM_NAV_LABELS[i]} icon uploaded.`); }
    } catch { setError("Icon upload failed."); }
    setUploadBusy(false);
  };

  // Add an image chosen from the CDN library.
  const handlePicked = (url) => {
    if (!pickerFor || !url) { setPickerFor(null); return; }
    if (pickerFor.kind === "hero") {
      if (fest.heroImages.filter(Boolean).length >= 3) setError("All 3 hero slots are full — remove one first.");
      else setFest((f) => ({ ...f, heroImages: [...f.heroImages.filter(Boolean), url].slice(0, 3) }));
    } else if (pickerFor.kind === "rangoli") {
      const n = fest.rangoli.filter((r) => r.url).length;
      if (n >= 3) setError("All 3 rangoli slots are full — remove one first.");
      else {
        const pos = ["top-right", "bottom-left", "top-left"][n] || "top-right";
        setFest((f) => ({ ...f, rangoli: [...f.rangoli.filter((r) => r.url), { ...RANGOLI_DEFAULT, url, position: pos }].slice(0, 3) }));
      }
    } else if (pickerFor.kind === "navbg") {
      setBottomNav("bgImage", url);
    } else if (pickerFor.kind === "navicon") {
      setBottomNavIcon(pickerFor.index, url);
    }
    setPickerFor(null);
  };

  const handleGenerate = async () => {
    const name = fest.name.trim();
    if (!name || genLoading || fest.mode === "custom") return;
    setGenError(""); setGenStep("Building theme…"); setGenLoading(true);
    try {
      const res = await fetch("/api/ai/festival-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festival: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Generation failed.");

      // palette + copy first, so the structure is complete even if images lag
      setFest((f) => ({
        ...f,
        name: data.name || name,
        palette: { ...DEFAULT_PALETTE, ...(data.palette || {}) },
        hero: {
          ...f.hero,
          eyebrow: data.hero?.eyebrow || f.hero.eyebrow,
          line1: data.hero?.titleLines?.[0] || "",
          line2: data.hero?.titleLines?.[1] || "",
          tagline: data.hero?.tagline || f.hero.tagline,
          trustedBy: data.hero?.trustedBy || f.hero.trustedBy,
        },
        promo: {
          label: data.promo?.label || f.promo.label,
          subtitle: data.promo?.subtitle || f.promo.subtitle,
        },
      }));

      const imgs = Array.isArray(data.images) ? data.images : [];
      if (!imgs.length) {
        setGenStep("");
        setGenError(
          `Theme built. AI image generation is unavailable${data.imageError ? ` (${data.imageError})` : ""} — use “Upload from computer” below to add up to 3 hero images.`
        );
        return; // keep any hero images already set
      }

      setGenStep(`Uploading ${imgs.length} image${imgs.length > 1 ? "s" : ""} to CDN…`);
      const urls = [];
      const failures = [];
      for (let i = 0; i < imgs.length; i++) {
        try {
          const u = await uploadImage(imgs[i], data.name || name, i);
          if (u) urls.push(u);
          else failures.push(`#${i + 1}: upload returned no URL`);
        } catch (err) {
          const detail =
            err?.response?.data?.errors?.image?.[0] ||
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            (err?.response?.status ? `HTTP ${err.response.status}` : "") ||
            err?.message ||
            "unknown error";
          failures.push(`#${i + 1}: ${detail}`);
        }
      }
      setFest((f) => ({ ...f, heroImages: urls }));
      if (urls.length < imgs.length) {
        setGenError(`${urls.length}/${imgs.length} images uploaded. ${failures.join(" · ")}. Regenerate or add URLs manually.`);
      }
    } catch (e) {
      setGenError(e.message || "Something went wrong.");
    } finally {
      setGenLoading(false);
      setGenStep("");
    }
  };

  const removeImage = (idx) =>
    setFest((f) => ({ ...f, heroImages: f.heroImages.filter((_, i) => i !== idx) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      await api("post", "/update_settings", {
        ...form,
        festival_theme: festivalToSettings(fest),
        festival_theme_library: JSON.stringify(library),
      });
      setSuccess("Settings saved successfully.");
    } catch {
      setError("Failed to save settings.");
    }
    setSaving(false);
  };

  if (!ready) return null;

  const p = fest.palette;

  return (
    <AdminLayout title="Settings">
      <Head><title>Settings — IHW Admin</title></Head>

      <div className="mb-6">
        <h2 className="font-bold text-gray-900 text-xl">Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Configure global sale settings, festival theme and other options</p>
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

      <form onSubmit={handleSave} className="space-y-5">

        {loading ? (
          <div className="space-y-3 animate-pulse max-w-2xl">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Sale Settings */}
            <Section title="Sale Settings" icon={FiTag} collapsible defaultOpen={false}>

              <div className="grid gap-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto] md:items-start">
                <div>
                  <label className={L}>Sale Label</label>
                  <input value={form.sale_label} onChange={(e) => set("sale_label", e.target.value)}
                    placeholder="e.g. MEGA SALE" className={I} maxLength={20} />
                  <p className="text-xs text-gray-400 mt-1">On the sale badge (max 20 chars).</p>
                </div>

                <div>
                  <label className={L}>Banner Text</label>
                  <input value={form.sale_banner_text} onChange={(e) => set("sale_banner_text", e.target.value)}
                    placeholder="e.g. Grab amazing deals before they're gone!"
                    className={I} maxLength={120} />
                  <p className="text-xs text-gray-400 mt-1">Shown below the sale section title.</p>
                </div>

                <div>
                  <label className={L}>Badge Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((c) => (
                      <button key={c.value} type="button" onClick={() => set("sale_badge_color", c.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          form.sale_badge_color === c.value
                            ? "border-[#04A9FF] bg-blue-50 text-[#04A9FF]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        <span className={`w-3 h-3 rounded-full ${c.preview}`} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Products are chosen by the <b>is_sale</b> flag in the product editor.
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-500 font-medium">Preview:</span>
                <span className={`inline-flex items-center gap-1 text-white text-xs font-bold px-3 py-1.5 rounded-full ${
                  form.sale_badge_color === "orange" ? "bg-orange-500" :
                  form.sale_badge_color === "purple" ? "bg-purple-500" :
                  form.sale_badge_color === "blue"   ? "bg-blue-500" :
                  form.sale_badge_color === "green"  ? "bg-green-500" :
                  "bg-red-500"
                }`}>
                  🔥 {form.sale_label || "SALE"}
                </span>
                <span className="text-xs text-gray-400 truncate">{form.sale_banner_text}</span>
              </div>
            </Section>

            {/* Festival Theme */}
            <Section title="Festival Theme (storefront)" icon={FiZap} collapsible defaultOpen>

              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={fest.active}
                    onChange={(e) => setFest((f) => ({ ...f, active: e.target.checked }))} />
                  Theme active on storefront
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{fest.active ? "Live" : "Off — storefront uses default"}</span>
                  <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white text-xs font-bold">
                    {["custom", "ai"].map((m) => (
                      <button key={m} type="button"
                        onClick={() => setFest((f) => ({ ...f, mode: m }))}
                        className={`px-3 py-1.5 transition-colors ${
                          fest.mode === m ? "bg-[#04A9FF] text-white" : "text-gray-500 hover:text-gray-700"
                        }`}>
                        {m === "ai" ? "AI" : "Custom"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {fest.mode === "custom" && (
                <p className="text-xs text-gray-500 -mt-2">
                  <b>Custom mode</b> — AI generation is off. Set the palette, copy, hero images and rangoli entirely by hand.
                </p>
              )}

              {/* two columns on desktop: editor left, live preview pinned right */}
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

                {/* ---- editor ---- */}
                <div className="space-y-5">

                  {/* Saved theme library */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        <FiFolder size={12} /> Saved themes
                      </span>
                      <button type="button" onClick={saveToLibrary} disabled={!fest.name.trim() || !!libBusy}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors disabled:opacity-50">
                        <FiBookmark size={12} /> {libBusy === "save" ? "Saving…" : "Save current to library"}
                      </button>
                    </div>
                    {library.length === 0 ? (
                      <p className="text-xs text-gray-400">No saved themes yet. Build one, then “Save current to library”.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {library.map((entry) => {
                          const isCurrent = entry.name.trim().toLowerCase() === fest.name.trim().toLowerCase();
                          return (
                            <span key={entry.id}
                              className={`inline-flex items-center gap-1 rounded-full border pl-3 pr-1.5 py-1 text-xs ${
                                isCurrent ? "border-[#04A9FF] bg-blue-50 text-[#04A9FF]" : "border-gray-200 bg-white text-gray-700"
                              }`}>
                              <button type="button" onClick={() => loadFromLibrary(entry)} className="font-semibold" title="Load into editor">
                                {entry.name}
                              </button>
                              <button type="button" onClick={() => deleteFromLibrary(entry)} disabled={!!libBusy}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-40" title="Delete">
                                <FiTrash2 size={12} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[11px] text-gray-400 mt-2">
                      Loading a theme fills the editor. Tick <b>Theme active on storefront</b> + <b>Save Settings</b> to make it live.
                    </p>
                  </div>

                  <div>
                    <label className={L}>Festival name</label>
                    <div className="flex gap-2">
                      <input value={fest.name} onChange={(e) => setFest((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Diwali" className={I} maxLength={60} />
                      {fest.mode === "ai" && (
                        <button type="button" onClick={handleGenerate} disabled={genLoading || !fest.name.trim()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap">
                          <FiZap size={14} /> {genLoading ? (genStep || "Generating…") : "Generate with AI"}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {fest.mode === "ai"
                        ? "Builds palette + hero & promo copy from the name, and tries to generate 3 Ghibli-style hero images. Every field stays editable."
                        : "Custom mode — used only as the label. Fill everything below by hand."}
                    </p>
                    {genError && <p className="text-xs text-amber-600 mt-1">⚠ {genError}</p>}
                  </div>

                  {/* Palette */}
                  <div>
                    <label className={L}>Colour palette</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PALETTE_FIELDS.map(([key, lbl]) => (
                        <div key={key} className="flex items-center gap-2">
                          <input type="color" value={p[key]} onChange={(e) => setFestPalette(key, e.target.value)}
                            className="w-8 h-8 rounded border border-gray-200 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 leading-tight">{lbl}</p>
                            <input value={p[key]} onChange={(e) => setFestPalette(key, e.target.value)}
                              className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 outline-none focus:border-[#04A9FF]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hero copy */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={L}>Hero eyebrow</label>
                      <input value={fest.hero.eyebrow} onChange={(e) => setFestHero("eyebrow", e.target.value)} className={I} maxLength={24} />
                    </div>
                    <div>
                      <label className={L}>Trusted by</label>
                      <input value={fest.hero.trustedBy} onChange={(e) => setFestHero("trustedBy", e.target.value)} className={I} maxLength={40} />
                    </div>
                    <div>
                      <label className={L}>Title line 1</label>
                      <input value={fest.hero.line1} onChange={(e) => setFestHero("line1", e.target.value)} className={I} maxLength={20} />
                    </div>
                    <div>
                      <label className={L}>Title line 2 (optional)</label>
                      <input value={fest.hero.line2} onChange={(e) => setFestHero("line2", e.target.value)} className={I} maxLength={20} />
                    </div>
                    <div className="col-span-2">
                      <label className={L}>Hero tagline</label>
                      <input value={fest.hero.tagline} onChange={(e) => setFestHero("tagline", e.target.value)} className={I} maxLength={60} />
                    </div>
                  </div>

                  {/* Promo strip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={L}>Promo strip label</label>
                      <input value={fest.promo.label} onChange={(e) => setFestPromo("label", e.target.value)} className={I} maxLength={60} />
                    </div>
                    <div>
                      <label className={L}>Promo strip subtitle</label>
                      <input value={fest.promo.subtitle} onChange={(e) => setFestPromo("subtitle", e.target.value)} className={I} maxLength={80} />
                    </div>
                  </div>

                  {/* Hero images (up to 3, cross-fade on storefront) */}
                  <div>
                    <label className={L}><span className="flex items-center gap-1"><FiImage size={11} /> Hero images — up to 3, cross-fade</span></label>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <label className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        uploadBusy || fest.heroImages.filter(Boolean).length >= 3
                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#04A9FF] hover:text-[#04A9FF]"
                      }`}>
                        <FiUploadCloud size={13} /> {uploadBusy ? "Uploading…" : "Upload from computer"}
                        <input type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden"
                          disabled={uploadBusy || fest.heroImages.filter(Boolean).length >= 3}
                          onChange={(e) => { pickHeroImages(e.target.files); e.target.value = ""; }} />
                      </label>
                      <button type="button" onClick={() => setPickerFor({ kind: "hero" })}
                        disabled={fest.heroImages.filter(Boolean).length >= 3}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <FiGrid size={13} /> Choose from CDN
                      </button>
                      <span className="text-[11px] text-gray-400">
                        max 3 · ≤ 2 MB each · jpg / png / webp
                      </span>
                    </div>

                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                            {fest.heroImages[i]
                              ? <img src={fest.heroImages[i]} alt="" className="w-full h-full object-cover" />
                              : null}
                          </div>
                          <input
                            value={fest.heroImages[i] || ""}
                            onChange={(e) => setFest((f) => {
                              const arr = [...f.heroImages];
                              arr[i] = e.target.value;
                              return { ...f, heroImages: arr.filter((v, idx) => v || idx < arr.length - 1) };
                            })}
                            placeholder={`Image ${i + 1} — upload above, or paste a cdn.indianhairworld.com/page-images/ URL`}
                            className={I}
                          />
                          {fest.heroImages[i] && (
                            <button type="button" onClick={() => removeImage(i)}
                              className="text-red-500 hover:text-red-600 shrink-0" title="Remove">
                              <FiTrash2 size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Blank slots are ignored. With one image it just shows still; with 2–3 they cross-fade.</p>
                  </div>

                  {/* Rangoli / decoration images (up to 3, positioned) */}
                  <div>
                    <label className={L}><span className="flex items-center gap-1"><FiImage size={11} /> Rangoli / decoration — up to 3</span></label>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <label className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        uploadBusy || fest.rangoli.filter((r) => r.url).length >= 3
                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#04A9FF] hover:text-[#04A9FF]"
                      }`}>
                        <FiUploadCloud size={13} /> {uploadBusy ? "Uploading…" : "Upload from computer"}
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" multiple className="hidden"
                          disabled={uploadBusy || fest.rangoli.filter((r) => r.url).length >= 3}
                          onChange={(e) => { pickRangoli(e.target.files); e.target.value = ""; }} />
                      </label>
                      <button type="button" onClick={() => setPickerFor({ kind: "rangoli" })}
                        disabled={fest.rangoli.filter((r) => r.url).length >= 3}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <FiGrid size={13} /> Choose from CDN
                      </button>
                      <span className="text-[11px] text-gray-400">Blank = the built-in palette-tinted motif in two corners.</span>
                    </div>

                    <div className="space-y-3">
                      {[0, 1, 2].map((i) => {
                        const r = fest.rangoli[i];
                        return (
                          <div key={i} className="rounded-xl border border-gray-100 p-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                                {r?.url
                                  ? <img src={r.url} alt="" className="w-full h-full object-contain" />
                                  : <RangoliMotif color={p["--rb-accent"]} className="w-9 h-9 opacity-50" />}
                              </div>
                              <input
                                value={r?.url || ""}
                                onChange={(e) => setRangoliUrl(i, e.target.value)}
                                placeholder={`Rangoli ${i + 1} — upload above, or paste a cdn.indianhairworld.com/page-images/ URL`}
                                className={I}
                              />
                              {r?.url && (
                                <button type="button" onClick={() => removeRangoli(i)}
                                  className="text-red-500 hover:text-red-600 shrink-0" title="Remove">
                                  <FiTrash2 size={15} />
                                </button>
                              )}
                            </div>

                            {r?.url && (
                              <div className="mt-2.5 grid sm:grid-cols-2 gap-x-4 gap-y-2">
                                <label className="flex items-center gap-2 text-[11px] text-gray-500">
                                  <span className="w-14 shrink-0">Position</span>
                                  <select value={r.position} onChange={(e) => setRangoliField(i, "position", e.target.value)}
                                    className="flex-1 border border-gray-200 rounded px-1.5 py-1 text-xs outline-none focus:border-[#04A9FF]">
                                    {RANGOLI_POSITIONS.map(([v, lbl]) => <option key={v} value={v}>{lbl}</option>)}
                                  </select>
                                </label>
                                <Range label="Size" value={r.size} min={10} max={120} suffix="%"
                                  onChange={(v) => setRangoliField(i, "size", v)} />
                                <Range label="Rotate" value={r.rotation} min={-180} max={180} suffix="°"
                                  onChange={(v) => setRangoliField(i, "rotation", v)} />
                                <Range label="Opacity" value={r.opacity} min={0} max={100} suffix="%"
                                  onChange={(v) => setRangoliField(i, "opacity", v)} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom nav (mobile) */}
                  <div>
                    <label className={L}><span className="flex items-center gap-1"><FiImage size={11} /> Bottom nav (mobile) — background &amp; icons</span></label>

                    {/* background: colour + image */}
                    <div className="rounded-xl border border-gray-100 p-2.5 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500 w-20 shrink-0">Background</span>
                        <input type="color"
                          value={/^#[0-9a-fA-F]{6}$/.test(fest.bottomNav.bg) ? fest.bottomNav.bg : "#111827"}
                          onChange={(e) => setBottomNav("bg", e.target.value)}
                          className="w-8 h-8 rounded border border-gray-200 shrink-0" />
                        <input value={fest.bottomNav.bg}
                          onChange={(e) => setBottomNav("bg", e.target.value)}
                          placeholder="#111827 — blank = palette dark colour"
                          className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#04A9FF]" />
                        {fest.bottomNav.bg && (
                          <button type="button" onClick={() => setBottomNav("bg", "")}
                            className="text-red-500 hover:text-red-600 shrink-0" title="Clear"><FiTrash2 size={14} /></button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500 w-20 shrink-0">Bg image</span>
                        <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                          {fest.bottomNav.bgImage && <img src={fest.bottomNav.bgImage} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <input value={fest.bottomNav.bgImage}
                          onChange={(e) => setBottomNav("bgImage", e.target.value)}
                          placeholder="Optional image URL — overrides the colour"
                          className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#04A9FF]" />
                        <label className="text-[11px] font-bold px-2 py-1.5 rounded border bg-white border-gray-200 text-gray-600 hover:border-[#04A9FF] hover:text-[#04A9FF] cursor-pointer shrink-0">
                          <FiUploadCloud size={12} />
                          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                            disabled={uploadBusy}
                            onChange={(e) => { pickBottomNavBg(e.target.files); e.target.value = ""; }} />
                        </label>
                        <button type="button" onClick={() => setPickerFor({ kind: "navbg" })}
                          className="text-[11px] font-bold px-2 py-1.5 rounded border bg-white border-gray-200 text-gray-600 hover:border-[#04A9FF] hover:text-[#04A9FF] shrink-0"><FiGrid size={12} /></button>
                        {fest.bottomNav.bgImage && (
                          <button type="button" onClick={() => setBottomNav("bgImage", "")}
                            className="text-red-500 hover:text-red-600 shrink-0" title="Clear"><FiTrash2 size={14} /></button>
                        )}
                      </div>
                    </div>

                    {/* 4 icons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {BOTTOM_NAV_LABELS.map((lbl, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 p-2 text-center">
                          <div className="w-10 h-10 mx-auto rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            {fest.bottomNav.icons[i]
                              ? <img src={fest.bottomNav.icons[i]} alt={lbl} className="w-full h-full object-contain" />
                              : <span className="text-[9px] text-gray-400">default</span>}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">{lbl}</p>
                          <div className="flex justify-center gap-1 mt-1">
                            <label className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white border-gray-200 text-gray-600 hover:border-[#04A9FF] hover:text-[#04A9FF] cursor-pointer">
                              <FiUploadCloud size={11} />
                              <input type="file" accept="image/png,image/svg+xml,image/webp" className="hidden"
                                disabled={uploadBusy}
                                onChange={(e) => { pickBottomNavIcon(i, e.target.files); e.target.value = ""; }} />
                            </label>
                            <button type="button" onClick={() => setPickerFor({ kind: "navicon", index: i })}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white border-gray-200 text-gray-600 hover:border-[#04A9FF] hover:text-[#04A9FF]"><FiGrid size={11} /></button>
                            {fest.bottomNav.icons[i] && (
                              <button type="button" onClick={() => setBottomNavIcon(i, "")}
                                className="text-red-500 hover:text-red-600" title="Reset"><FiTrash2 size={11} /></button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Blank = default dark bar + built-in icons. Icons: PNG/SVG/WebP, ≤ 512 KB, ideally square with transparency.</p>
                  </div>

                  {/* Special Sale Offers section */}
                  <div>
                    <label className={L}><span className="flex items-center gap-1"><FiTag size={11} /> Special Sale Offers — section background</span></label>
                    <div className="flex items-center gap-2">
                      <input type="color"
                        value={/^#[0-9a-fA-F]{6}$/.test(fest.saleSection.bg) ? fest.saleSection.bg : "#fdf3e4"}
                        onChange={(e) => setFest((f) => ({ ...f, saleSection: { bg: e.target.value } }))}
                        className="w-8 h-8 rounded border border-gray-200 shrink-0" />
                      <input value={fest.saleSection.bg}
                        onChange={(e) => setFest((f) => ({ ...f, saleSection: { bg: e.target.value } }))}
                        placeholder="#fdf3e4 or any CSS colour/gradient — blank = palette section bg"
                        className={I} />
                      {fest.saleSection.bg && (
                        <button type="button" onClick={() => setFest((f) => ({ ...f, saleSection: { bg: "" } }))}
                          className="text-red-500 hover:text-red-600 shrink-0" title="Clear"><FiTrash2 size={15} /></button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      The storefront "Special Sale Offers" carousel shows products flagged <b>is_sale</b> in the product editor.
                      This only sets its background; card colours follow the palette.
                    </p>
                  </div>
                </div>

                {/* ---- live preview ---- */}
                <div>
                  <div className="lg:sticky lg:top-6">
                    <label className={L}>Live preview</label>
                    <FestivalPreview fest={fest} />
                  </div>
                </div>
              </div>
            </Section>

            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
              <FiSave size={14} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </>
        )}
      </form>

      {pickerFor && (
        <MediaPicker api={api} onPick={handlePicked} onClose={() => setPickerFor(null)} />
      )}
    </AdminLayout>
  );
}
