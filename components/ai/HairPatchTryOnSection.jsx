import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGuestCheck } from "../../global/GuestCheckContext";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_SINGLE_USES = 4;
const MAX_MULTI_USES  = 1;
const USAGE_KEY_SINGLE = "ihw_tryon_single";
const USAGE_KEY_MULTI  = "ihw_tryon_multi";

const RESET_HOURS = 24;

function getStoredCount(key) {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const { count, ts } = JSON.parse(raw);
    const hoursSince = (Date.now() - ts) / 3600000;
    if (hoursSince >= RESET_HOURS) {
      localStorage.removeItem(key);
      return 0;
    }
    return count || 0;
  } catch {
    return 0;
  }
}
function incrementStoredCount(key) {
  const count = getStoredCount(key) + 1;
  localStorage.setItem(key, JSON.stringify({ count, ts: Date.now() }));
  return count;
}
function isTryOnSupported(tag, name, desc) {
  const txt = `${tag || ""} ${name || ""} ${desc || ""}`.toLowerCase();
  return /(patch|wig|hair patch|hair wig|toupee|topper|hair system|hair replacement|extension|frontal|closure)/.test(txt);
}

/* ── constants ── */
const HAIRCUT_STYLES = [
  { id: "classic_crew_cut",       label: "Classic Crew Cut",           desc: "Short uniform, clean sides" },
  { id: "mid_fade_side_part",     label: "Mid Fade + Side Part",       desc: "Fade with side-parted top"  },
  { id: "textured_crop",          label: "Textured Crop",              desc: "Short crop, natural texture" },
  { id: "slicked_back_undercut",  label: "Slicked-Back Undercut",      desc: "Swept back, undercut sides" },
  { id: "side_brushed_pompadour", label: "Side-Brushed Pompadour",     desc: "High volume, brushed side"  },
  { id: "modern_quiff",           label: "Modern Quiff",               desc: "Voluminous front lift"       },
  { id: "taper_fade_natural",     label: "Taper Fade + Natural",       desc: "Gradual fade, natural top"   },
  { id: "hard_part_combover",     label: "Hard Part Comb-Over",        desc: "Razor part, swept top"       },
  { id: "buzz_cut_minimalist",    label: "Buzz Cut Minimalist",        desc: "Very short, clean framing"   },
];

const CURLY_STYLES = [
  { id: "curly_short", label: "Curly Short", desc: "Short curls, natural volume" },
  { id: "curly_long",  label: "Curly Long",  desc: "Long curls, full coverage"   },
];

const STYLE_ACCENTS = {
  classic_crew_cut:       "#6B7280",
  mid_fade_side_part:     "#3B82F6",
  textured_crop:          "#8B5CF6",
  slicked_back_undercut:  "#111827",
  side_brushed_pompadour: "#D97706",
  modern_quiff:           "#10B981",
  taper_fade_natural:     "#059669",
  hard_part_combover:     "#EF4444",
  buzz_cut_minimalist:    "#374151",
  curly_short:            "#92400E",
  curly_long:             "#7C3AED",
};


const STYLE_IMAGES = {
  classic_crew_cut:       "/images/haircut-styles/classic_crew_cut.png",
  mid_fade_side_part:     "/images/haircut-styles/mid_fade_with_side_part.png",
  textured_crop:          "/images/haircut-styles/textured_crop.png",
  slicked_back_undercut:  "/images/haircut-styles/slicked_backed_undercut.png",
  side_brushed_pompadour: "/images/haircut-styles/side_brushed_pompadour.png",
  modern_quiff:           "/images/haircut-styles/mordern_quiff.png",
  taper_fade_natural:     "/images/haircut-styles/taper_fade_with_natural_texture.png",
  hard_part_combover:     "/images/haircut-styles/hard_part_combo_over.png",
  buzz_cut_minimalist:    "/images/haircut-styles/buzz_cut_with_minimalist_framing.png",
  curly_short:            "/images/haircut-styles/curly/curlyshortcut.png",
  curly_long:             "/images/haircut-styles/curly/curlylongcut.png",
};

