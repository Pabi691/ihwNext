import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGuestCheck } from "../../global/GuestCheckContext";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const HAIRCUT_STYLES = [
  { id: "default",         label: "Default",       desc: "As shown in product" },
  { id: "short_clean",     label: "Short & Clean", desc: "Neatly trimmed short" },
  { id: "crew_cut",        label: "Crew Cut",       desc: "Very short, military" },
  { id: "medium_natural",  label: "Medium Natural", desc: "4–6 cm natural length" },
  { id: "textured_layers", label: "Textured",       desc: "Layered with volume" },
  { id: "slick_back",      label: "Slick Back",     desc: "Swept back, polished" },
  { id: "side_part",       label: "Side Part",      desc: "Classic side parting" },
];

const HAIRLINE_OPTIONS = [
  { id: "natural", label: "Natural",       desc: "Soft, gradual edge" },
  { id: "sharp",   label: "Sharp & Crisp", desc: "Defined clean line" },
  { id: "m_shape", label: "M-Shape",       desc: "Slight temple recession" },
];

const DENSITY_OPTIONS = [
  { id: "light",  label: "Light",        desc: "Sparse, thin" },
  { id: "medium", label: "Medium",       desc: "Natural balance" },
  { id: "full",   label: "Full & Dense", desc: "Maximum coverage" },
];

const STYLING_OPTIONS = [
  { id: "natural_flow", label: "Natural" },
  { id: "left_part",    label: "Left Part" },
  { id: "right_part",   label: "Right Part" },
  { id: "center_part",  label: "Center Part" },
  { id: "combed_back",  label: "Combed Back" },
  { id: "messy",        label: "Messy / Casual" },
];

const VIEW_ANGLES = [
  { id: "front",      label: "Front View",  icon: "👤" },
  { id: "left_side",  label: "Left Side",   icon: "◀️" },
  { id: "right_side", label: "Right Side",  icon: "▶️" },
  { id: "back",       label: "Back View",   icon: "↩️" },
];

/* ── lightbox ── */
function Lightbox({ src, label, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {/* toolbar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-sm font-semibold">{label}</p>
        <div className="flex items-center gap-3">
          <a
            href={src}
            download={`${label.toLowerCase().replace(/\s+/g, "-")}.jpg`}
            className="text-xs text-white/80 hover:text-white border border-white/30 hover:border-white px-3 py-1.5 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            ⬇ Download
          </a>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* image */}
      <img
        src={src}
        alt={label}
        className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "hairReveal 0.4s ease-out forwards" }}
      />
    </div>
  );
}

/* ── animation keyframes injected once ── */
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
    background: linear-gradient(90deg,
      #ececec 0%, #e2e2e2 20%, #d4dce8 45%, #e2e2e2 65%, #ececec 100%);
    background-size: 900px 100%;
    animation: hairShimmer 1.9s linear infinite;
  }
  .hair-scan-line {
    position: absolute; left: 0; right: 0;
    height: 55%;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(110, 130, 220, 0.07) 40%,
      rgba(110, 130, 220, 0.13) 50%,
      rgba(110, 130, 220, 0.07) 60%,
      transparent 100%);
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
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read uploaded image."));
    reader.readAsDataURL(file);
  });
}

async function parseApiResponse(response) {
  const raw = await response.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    if (!response.ok) throw new Error("The server returned an invalid response. Please try again.");
    throw new Error("Could not read the AI response.");
  }
}

