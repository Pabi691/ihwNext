export default function compressImage(originalUrl, width = 600, quality = 70, format = 'webp') {
    if (!originalUrl) return '';
    const imagekitBase = "https://ik.imagekit.io/vaysvybyq";
    const transformation = `tr:w-${width},q-${quality},f-${format}`;
    return `${imagekitBase}/${transformation}/${originalUrl}`;
  }
  