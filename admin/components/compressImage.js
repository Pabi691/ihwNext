// Downscale + re-encode a blob to a JPEG File under the backend's 2 MB
// /api/images cap. AI-generated PNGs routinely come back 2-4 MB. Returns null
// if it's still too big at the lowest quality step.
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export async function compressUnder2MB(blob, baseName) {
  if (blob.size <= MAX_UPLOAD_BYTES && (blob.type === "image/jpeg" || blob.type === "image/webp")) {
    return new File([blob], `${baseName}.${blob.type === "image/webp" ? "webp" : "jpg"}`, { type: blob.type });
  }
  const bmp = await createImageBitmap(blob);
  const scale = Math.min(1, 1280 / bmp.width);
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bmp, 0, 0, w, h);
  if (typeof bmp.close === "function") bmp.close();
  for (const q of [0.85, 0.75, 0.65, 0.55]) {
    const out = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", q));
    if (out && out.size <= MAX_UPLOAD_BYTES) {
      return new File([out], `${baseName}.jpg`, { type: "image/jpeg" });
    }
  }
  return null;
}
