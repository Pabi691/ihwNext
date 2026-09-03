import type { NextApiRequest, NextApiResponse } from "next";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

/**
 * Reverse proxy: browser -> /api/*  ->  the Laravel backend.
 *
 * API_BACKEND_URL     : backend base URL. Default https://server.indianhairworld.com
 * API_BACKEND_RESOLVE : optional IP to connect to instead of DNS-resolving the
 *                       backend host. TLS SNI, the Host header and cert
 *                       validation still use the real hostname — this is the
 *                       `curl --resolve host:443:IP` trick. Set to 127.0.0.1
 *                       when the frontend runs on the same box as the backend,
 *                       so calls skip the public CDN/WAF edge entirely.
 * API_BACKEND_HOST    : optional override for the Host header / SNI name
 *                       (defaults to the API_BACKEND_URL hostname).
 * NEXT_PUBLIC_WEB_TOKEN : bearer token added when the caller sent none.
 */
const BACKEND_ORIGIN = (process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "");
const API_BASE = `${BACKEND_ORIGIN}/api`;
const BACKEND_HOST = (process.env.API_BACKEND_HOST || "").trim();
const BACKEND_RESOLVE = (process.env.API_BACKEND_RESOLVE || "").trim();

// A real browser UA — some edge/WAF layers 403 requests that look like bots
// (no UA, or "node"). Server-initiated calls (SSR, warmup) have no UA to forward.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const isIpOrigin = /^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?$/i.test(BACKEND_ORIGIN);

export const config = {
  api: {
    bodyParser: false,
  },
};

type UpstreamResult = {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: Buffer;
};

// Direct Node http(s) call with a connect-IP override. Connects the socket to
// `connectHost` but keeps `hostName` for SNI + Host + certificate validation.
function requestViaNode(
  targetUrl: string,
  hostName: string,
  connectHost: string,
  method: string,
  headers: Record<string, string>,
  body?: Buffer
): Promise<UpstreamResult> {
  const u = new URL(targetUrl);
  const isHttps = u.protocol === "https:";
  const reqFn = isHttps ? httpsRequest : httpRequest;
  const port = Number(u.port) || (isHttps ? 443 : 80);

  return new Promise<UpstreamResult>((resolve, reject) => {
    const r = reqFn(
      {
        host: connectHost,
        port,
        method,
        path: u.pathname + u.search,
        headers: {
          ...headers,
          host: hostName,
          // node http() does not auto-decompress; ask for identity so the body
          // we relay matches the (stripped) content-encoding header.
          "accept-encoding": "identity",
        },
        servername: isHttps ? hostName : undefined,
        timeout: 25000,
      },
      (resp) => {
        const chunks: Buffer[] = [];
        resp.on("data", (c: Buffer) => chunks.push(c));
        resp.on("end", () =>
          resolve({
            status: resp.statusCode || 502,
            headers: resp.headers,
            body: Buffer.concat(chunks),
          })
        );
      }
    );
    r.on("error", reject);
    r.on("timeout", () => r.destroy(new Error("upstream timeout")));
    if (body && body.length) r.write(body);
    r.end();
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const queryIndex = req.url?.indexOf("?") ?? -1;
  const query = queryIndex >= 0 ? req.url?.slice(queryIndex) : "";
  const targetUrl = `${API_BASE}/${pathParts.join("/")}${query || ""}`;
  const hostName = BACKEND_HOST || new URL(BACKEND_ORIGIN).hostname;

  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!value) return;
    const lower = key.toLowerCase();
    if (lower === "host") return;
    if (lower === "origin") return;
    if (lower === "content-length") return; // recomputed downstream
    headers[key] = Array.isArray(value) ? value.join(",") : value;
  });

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

  let body: Buffer | undefined;
  if (req.method && !["GET", "HEAD"].includes(req.method)) {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    body = Buffer.concat(chunks);
  }

  const relay = (status: number, rawHeaders: Record<string, string | string[] | undefined>, buf: Buffer) => {
    res.status(status);
    for (const [key, value] of Object.entries(rawHeaders)) {
      if (value === undefined) continue;
      const lower = key.toLowerCase();
      if (lower === "transfer-encoding") continue;
      if (lower === "content-encoding") continue;
      if (lower === "content-length") continue;
      res.setHeader(key, value as string | string[]);
    }
    res.setHeader("Content-Length", buf.length);
    res.send(buf);
  };

  try {
    if (BACKEND_RESOLVE) {
      // Same-box loopback path — bypasses the public CDN/WAF edge.
      const r = await requestViaNode(targetUrl, hostName, BACKEND_RESOLVE, req.method || "GET", headers, body);
      if (r.status >= 400) {
        console.error(`[proxy] ${req.method} ${targetUrl} (via ${BACKEND_RESOLVE}) → ${r.status}`);
      }
      relay(r.status, r.headers, r.body);
      return;
    }

    const requestInit: RequestInit = {
      method: req.method,
      headers: BACKEND_HOST ? { ...headers, host: BACKEND_HOST } : headers,
      redirect: isIpOrigin ? "manual" : "follow",
    };
    if (body) (requestInit as { body?: unknown }).body = body;

    const upstream = await fetch(targetUrl, requestInit as RequestInit);
    if (!upstream.ok) {
      console.error(`[proxy] ${req.method} ${targetUrl} → ${upstream.status} ${upstream.statusText}`);
    }
    const outHeaders: Record<string, string> = {};
    upstream.headers.forEach((value, key) => {
      outHeaders[key] = value;
    });
    relay(upstream.status, outHeaders, Buffer.from(await upstream.arrayBuffer()));
  } catch (error: any) {
    res.status(502).json({ error: "Proxy error", message: error?.message ?? "Unknown error" });
  }
}
