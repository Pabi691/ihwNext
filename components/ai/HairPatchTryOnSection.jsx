import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

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
    if (!response.ok) {
      throw new Error("The server returned an invalid response. Please try again.");
    }
    throw new Error("Could not read the AI response.");
  }
}

function HairPatchTryOnSection({
  productImage,
  productImages = [],
  productName = "",
  productTag = "",
  productDescription = "",
}) {
  const [faceFile, setFaceFile] = useState(null);
  const [facePreviewUrl, setFacePreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [compareValue, setCompareValue] = useState(50);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [hairStatus, setHairStatus] = useState("has_hair");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const canSubmit = useMemo(
    () => Boolean(faceFile && productImage && !isLoading),
    [faceFile, productImage, isLoading]
  );

  useEffect(() => {
    if (!faceFile) { setFacePreviewUrl(""); return; }
    const url = URL.createObjectURL(faceFile);
    setFacePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [faceFile]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    setShowCamera(false);
  }, []);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
      // Attach stream after modal mounts
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
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    // Mirror the image to match the preview (front camera shows mirrored)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
        setFaceFile(file);
        setResultImageUrl("");
        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setResultImageUrl("");
    if (!file) { setFaceFile(null); return; }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP).");
      setFaceFile(null);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Please upload an image under 8MB.");
      setFaceFile(null);
      return;
    }
    setFaceFile(file);
  };

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");
    setResultImageUrl("");
    try {
      const faceDataUrl = await fileToDataUrl(faceFile);
      const base64 = String(faceDataUrl).split(",")[1];
      const response = await fetch("/api/ai/hair-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceImageBase64: base64,
          faceImageMimeType: faceFile.type,
          productImageUrl: productImage,
          productImageUrls: productImages,
          productName,
          productTag,
          productDescription,
          hairStatus,
        }),
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

  return (
    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-[#f7f8fa] to-[#eef4ff] p-4 md:p-6 my-6">
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">AI Studio</p>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Virtual Hair Try-On</h3>
        <p className="text-sm text-gray-500">
          Upload a front-face photo or use your camera — AI will place this hair piece on your head.
        </p>
      </div>

      {/* Camera modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">Take a Photo</p>
              <button onClick={stopCamera} className="text-gray-400 hover:text-black text-xl leading-none">✕</button>
            </div>
            <div className="relative bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                  Starting camera...
                </div>
              )}
            </div>
            <div className="p-4 flex gap-3">
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 transition-opacity"
              >
                📸 Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {!showCamera && <canvas ref={canvasRef} className="hidden" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input panel */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800">Your Photo</p>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Hair Situation</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHairStatus("bald_or_thinning")}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  hairStatus === "bald_or_thinning"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                I am bald / thinning
              </button>
              <button
                type="button"
                onClick={() => setHairStatus("has_hair")}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  hairStatus === "has_hair"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                I already have hair
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label
              htmlFor="try-on-face-upload"
              className="flex flex-col items-center justify-center gap-1 cursor-pointer border border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">🖼️</span>
              <span className="font-medium text-xs">Upload Photo</span>
              <input
                id="try-on-face-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={startCamera}
              className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">📷</span>
              <span className="font-medium text-xs">Use Camera</span>
            </button>
          </div>

          {faceFile ? (
            <p className="text-xs text-green-600 font-medium truncate">✓ {faceFile.name}</p>
          ) : (
            <p className="text-xs text-gray-400">Best results: plain background, good light, straight-on angle.</p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="mt-auto w-full rounded-xl bg-black px-5 py-3 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating — this may take 20–30s…
              </>
            ) : (
              "✨ Generate AI Preview"
            )}
          </button>

          {error && <p className="text-sm text-red-600 leading-snug break-words">{error}</p>}
        </div>

        {/* Preview panel */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 min-h-[340px] flex flex-col">
          {!facePreviewUrl && !resultImageUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl gap-2 min-h-[300px]">
              <span className="text-4xl">🪞</span>
              <p className="text-sm">Preview will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Before/after image */}
              <div className="relative rounded-xl overflow-hidden border border-gray-100 h-[300px] bg-gray-50">
                {resultImageUrl ? (
                  <>
                    {/* After (result) — base layer */}
                    <img
                      src={resultImageUrl}
                      alt="AI hair try-on result"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Before (original) — clipped overlay using clipPath */}
                    <img
                      src={facePreviewUrl}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}
                    />
                    {/* Divider line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
                      style={{ left: `${compareValue}%` }}
                    />
                    {/* Labels */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      Before
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      After
                    </div>
                  </>
                ) : (
                  <img
                    src={facePreviewUrl}
                    alt="Uploaded face"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {resultImageUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 w-10 text-right">Before</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={compareValue}
                    onChange={(e) => setCompareValue(Number(e.target.value))}
                    className="flex-1 accent-black"
                  />
                  <span className="text-[11px] text-gray-400 w-8">After</span>
                </div>
              )}

              {resultImageUrl && (
                <a
                  href={resultImageUrl}
                  download="hair-try-on-result.jpg"
                  className="text-center text-xs text-gray-500 underline hover:text-black"
                >
                  Download result
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-gray-400">
        By uploading, user confirms consent for AI processing. Images are used only for this preview and not stored.
      </p>
    </section>
  );
}

export default HairPatchTryOnSection;
