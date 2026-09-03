const LOCAL_API_BASE = `${(process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "")}/api`;

// Page images (uploads + the media library) must live on the Hostinger CDN even
// while everything else runs locally, so /api/images is proxied to the live
// backend. That backend needs its own auth token — the local admin session's
// token is not valid there — so we swap the Authorization header for these calls.
const CDN_API_BASE = `${(process.env.PROD_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "")}/api`;
const CDN_UPLOAD_TOKEN = process.env.PROD_UPLOAD_TOKEN || "";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const queryIndex = req.url?.indexOf("?") ?? -1;
  const query = queryIndex >= 0 ? req.url?.slice(queryIndex) : "";

  const isCdnImages = pathParts[0] === "images";
  const apiBase = isCdnImages ? CDN_API_BASE : LOCAL_API_BASE;
  const targetUrl = `${apiBase}/${pathParts.join("/")}${query || ""}`;

  const headers = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!value) return;
    const lower = key.toLowerCase();
    if (lower === "host") return;
    if (lower === "origin") return;
    if (isCdnImages && lower === "authorization") return; // replaced below
    headers[key] = Array.isArray(value) ? value.join(",") : value;
  });
  if (isCdnImages && CDN_UPLOAD_TOKEN) {
    headers["authorization"] = `Bearer ${CDN_UPLOAD_TOKEN}`;
  }

  try {
    const requestInit = {
      method: req.method,
      headers,
    };

    if (req.method && !["GET", "HEAD"].includes(req.method)) {
      requestInit.body = req;
      requestInit.duplex = "half";
    }

    const upstream = await fetch(targetUrl, requestInit);

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower === "transfer-encoding") return;
      if (lower === "content-encoding") return;
      if (lower === "content-length") return;
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (error) {
    res.status(502).json({ error: "Proxy error", message: error?.message ?? "Unknown error" });
  }
}