const HAIR_COLORS = [
  { id: "natural_black",  label: "Natural Black",  hex: "#0D0D0D" },
  { id: "dark_brown",     label: "Dark Brown",     hex: "#2C1A0E" },
  { id: "medium_brown",   label: "Medium Brown",   hex: "#6B3A2A" },
  { id: "light_brown",    label: "Light Brown",    hex: "#A0673A" },
  { id: "blonde",         label: "Blonde",         hex: "#C8A96E" },
  { id: "grey",           label: "Grey / Salt & Pepper", hex: "#9CA3AF" },
  { id: "auto",           label: "Match Product",  hex: null      },
];

const HAIRLINE_OPTIONS = [
  { id: "natural", label: "Natural",       desc: "Soft, gradual edge"     },
  { id: "sharp",   label: "Sharp & Crisp", desc: "Defined clean line"     },
  { id: "m_shape", label: "M-Shape",       desc: "Slight temple recession" },
];
const DENSITY_OPTIONS = [
  { id: "light",  label: "Light",        desc: "Sparse, thin"        },
  { id: "medium", label: "Medium",       desc: "Natural balance"     },
  { id: "full",   label: "Full & Dense", desc: "Maximum coverage"    },
];
const STYLING_OPTIONS = [
  { id: "natural_flow", label: "Natural"      },
  { id: "left_part",    label: "Left Part"    },
  { id: "right_part",   label: "Right Part"   },
  { id: "center_part",  label: "Center Part"  },
  { id: "combed_back",  label: "Combed Back"  },
  { id: "messy",        label: "Messy/Casual" },
];
const VIEW_ANGLES = [
  { id: "front",      label: "Front View",  icon: "👤" },
  { id: "left_side",  label: "Left Side",   icon: "◀️" },
  { id: "right_side", label: "Right Side",  icon: "▶️" },
  { id: "back",       label: "Back View",   icon: "↩️" },
];

/* ── animation CSS ── */
const ANIM_CSS = `
  @keyframes hairShimmer {
    0%   { background-position: -900px 0; }
    100% { background-position:  900px 0; }
  }
  @keyframes hairScan {
    0%   { top: -40%; }
    100% { top: 130%; }
  }
  @keyframes hairReveal {
    from { opacity: 0; filter: blur(14px) brightness(1.1); transform: scale(1.04); }
    to   { opacity: 1; filter: blur(0)    brightness(1);   transform: scale(1);    }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0);    opacity: 0.35; }
    40%           { transform: translateY(-5px); opacity: 1;    }
  }
  @keyframes resultSlideIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .hair-shimmer-bg {
    background: linear-gradient(90deg,#ececec 0%,#e2e2e2 20%,#d4dce8 45%,#e2e2e2 65%,#ececec 100%);
    background-size: 900px 100%;
    animation: hairShimmer 1.9s linear infinite;
  }
  .hair-scan-line {
    position: absolute; left: 0; right: 0; height: 55%;
    background: linear-gradient(to bottom,transparent 0%,rgba(110,130,220,0.07) 40%,rgba(110,130,220,0.13) 50%,rgba(110,130,220,0.07) 60%,transparent 100%);
    animation: hairScan 2.4s ease-in-out infinite;
    pointer-events: none;
  }
  .hair-reveal { animation: hairReveal 0.7s ease-out forwards; }
  .result-slide-in { animation: resultSlideIn 0.45s ease-out forwards; }
`;

/* ── helpers ── */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read uploaded image."));
    reader.readAsDataURL(file);
  });
}
async function parseApiResponse(response) {
  const raw = await response.text();
  if (!raw) return {};
  try { return JSON.parse(raw); }
  catch {
    if (!response.ok) throw new Error("The server returned an invalid response. Please try again.");
    throw new Error("Could not read the AI response.");
  }
}

