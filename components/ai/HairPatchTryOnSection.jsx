import React, { useEffect, useMemo, useState } from "react";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read uploaded image."));
    reader.readAsDataURL(file);
  });
}

function HairPatchTryOnSection({ productImage }) {
  const [faceFile, setFaceFile] = useState(null);
  const [facePreviewUrl, setFacePreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [compareValue, setCompareValue] = useState(50);

  const canSubmit = useMemo(() => {
    return Boolean(faceFile && productImage && !isLoading);
  }, [faceFile, productImage, isLoading]);

  useEffect(() => {
    if (!faceFile) {
      setFacePreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(faceFile);
    setFacePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [faceFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setResultImageUrl("");

    if (!file) {
      setFaceFile(null);
      return;
    }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faceImageBase64: base64,
          faceImageMimeType: faceFile.type,
          productImageUrl: productImage,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Generation failed. Please try again.");
      }

      setResultImageUrl(payload.generatedImageDataUrl);
    } catch (err) {
      setError(err?.message || "Could not generate the try-on image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-[#f7f8fa] to-[#eef4ff] p-4 md:p-6 my-6">
      <div className="flex flex-col gap-2 mb-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">AI Studio</p>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
          Virtual Hair Patch Try-On
        </h3>
        <p className="text-sm text-gray-900">
          Upload a clear front-face photo and preview this hair patch with a realistic blend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label
            htmlFor="try-on-face-upload"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Upload Face Image
          </label>
          <input
            id="try-on-face-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-white file:cursor-pointer"
          />
          <p className="mt-2 text-xs text-gray-500">
            Best results: plain background, good light, straight face angle.
          </p>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating Preview..." : "Generate AI Preview"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 min-h-[360px]">
          {!facePreviewUrl && !resultImageUrl && (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
              Upload an image to see preview.
            </div>
          )}

          {(facePreviewUrl || resultImageUrl) && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                {resultImageUrl ? (
                  <>
                    <img
                      src={resultImageUrl}
                      alt="AI generated hair patch try-on"
                      className="w-full h-[320px] object-cover"
                    />
                    <div
                      className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white"
                      style={{ width: `${compareValue}%` }}
                    >
                      <img
                        src={facePreviewUrl}
                        alt="Uploaded original face"
                        className="w-full h-[320px] min-w-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded">
                      Before / After
                    </div>
                  </>
                ) : (
                  <img
                    src={facePreviewUrl}
                    alt="Uploaded face preview"
                    className="w-full h-[320px] object-cover"
                  />
                )}
              </div>

              {resultImageUrl && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={compareValue}
                  onChange={(e) => setCompareValue(Number(e.target.value))}
                  className="w-full"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        By uploading, user confirms consent for AI processing. Images are used only to render this preview.
      </p>
    </section>
  );
}

export default HairPatchTryOnSection;