/* ── sub-components ── */
function OptionPill({ active, onClick, label, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={desc}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? "border-black bg-black text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function ShimmerCard({ label }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100 w-full" style={{ minHeight: 280 }}>
      <div className="absolute inset-0 hair-shimmer-bg" />
      <div className="hair-scan-line" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-4">
        <div
          className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
          style={{ boxShadow: "0 0 0 4px rgba(99,102,241,0.12)" }}
        >
          <svg className="animate-spin h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <p className="text-[11px] font-semibold text-gray-500 text-center bg-white/75 backdrop-blur-sm px-3 py-1 rounded-full">
          {label}
        </p>
        <div className="flex gap-1.5">
          {[0, 160, 320].map((delay, i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-indigo-400"
              style={{ animation: `dotBounce 1.3s ease-in-out ${delay}ms infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RevealImage({ src, alt, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`hair-reveal ${className}`}
    />
  );
}

/* ── main component ── */
function HairPatchTryOnSection({
  productImage,
  productImages = [],
  productName = "",
  productTag = "",
  productDescription = "",
}) {
  const { requireGuestInfo } = useGuestCheck();

  const [faceFile, setFaceFile]           = useState(null);
  const [facePreviewUrl, setFacePreviewUrl] = useState("");
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [compareValue, setCompareValue]   = useState(50);
  const [showCamera, setShowCamera]       = useState(false);
  const [cameraReady, setCameraReady]     = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [lightbox, setLightbox]           = useState(null); // { src, label }

  // Options
  const [hairStatus,    setHairStatus]    = useState("has_hair");
  const [haircutStyle,  setHaircutStyle]  = useState("default");
  const [hairlineStyle, setHairlineStyle] = useState("natural");
  const [hairDensity,   setHairDensity]   = useState("medium");
  const [hairStyling,   setHairStyling]   = useState("natural_flow");
  const [showAdvanced,  setShowAdvanced]  = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState("single");
  const [multiViewResults, setMultiViewResults] = useState({ front: "", left_side: "", right_side: "", back: "" });
  const [multiViewLoading, setMultiViewLoading] = useState({ front: false, left_side: false, right_side: false, back: false });

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const resultRef = useRef(null);

  const canSubmit = useMemo(() => Boolean(faceFile && productImage), [faceFile, productImage]);
  const isMultiViewLoading = useMemo(() => Object.values(multiViewLoading).some(Boolean), [multiViewLoading]);
  const isAnyLoading = isLoading || isMultiViewLoading;
  const hasMultiResults = Object.values(multiViewResults).some(Boolean);

  useEffect(() => {
    if (!faceFile) { setFacePreviewUrl(""); return; }
    const url = URL.createObjectURL(faceFile);
    setFacePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [faceFile]);

  useEffect(() => {
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); };
  }, []);

  // Scroll result into view when generation starts
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
      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
      setFaceFile(file);
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
    hairStatus, haircutStyle, hairlineStyle, hairDensity, hairStyling,
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
        setError((prev) => prev || (err?.message || "One or more views failed to generate."));
      } finally {
        setMultiViewLoading((prev) => ({ ...prev, [angle]: false }));
      }
    }));
  };

  const handleGenerate = async () => {
    if (!canSubmit || isAnyLoading) return;
    const canProceed = await requireGuestInfo();
    if (!canProceed) return;
    setHasGeneratedOnce(true);
    if (viewMode === "multi") handleMultiViewGenerate();
    else handleSingleGenerate();
  };

  const activeHaircutLabel = HAIRCUT_STYLES.find((s) => s.id === haircutStyle)?.label ?? "";

  return (
    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-[#f7f8fa] to-[#eef4ff] p-4 md:p-6 my-6">
      <style>{ANIM_CSS}</style>

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          label={lightbox.label}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* ── Camera modal ── */}
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
              <button onClick={capturePhoto} disabled={!cameraReady} className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40">📸 Capture Photo</button>
              <button onClick={stopCamera} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      {!showCamera && <canvas ref={canvasRef} className="hidden" />}

      {/* ── Header ── */}
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">AI Studio</p>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Virtual Hair Try-On</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload your photo, choose your style options below, then generate — results appear beneath.
        </p>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* ── Options card (full width, columns) ─── */}
      {/* ══════════════════════════════════════════ */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-4">

        {/* Row 1 – Photo + Hair Situation side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Photo upload */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Your Photo</p>
            {facePreviewUrl ? (
              /* ── live preview with retake / change buttons ── */
              <div className="flex gap-3 items-start">
                <div
                  className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-green-400 shrink-0 cursor-pointer"
                  onClick={() => setLightbox({ src: facePreviewUrl, label: "Your Photo" })}
                  title="Click to view full size"
                >
                  <img src={facePreviewUrl} alt="Your uploaded photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white text-lg opacity-0 hover:opacity-100 transition-opacity">🔍</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="text-xs text-green-600 font-semibold">✓ Photo ready</p>
                  <label
                    htmlFor="try-on-face-upload"
                    className="cursor-pointer text-center text-xs border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Change Photo
                    <input id="try-on-face-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                  </label>
                  <button type="button" onClick={startCamera} className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                    Retake with Camera
                  </button>
                </div>
              </div>
            ) : (
              /* ── empty state ── */
              <>
                <div className="flex gap-2">
                  <label
                    htmlFor="try-on-face-upload"
                    className="flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer border border-dashed border-gray-300 rounded-xl py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">🖼️</span>
                    <span className="text-xs font-medium">Upload Photo</span>
                    <input id="try-on-face-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-xl py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-xs font-medium">Use Camera</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Best: plain background, good lighting, face forward.</p>
              </>
            )}
          </div>

          {/* Hair situation */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Hair Situation</p>
            <div className="flex gap-2 h-[calc(100%-24px)] items-start">
              <OptionPill active={hairStatus === "bald_or_thinning"} onClick={() => setHairStatus("bald_or_thinning")} label="Bald / Thinning" desc="Minimal or no hair on top" />
              <OptionPill active={hairStatus === "has_hair"}         onClick={() => setHairStatus("has_hair")}         label="I Have Hair"     desc="I already have hair on top" />
            </div>
          </div>
        </div>

        {/* Row 2 – Haircut Style (scrollable pills, full width) */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">
            Haircut Style
            {haircutStyle !== "default" && <span className="ml-1 font-normal text-gray-400">— {activeHaircutLabel}</span>}
          </p>
          <p className="text-[10px] text-gray-400 mb-2">How the hair should look after wearing &amp; cutting the patch</p>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {HAIRCUT_STYLES.map((s) => (
              <OptionPill key={s.id} active={haircutStyle === s.id} onClick={() => setHaircutStyle(s.id)} label={s.label} desc={s.desc} />
            ))}
          </div>
        </div>

        {/* Row 3 – Advanced Options (collapsible) */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>Advanced Options — Hairline, Density &amp; Styling Direction</span>
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
                <p className="text-[11px] font-semibold text-gray-600 mb-1.5">Hair Styling / Parting</p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLING_OPTIONS.map((o) => <OptionPill key={o.id} active={hairStyling === o.id} onClick={() => setHairStyling(o.id)} label={o.label} desc="" />)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row 4 – View Mode + Generate button side by side on md+ */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-56 shrink-0">
            <p className="text-xs font-semibold text-gray-700 mb-2">Preview Mode</p>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("single")}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${viewMode === "single" ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                Single View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("multi")}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${viewMode === "multi" ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                4-View
              </button>
            </div>
            {viewMode === "multi" && <p className="text-[10px] text-gray-400 mt-1">Front, left, right &amp; back — ~30–60s</p>}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit || isAnyLoading}
            className="w-full rounded-xl bg-black px-5 py-3 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
          >
            {isAnyLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {viewMode === "multi" ? "Generating 4 views — please wait…" : "Generating — this may take 20–30s…"}
              </>
            ) : "✨ Generate AI Preview"}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 leading-snug break-words">{error}</p>}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── Result section — appears below after first click ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {hasGeneratedOnce && (
        <div ref={resultRef} className="mt-4 result-slide-in">
          {viewMode === "single" ? (
            /* ─ Single view ─ */
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

              {isLoading ? (
                <ShimmerCard label="AI is styling your look…" />
              ) : resultImageUrl ? (
                <div className="flex flex-col gap-3">
                  {/* Before/After slider */}
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 w-full" style={{ height: 420 }}>
                    {/* After — base (click to open lightbox) */}
                    <RevealImage src={resultImageUrl} alt="AI hair try-on result" className="absolute inset-0 w-full h-full object-cover" />
                    {/* Before — clipped overlay */}
                    <img
                      src={facePreviewUrl}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}
                    />
                    {/* Divider */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none" style={{ left: `${compareValue}%` }}>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4 6H8M2 6L4 4M2 6L4 8M10 6L8 4M10 6L8 8" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">Before</div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">After</div>
                    {/* View full button */}
                    <button
                      type="button"
                      onClick={() => setLightbox({ src: resultImageUrl, label: "AI Try-On Result" })}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 4V1H4M6 1H9V4M9 6V9H6M4 9H1V6" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      View Full
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 w-10 text-right">Before</span>
                    <input type="range" min={0} max={100} value={compareValue} onChange={(e) => setCompareValue(Number(e.target.value))} className="flex-1 accent-black" />
                    <span className="text-[11px] text-gray-400 w-8">After</span>
                  </div>

                  <div className="flex justify-center gap-6">
                    <button type="button" onClick={() => setLightbox({ src: resultImageUrl, label: "AI Try-On Result" })} className="text-xs text-gray-700 hover:text-black font-medium border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">🔍 View Image</button>
                    <a href={resultImageUrl} download="hair-try-on-result.jpg" className="text-xs text-gray-500 underline hover:text-black">Download</a>
                    <button type="button" onClick={handleSingleGenerate} disabled={isAnyLoading} className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-40 font-medium">Regenerate ↻</button>
                  </div>
                </div>
              ) : (
                /* Uploaded face preview before generate */
                facePreviewUrl && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 w-full" style={{ height: 420 }}>
                    <img src={facePreviewUrl} alt="Your uploaded photo" className="w-full h-full object-cover opacity-50" />
                  </div>
                )
              )}
            </div>
          ) : (
            /* ─ 4-view grid ─ */
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
                  const src     = multiViewResults[angle.id];
                  return (
                    <div key={angle.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{angle.icon} {angle.label}</p>
                        {src && (
                          <a href={src} download={`${angle.id}-view.jpg`} className="text-[10px] text-gray-400 underline hover:text-black">Save</a>
                        )}
                      </div>
                      <div
                        className={`relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 ${src ? "cursor-pointer group" : ""}`}
                        style={{ aspectRatio: "3/4" }}
                        onClick={src ? () => setLightbox({ src, label: angle.label }) : undefined}
                        title={src ? "Click to view full size" : undefined}
                      >
                        {loading ? (
                          <ShimmerCard label={`Generating ${angle.label}…`} />
                        ) : src ? (
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

              {hasMultiResults && !isMultiViewLoading && (
                <div className="mt-3 flex justify-center">
                  <button type="button" onClick={handleMultiViewGenerate} disabled={isAnyLoading} className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-40 font-medium">Regenerate all 4 views ↻</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] text-gray-400">
        By uploading, user confirms consent for AI processing. Images are used only for this preview and not stored.
      </p>
    </section>
  );
}

export default HairPatchTryOnSection;