/* ── sub-components ── */
function OptionPill({ active, onClick, label, desc }) {
  return (
    <button
      type="button" onClick={onClick} title={desc}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
        active ? "border-[#04A9FF] bg-[#04A9FF]/10 text-[#04A9FF]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >{label}</button>
  );
}

function StyleCard({ style, active, onClick, imgHeight = 88 }) {
  const accent = STYLE_ACCENTS[style.id];
  return (
    <button
      type="button" onClick={onClick}
      className={`relative flex flex-col items-center text-center overflow-hidden rounded-xl border-2 transition-all duration-200 select-none ${
        active ? "border-[#04A9FF] shadow-lg shadow-[#04A9FF]/20 scale-[1.02]" : "border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
      }`}
    >
      <img
        src={STYLE_IMAGES[style.id]}
        alt={style.label}
        className="w-full shrink-0 object-cover"
        style={{ height: imgHeight }}
      />
      {/* Colour accent bar */}
      <div className="w-full h-[3px]" style={{ background: accent }} />
      {/* Label */}
      <div className="px-1.5 py-2">
        <span className={`text-[10px] font-bold leading-tight block ${active ? "text-[#04A9FF]" : "text-gray-800"}`}>
          {style.label}
        </span>
        <span className="text-[9px] text-gray-400 leading-tight block mt-0.5">{style.desc}</span>
      </div>
      {active && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#04A9FF] flex items-center justify-center shadow-sm z-10">
          <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
            <path d="M1 3L2.8 5L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </button>
  );
}

function UsageBadge({ current, max, label }) {
  const remaining = Math.max(0, max - current);
  const isEmpty = remaining === 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
      isEmpty ? "bg-red-100 text-red-600" : remaining <= 1 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
    }`}>
      <span>{remaining}/{max}</span>
      <span className="font-normal">{label}</span>
    </span>
  );
}

function ShimmerCard({ label }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100 w-full" style={{ minHeight: 280 }}>
      <div className="absolute inset-0 hair-shimmer-bg" />
      <div className="hair-scan-line" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-4">
        <div className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md" style={{ boxShadow: "0 0 0 4px rgba(4,169,255,0.12)" }}>
          <svg className="animate-spin h-5 w-5 text-[#04A9FF]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <p className="text-[11px] font-semibold text-gray-500 text-center bg-white/75 backdrop-blur-sm px-3 py-1 rounded-full">{label}</p>
        <div className="flex gap-1.5">
          {[0, 160, 320].map((delay, i) => (
            <span key={i} className="block w-1.5 h-1.5 rounded-full bg-[#04A9FF]"
              style={{ animation: `dotBounce 1.3s ease-in-out ${delay}ms infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RevealImage({ src, alt, className = "" }) {
  return <img src={src} alt={alt} className={`hair-reveal ${className}`} />;
}

function Lightbox({ src, label, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
        <p className="text-white text-sm font-semibold">{label}</p>
        <div className="flex items-center gap-3">
          <a href={src} download={`${label.toLowerCase().replace(/\s+/g, "-")}.jpg`}
            className="text-xs text-white/80 hover:text-white border border-white/30 hover:border-white px-3 py-1.5 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}>⬇ Download</a>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none transition-colors">✕</button>
        </div>
      </div>
      <img src={src} alt={label} className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()} style={{ animation: "hairReveal 0.4s ease-out forwards" }} />
    </div>
  );
}

