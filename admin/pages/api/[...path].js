const API_BASE = `${(process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "")}/api`;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const queryIndex = req.url?.indexOf("?") ?? -1;
  const query = queryIndex >= 0 ? req.url?.slice(queryIndex) : "";
  const targetUrl = `${API_BASE}/${pathParts.join("/")}${query || ""}`;

  const headers = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!value) return;
    if (key.toLowerCase() === "host") return;
    if (key.toLowerCase() === "origin") return;
    headers[key] = Array.isArray(value) ? value.join(",") : value;
  });

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
