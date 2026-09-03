import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Reverse proxy: browser -> /api/*  ->  the Laravel backend.
 *
 * API_BACKEND_URL  : where to send the request. Normally the public backend
 *                    URL, but it can also be a bare origin IP
 *                    (e.g. http://46.202.138.44) so the call goes straight to
 *                    the origin server and skips the CDN/WAF edge — useful when
 *                    the edge blocks server-to-server traffic.
 * API_BACKEND_HOST : optional Host header to send. Required when API_BACKEND_URL
 *                    is an IP, so the origin's vhost routing still works
 *                    (e.g. "server.indianhairworld.com").
 * NEXT_PUBLIC_WEB_TOKEN : bearer token added when the caller sent none.
 */
const BACKEND_ORIGIN = (process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "");
const API_BASE = `${BACKEND_ORIGIN}/api`;
const BACKEND_HOST = (process.env.API_BACKEND_HOST || "").trim();

// A real browser UA — some edge/WAF layers 403 requests that look like bots
// (no UA, or "node"). Server-initiated calls (SSR, warmup) have no UA to forward.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// When API_BACKEND_URL is a bare origin IP, use http:// (not https://) so there
// is no TLS-cert mismatch, and pair it with API_BACKEND_HOST for vhost routing.
const isIpOrigin = /^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?$/i.test(BACKEND_ORIGIN);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const queryIndex = req.url?.indexOf("?") ?? -1;
  const query = queryIndex >= 0 ? req.url?.slice(queryIndex) : "";
  const targetUrl = `${API_BASE}/${pathParts.join("/")}${query || ""}`;

  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!value) return;
    const lower = key.toLowerCase();
    if (lower === "host") return;
    if (lower === "origin") return;
    if (lower === "content-length") return; // let fetch recompute it
    headers[key] = Array.isArray(value) ? value.join(",") : value;
  });

  // Route to the right vhost when we're talking to an IP.
  if (BACKEND_HOST) headers["host"] = BACKEND_HOST;
  // Never let a bot filter reject us for a missing/odd UA.
  if (!headers["user-agent"] || /^node/i.test(headers["user-agent"])) {
    headers["user-agent"] = BROWSER_UA;
  }
  if (!headers.authorization) {
    const webToken = process.env.NEXT_PUBLIC_WEB_TOKEN;
    if (webToken) {
      headers.authorization = `Bearer ${webToken}`;
    }
  }

  try {
    const requestInit: RequestInit = {
      method: req.method,
      headers,
      // Stay on the origin IP — don't let a 301 to the public URL bounce us
      // back through the edge we're trying to avoid.
      redirect: isIpOrigin ? "manual" : "follow",
    };

    if (req.method && !["GET", "HEAD"].includes(req.method)) {
      // Buffer body into memory so binary multipart/form-data (file uploads)
      // are forwarded correctly. Streaming `req` directly as a Node.js stream
      // can corrupt binary content when using native fetch.
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      requestInit.body = Buffer.concat(chunks);
    }

    const upstream = await fetch(targetUrl, requestInit as RequestInit);

    if (!upstream.ok) {
      console.error(`[proxy] ${req.method} ${targetUrl} → ${upstream.status} ${upstream.statusText}`);
    }

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
  } catch (error: any) {
    res.status(502).json({ error: "Proxy error", message: error?.message ?? "Unknown error" });
  }
}