/* ── main component ── */
function HairPatchTryOnSection({
  productImage,
  productImages = [],
  productName = "",
  productTag = "",
  productDescription = "",
  isAdmin = false,
}) {
  const { requireGuestInfo } = useGuestCheck();

  const [faceFile, setFaceFile]               = useState(null);
  const [facePreviewUrl, setFacePreviewUrl]   = useState("");
  const [isLoading, setIsLoading]             = useState(false);
  const [error, setError]                     = useState("");
  const [resultImageUrl, setResultImageUrl]   = useState("");
  const [compareValue, setCompareValue]       = useState(50);
  const [showCamera, setShowCamera]           = useState(false);
  const [cameraReady, setCameraReady]         = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [lightbox, setLightbox]               = useState(null);
  const [showAdvanced, setShowAdvanced]       = useState(false);

  const [haircutCategory, setHaircutCategory] = useState("straight");
  const [haircutStyle,    setHaircutStyle]    = useState("classic_crew_cut");
  const [hairColor,       setHairColor]       = useState("auto");
  const [hairlineStyle, setHairlineStyle] = useState("natural");
  const [hairDensity,   setHairDensity]   = useState("medium");
  const [hairStyling,   setHairStyling]   = useState("natural_flow");

  const [viewMode, setViewMode]             = useState("single");
  const [multiViewResults, setMultiViewResults] = useState({ front: "", left_side: "", right_side: "", back: "" });
  const [multiViewLoading, setMultiViewLoading] = useState({ front: false, left_side: false, right_side: false, back: false });

  // Usage tracking (loaded client-side)
  const [singleUses, setSingleUses] = useState(0);
  const [multiUses, setMultiUses]   = useState(0);

  useEffect(() => {
    setSingleUses(getStoredCount(USAGE_KEY_SINGLE));
    setMultiUses(getStoredCount(USAGE_KEY_MULTI));
  }, []);

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const resultRef = useRef(null);

  const supported = useMemo(
    () => isAdmin || isTryOnSupported(productTag, productName, productDescription),
    [isAdmin, productTag, productName, productDescription]
  );

  const canSubmit = useMemo(() => Boolean(faceFile && productImage), [faceFile, productImage]);
  const isMultiViewLoading = useMemo(() => Object.values(multiViewLoading).some(Boolean), [multiViewLoading]);
  const isAnyLoading = isLoading || isMultiViewLoading;
  const hasMultiResults = Object.values(multiViewResults).some(Boolean);

  const singleLimitReached = !isAdmin && singleUses >= MAX_SINGLE_USES;
  const multiLimitReached  = !isAdmin && multiUses  >= MAX_MULTI_USES;
  const currentLimitReached = viewMode === "multi" ? multiLimitReached : singleLimitReached;

  useEffect(() => {
    if (!faceFile) { setFacePreviewUrl(""); return; }
    const url = URL.createObjectURL(faceFile);
    setFacePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [faceFile]);

  useEffect(() => {
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); };
  }, []);

  useEffect(() => {
    if (hasGeneratedOnce && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [hasGeneratedOnce]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    setCameraReady(false);
    setShowCamera(false);
  }, []);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } } });
      streamRef.current = stream;
      setShowCamera(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setCameraReady(true);
        }
      });
    } catch {
      setError("Camera access denied. Please allow camera permission and try again.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setFaceFile(new File([blob], "camera-photo.jpg", { type: "image/jpeg" }));
      setResultImageUrl("");
      setMultiViewResults({ front: "", left_side: "", right_side: "", back: "" });
      stopCamera();
    }, "image/jpeg", 0.92);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError(""); setResultImageUrl("");
    setMultiViewResults({ front: "", left_side: "", right_side: "", back: "" });
    if (!file) { setFaceFile(null); return; }
    if (!file.type.startsWith("image/")) { setError("Please upload an image file (JPG, PNG, WEBP)."); setFaceFile(null); return; }
    if (file.size > MAX_UPLOAD_BYTES) { setError("Please upload an image under 8MB."); setFaceFile(null); return; }
    setFaceFile(file);
  };

  const buildCommonBody = (base64, mimeType) => ({
    faceImageBase64: base64, faceImageMimeType: mimeType,
    productImageUrl: productImage, productImageUrls: productImages,
    productName, productTag, productDescription,
    hairStatus: "has_hair",
    haircutStyle, hairlineStyle, hairDensity, hairStyling, hairColor,
  });

  const handleSingleGenerate = async () => {
    setIsLoading(true); setError(""); setResultImageUrl("");
    try {
      const faceDataUrl = await fileToDataUrl(faceFile);
      const base64 = String(faceDataUrl).split(",")[1];
      const response = await fetch("/api/ai/hair-try-on", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildCommonBody(base64, faceFile.type), viewAngle: "front" }),
      });
      const payload = await parseApiResponse(response);
      if (!response.ok) throw new Error(payload?.message || "Generation failed. Please try again.");
      setResultImageUrl(payload.generatedImageDataUrl);
      setCompareValue(0);
    } catch (err) {
      setError(err?.message || "Could not generate the try-on image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiViewGenerate = async () => {
    setError("");
    setMultiViewResults({ front: "", left_side: "", right_side: "", back: "" });
    setMultiViewLoading({ front: true, left_side: true, right_side: true, back: true });
    let base64, mimeType;
    try {
      const faceDataUrl = await fileToDataUrl(faceFile);
      base64 = String(faceDataUrl).split(",")[1]; mimeType = faceFile.type;
    } catch {
      setError("Could not read the uploaded photo.");
      setMultiViewLoading({ front: false, left_side: false, right_side: false, back: false });
      return;
    }
    await Promise.all(["front", "left_side", "right_side", "back"].map(async (angle) => {
      try {
        const response = await fetch("/api/ai/hair-try-on", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...buildCommonBody(base64, mimeType), viewAngle: angle }),
        });
        const payload = await parseApiResponse(response);
        if (!response.ok) throw new Error(payload?.message || "Generation failed.");
        setMultiViewResults((prev) => ({ ...prev, [angle]: payload.generatedImageDataUrl }));
      } catch (err) {
        setError((prev) => prev || (err?.message || "One or more views failed."));
      } finally {
        setMultiViewLoading((prev) => ({ ...prev, [angle]: false }));
      }
    }));
  };

  const handleGenerate = async () => {
    if (!canSubmit || isAnyLoading || currentLimitReached) return;
    const canProceed = isAdmin ? true : await requireGuestInfo();
    if (!canProceed) return;
    setHasGeneratedOnce(true);
    if (viewMode === "multi") {
      if (!isAdmin) setMultiUses(incrementStoredCount(USAGE_KEY_MULTI));
      handleMultiViewGenerate();
    } else {
      if (!isAdmin) setSingleUses(incrementStoredCount(USAGE_KEY_SINGLE));
      handleSingleGenerate();
    }
  };

  /* ── product not supported ── */
  if (!supported) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 my-6 text-center">
        <div className="text-3xl mb-3">💇</div>
        <h3 className="font-semibold text-gray-700 text-base">Virtual Try-On Not Available</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
          This feature is available for hair patches, wigs, and extensions only. This product has not been enabled for virtual try-on.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-[#f7f9ff] to-[#eef4ff] p-4 md:p-6 my-6">
      <style>{ANIM_CSS}</style>

      {lightbox && <Lightbox src={lightbox.src} label={lightbox.label} onClose={() => setLightbox(null)} />}

      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">Take a Photo</p>
              <button onClick={stopCamera} className="text-gray-400 hover:text-black text-xl leading-none">✕</button>
            </div>
            <div className="relative bg-black aspect-square">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
              {!cameraReady && <div className="absolute inset-0 flex items-center justify-center text-white text-sm">Starting camera…</div>}
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={capturePhoto} disabled={!cameraReady}
                className="flex-1 bg-[#111827] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40">📸 Capture Photo</button>
              <button onClick={stopCamera} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      {!showCamera && <canvas ref={canvasRef} className="hidden" />}

      {/* ── Header ── */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#04A9FF] font-semibold">AI Studio</span>
            {isAdmin && (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-[#04A9FF] text-white px-2 py-0.5 rounded-full">Admin Mode — No Limits</span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Virtual Hair Try-On</h3>
          <p className="text-sm text-gray-500 mt-0.5">Upload your photo, pick a haircut style, and generate — results appear below.</p>
        </div>
        {!isAdmin && (
          <div className="flex flex-col gap-1 shrink-0 items-end">
            <UsageBadge current={singleUses} max={MAX_SINGLE_USES} label="single" />
            <UsageBadge current={multiUses}  max={MAX_MULTI_USES}  label="4-view" />
            <span className="text-[9px] text-gray-400 mt-0.5">Resets every 24 hrs</span>
          </div>
        )}
      </div>

      {/* ── Options card ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-5">

        {/* Photo upload */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Your Photo</p>
          {facePreviewUrl ? (
            <div className="flex gap-3 items-start">
              <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-[#04A9FF]/60 shrink-0 cursor-pointer"
                onClick={() => setLightbox({ src: facePreviewUrl, label: "Your Photo" })} title="Click to view full size">
                <img src={facePreviewUrl} alt="Your uploaded photo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-xs text-[#04A9FF] font-semibold">✓ Photo ready</p>
                <label htmlFor="try-on-face-upload"
                  className="cursor-pointer text-center text-xs border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                  Change Photo
                  <input id="try-on-face-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
                <button type="button" onClick={startCamera}
                  className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                  Retake with Camera
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <label htmlFor="try-on-face-upload"
                  className="flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer border border-dashed border-gray-300 rounded-xl py-4 text-gray-500 hover:bg-gray-50 hover:border-[#04A9FF]/40 transition-colors">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-xs font-medium">Upload Photo</span>
                  <input id="try-on-face-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
                <button type="button" onClick={startCamera}
                  className="flex-1 flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-xl py-4 text-gray-500 hover:bg-gray-50 hover:border-[#04A9FF]/40 transition-colors">
                  <span className="text-2xl">📷</span>
                  <span className="text-xs font-medium">Use Camera</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Best: plain background, good lighting, face forward.</p>
            </>
          )}
        </div>

        {/* Haircut Style Grid */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Haircut Style</p>
          <p className="text-[10px] text-gray-400 mb-3">Choose how the hair should look after wearing the patch</p>

          {/* Category toggle */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => { setHaircutCategory("straight"); setHaircutStyle("classic_crew_cut"); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${haircutCategory === "straight" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}
            >
              Straight / Wavy
            </button>
            <button
              type="button"
              onClick={() => { setHaircutCategory("curly"); setHaircutStyle("curly_short"); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${haircutCategory === "curly" ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white text-gray-500 border-gray-200 hover:border-[#7C3AED]/40"}`}
            >
              Curly
            </button>
          </div>

          {haircutCategory === "straight" ? (
            <div className="grid grid-cols-3 gap-2">
              {HAIRCUT_STYLES.map((style) => (
                <StyleCard key={style.id} style={style} active={haircutStyle === style.id} onClick={() => setHaircutStyle(style.id)} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {CURLY_STYLES.map((style) => (
                <StyleCard key={style.id} style={style} active={haircutStyle === style.id} onClick={() => setHaircutStyle(style.id)} imgHeight={260} />
              ))}
            </div>
          )}
        </div>

        {/* Hair Color Picker */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Hair Color</p>
          <p className="text-[10px] text-gray-400 mb-3">Select the color of the hair patch / wig</p>
          <div className="flex flex-wrap gap-2">
            {HAIR_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setHairColor(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                  hairColor === c.id
                    ? "border-[#04A9FF] bg-[#04A9FF]/10 text-[#04A9FF]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                {c.hex ? (
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ background: c.hex }} />
                ) : (
                  <span className="text-[11px]">🎨</span>
                )}
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
          <button type="button" onClick={() => setShowAdvanced((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
            <span>Advanced Options — Hairline, Density &amp; Styling</span>
            <span className="text-gray-400 ml-2">{showAdvanced ? "▲" : "▼"}</span>
          </button>
          {showAdvanced && (
            <div className="px-3 pb-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-1.5">Hairline Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {HAIRLINE_OPTIONS.map((o) => <OptionPill key={o.id} active={hairlineStyle === o.id} onClick={() => setHairlineStyle(o.id)} label={o.label} desc={o.desc} />)}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-1.5">Hair Density</p>
                <div className="flex flex-wrap gap-1.5">
                  {DENSITY_OPTIONS.map((o) => <OptionPill key={o.id} active={hairDensity === o.id} onClick={() => setHairDensity(o.id)} label={o.label} desc={o.desc} />)}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-1.5">Styling / Parting</p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLING_OPTIONS.map((o) => <OptionPill key={o.id} active={hairStyling === o.id} onClick={() => setHairStyling(o.id)} label={o.label} desc="" />)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Mode + Generate */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="w-full sm:w-60 shrink-0">
            <p className="text-xs font-semibold text-gray-700 mb-2">Preview Mode</p>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button type="button" onClick={() => setViewMode("single")}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${viewMode === "single" ? "bg-[#111827] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                Single View
              </button>
              <button type="button" onClick={() => setViewMode("multi")}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${viewMode === "multi" ? "bg-[#111827] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                4-View
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {viewMode === "multi" ? "Front, left, right & back — ~30–60s" : "Front-facing AI preview — ~15–20s"}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-end gap-2">
            {currentLimitReached ? (
              <div className="w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 px-5 py-4 text-center">
                <p className="text-sm font-bold text-gray-700">
                  {viewMode === "multi" ? "4-View try used" : "Free tries used up"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {viewMode === "multi"
                    ? `You've used your 1 free 4-view try.`
                    : `You've used all ${MAX_SINGLE_USES} free single-view tries.`}
                  {" "}Contact us to unlock more.
                </p>
                <a href="tel:+917980221032"
                  className="inline-block mt-2 text-xs font-semibold text-[#04A9FF] hover:underline">
                  📞 Call Us
                </a>
              </div>
            ) : (
              <button type="button" onClick={handleGenerate} disabled={!canSubmit || isAnyLoading}
                className="w-full rounded-xl bg-gradient-to-r from-[#04A9FF] to-[#0070cc] px-5 py-3.5 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(4,169,255,0.35)] hover:shadow-[0_6px_20px_rgba(4,169,255,0.5)]">
                {isAnyLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {viewMode === "multi" ? "Generating 4 views…" : "Generating preview…"}
                  </>
                ) : "✨ Generate AI Preview"}
              </button>
            )}
            {!canSubmit && !isAnyLoading && !currentLimitReached && (
              <p className="text-[10px] text-gray-400 text-center">Upload your photo to enable generation</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex flex-col gap-2">
            <p className="text-sm text-red-600 leading-snug break-words font-medium">{error}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canSubmit || isAnyLoading || currentLimitReached}
                className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
              >
                Try Again ↻
              </button>
              <p className="text-[10px] text-red-400">
                Use a clear, front-facing photo with plain background &amp; good lighting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {hasGeneratedOnce && (
        <div ref={resultRef} className="mt-4 result-slide-in">
          {viewMode === "single" ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-700">AI Preview Result</p>
                {facePreviewUrl && (
                  <div className="flex items-center gap-1.5">
                    <img src={facePreviewUrl} alt="You" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                    <span className="text-[10px] text-gray-400">Your photo</span>
                  </div>
                )}
              </div>
              {isLoading ? <ShimmerCard label="AI is styling your look…" /> : resultImageUrl ? (
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 w-full" style={{ minHeight: 300, maxHeight: 620 }}>
                    {/* After (AI result) — always visible behind */}
                    <RevealImage src={resultImageUrl} alt="AI hair try-on result" className="w-full h-full object-contain" style={{ display: "block" }} />
                    {/* Before (original face) — revealed left of divider */}
                    <img src={facePreviewUrl} alt="Original"
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }} />
                    {/* Divider line */}
                    <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] pointer-events-none" style={{ left: `${compareValue}%` }}>
                      {/* Handle */}
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5 7H9M2 7L4.5 4.5M2 7L4.5 9.5M12 7L9.5 4.5M12 7L9.5 9.5" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {/* Labels hugging divider */}
                      <div className="absolute top-3 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">← Before</div>
                      <div className="absolute top-3 left-2 bg-[#04A9FF] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">After →</div>
                    </div>
                    {/* View Full button */}
                    <button type="button" onClick={() => setLightbox({ src: resultImageUrl, label: "AI Try-On Result" })}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 transition-colors">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 4V1H4M6 1H9V4M9 6V9H6M4 9H1V6" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      View Full
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-gray-500 w-10 text-right">Before</span>
                    <div className="relative flex-1">
                      <input type="range" min={0} max={100} value={compareValue} onChange={(e) => setCompareValue(Number(e.target.value))} className="w-full accent-[#04A9FF]" />
                    </div>
                    <span className="text-[11px] font-medium text-[#04A9FF] w-8">After</span>
                  </div>
                  <p className="text-center text-[10px] text-gray-400">← Drag slider to compare Before &amp; After →</p>
                  <div className="flex justify-center gap-6">
                    <button type="button" onClick={() => setLightbox({ src: resultImageUrl, label: "AI Try-On Result" })} className="text-xs text-gray-700 hover:text-black font-medium border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">🔍 View Image</button>
                    <a href={resultImageUrl} download="hair-try-on-result.jpg" className="text-xs text-gray-500 underline hover:text-black">Download</a>
                    {!singleLimitReached && (
                      <button type="button" onClick={handleSingleGenerate} disabled={isAnyLoading} className="text-xs text-[#04A9FF] hover:text-[#0070cc] disabled:opacity-40 font-medium">Regenerate ↻</button>
                    )}
                  </div>
                </div>
              ) : facePreviewUrl ? (
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 w-full" style={{ minHeight: 300 }}>
                  <img src={facePreviewUrl} alt="Your uploaded photo" className="w-full h-auto object-contain opacity-50" />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-700">4-View AI Preview</p>
                {facePreviewUrl && (
                  <div className="flex items-center gap-1.5">
                    <img src={facePreviewUrl} alt="You" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                    <span className="text-[10px] text-gray-400">Your photo</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {VIEW_ANGLES.map((angle) => {
                  const loading = multiViewLoading[angle.id];
                  const src = multiViewResults[angle.id];
                  return (
                    <div key={angle.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{angle.icon} {angle.label}</p>
                        {src && <a href={src} download={`${angle.id}-view.jpg`} className="text-[10px] text-gray-400 underline hover:text-black">Save</a>}
                      </div>
                      <div className={`relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 ${src ? "cursor-pointer group" : ""}`}
                        style={{ aspectRatio: "3/4" }}
                        onClick={src ? () => setLightbox({ src, label: angle.label }) : undefined}>
                        {loading ? <ShimmerCard label={`Generating ${angle.label}…`} /> : src ? (
                          <>
                            <RevealImage src={src} alt={angle.label} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">🔍</span>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-1">
                            <span className="text-3xl">{angle.icon}</span>
                            <span className="text-[10px]">{angle.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasMultiResults && !isMultiViewLoading && !multiLimitReached && (
                <div className="mt-3 flex justify-center">
                  <button type="button" onClick={handleMultiViewGenerate} disabled={isAnyLoading}
                    className="text-xs text-[#04A9FF] hover:text-[#0070cc] disabled:opacity-40 font-medium">Regenerate all 4 views ↻</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] text-gray-400">
        By uploading, you confirm consent for AI processing. Images are used only for this preview and are not stored.
      </p>
    </section>
  );
}

export default HairPatchTryOnSection;
