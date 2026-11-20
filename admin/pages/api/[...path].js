import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

const BACKEND_ORIGIN = (process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "");
const LOCAL_API_BASE = `${BACKEND_ORIGIN}/api`;

// Page images (uploads + the media library) must live on the Hostinger CDN even
// while everything else runs locally, so /api/images is proxied to the live
// backend. That backend needs its own auth token — the local admin session's
// token is not valid there — so we swap the Authorization header for these calls.
const CDN_API_BASE = `${(process.env.PROD_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "")}/api`;
const CDN_UPLOAD_TOKEN = process.env.PROD_UPLOAD_TOKEN || "";

// API_BACKEND_RESOLVE: an IP to connect to instead of looking the backend up in
// DNS — 127.0.0.1 when this CRM runs on the same Hostinger server as Laravel.
// TLS SNI, the Host header and certificate checks still use the real hostname
// (the `curl --resolve host:443:IP` trick), so the call never touches the CDN
// edge, which refuses requests coming from Hostinger's own servers. Same as the
// storefront's pages/api/[...path].ts. Setting it also makes the browser use
// this proxy instead of calling Laravel cross-origin (see next.config.js).
const BACKEND_RESOLVE = (process.env.API_BACKEND_RESOLVE || "").trim();
const BACKEND_HOSTNAME = new URL(BACKEND_ORIGIN).hostname;

// Some edge/WAF layers 403 requests that look like bots (no UA, or "node").
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Connects the socket to `connectHost` but keeps the URL's hostname for SNI,
// the Host header and certificate validation.
function requestViaLoopback(targetUrl, connectHost, method, headers, body) {
  const u = new URL(targetUrl);
  const isHttps = u.protocol === "https:";
  const reqFn = isHttps ? httpsRequest : httpRequest;
  const port = Number(u.port) || (isHttps ? 443 : 80);

  return new Promise((resolve, reject) => {
    const r = reqFn(
      {
        host: connectHost,
        port,
        method,
        path: u.pathname + u.search,
        headers: {
          ...headers,
          host: u.hostname,
          // node http() does not decompress; ask for identity so the body we
          // relay matches the (stripped) content-encoding header.
          "accept-encoding": "identity",
          ...(body ? { "content-length": String(body.length) } : {}),
        },
        servername: isHttps ? u.hostname : undefined,
        timeout: 60000,
      },
      (resp) => {
        const chunks = [];
        resp.on("data", (c) => chunks.push(c));
        resp.on("end", () =>
          resolve({ status: resp.statusCode || 502, headers: resp.headers, body: Buffer.concat(chunks) })
        );
      }
    );
    r.on("error", reject);
    r.on("timeout", () => r.destroy(new Error("upstream timeout")));
    if (body && body.length) r.write(body);
    r.end();
  });
}

function relay(res, status, upstreamHeaders, buffer) {
  res.status(status);
  for (const [key, value] of Object.entries(upstreamHeaders)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    if (lower === "transfer-encoding") continue;
    if (lower === "content-encoding") continue;
    if (lower === "content-length") continue;
    res.setHeader(key, value);
  }
  res.setHeader("Content-Length", buffer.length);
  res.send(buffer);
}

export default async function handler(req, res) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const queryIndex = req.url?.indexOf("?") ?? -1;
  const query = queryIndex >= 0 ? req.url?.slice(queryIndex) : "";

  const isCdnImages = pathParts[0] === "images";
  const apiBase = isCdnImages ? CDN_API_BASE : LOCAL_API_BASE;
  const targetUrl = `${apiBase}/${pathParts.join("/")}${query || ""}`;

  // Only swap in the production upload token when one is actually configured
  // (that's the local-dev case, where the local session token is not valid
  // against the live backend). On the deployed CRM the admin's own session
  // token already belongs to this backend, so pass it straight through —
  // stripping it there left the request unauthenticated and Laravel 401'd.
  const swapAuth = isCdnImages && !!CDN_UPLOAD_TOKEN;
  const useLoopback = !!BACKEND_RESOLVE && new URL(targetUrl).hostname === BACKEND_HOSTNAME;

  const headers = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!value) return;
    const lower = key.toLowerCase();
    if (lower === "host") return;
    if (lower === "origin") return;
    if (useLoopback && lower === "content-length") return; // set from the buffered body
    if (swapAuth && lower === "authorization") return; // replaced below
    headers[key] = Array.isArray(value) ? value.join(",") : value;
  });
  if (swapAuth) {
    headers["authorization"] = `Bearer ${CDN_UPLOAD_TOKEN}`;
  }
  if (!headers["user-agent"] || /^node/i.test(headers["user-agent"])) {
    headers["user-agent"] = BROWSER_UA;
  }

  const hasBody = req.method && !["GET", "HEAD"].includes(req.method);

  try {
    if (useLoopback) {
      let body;
      if (hasBody) {
        const chunks = [];
        for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        body = Buffer.concat(chunks);
      }
      const r = await requestViaLoopback(targetUrl, BACKEND_RESOLVE, req.method || "GET", headers, body);
      if (r.status >= 500) {
        console.error(`[proxy] ${req.method} ${targetUrl} (via ${BACKEND_RESOLVE}) → ${r.status}`);
      }
      relay(res, r.status, r.headers, r.body);
      return;
    }

    const requestInit = {
      method: req.method,
      headers,
    };

    if (hasBody) {
      requestInit.body = req;
      requestInit.duplex = "half";
    }

    const upstream = await fetch(targetUrl, requestInit);
    const upstreamHeaders = {};
    upstream.headers.forEach((value, key) => {
      upstreamHeaders[key] = value;
    });
    relay(res, upstream.status, upstreamHeaders, Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    res.status(502).json({ error: "Proxy error", message: error?.message ?? "Unknown error" });
  }
}
