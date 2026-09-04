import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

/**
 * Server-side JSON fetch against the Laravel backend.
 *
 * Honours API_BACKEND_RESOLVE at runtime: when set (e.g. 127.0.0.1) the socket
 * connects to that IP while TLS SNI, the Host header and certificate validation
 * still use the real hostname — the `curl --resolve host:443:IP` trick. That
 * keeps same-box traffic off the public CDN/WAF edge.
 *
 * This lives here rather than in next.config.ts because `output: "standalone"`
 * serialises the config at build time and never evaluates it in the running
 * server, so a dns.lookup patch there would never take effect in production.
 */
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const backendOrigin = () =>
  (process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "");

export async function backendFetchJson(
  path: string,
  extraHeaders: Record<string, string> = {}
): Promise<any> {
  const url = `${backendOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
  const resolveIp = (process.env.API_BACKEND_RESOLVE || "").trim();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": BROWSER_UA,
    ...extraHeaders,
  };

  if (!resolveIp) {
    const res = await fetch(url, { headers, cache: "no-store" } as any);
    if (!res.ok) throw new Error(`backend responded ${res.status}`);
    return res.json();
  }

  const u = new URL(url);
  const isHttps = u.protocol === "https:";
  const hostName = (process.env.API_BACKEND_HOST || u.hostname).trim();
  const reqFn = isHttps ? httpsRequest : httpRequest;
  const port = Number(u.port) || (isHttps ? 443 : 80);

  const raw: string = await new Promise((resolve, reject) => {
    const r = reqFn(
      {
        host: resolveIp,
        port,
        method: "GET",
        path: u.pathname + u.search,
        headers: { ...headers, host: hostName, "accept-encoding": "identity" },
        servername: isHttps ? hostName : undefined,
        timeout: 15000,
      },
      (resp) => {
        const chunks: Buffer[] = [];
        resp.on("data", (c: Buffer) => chunks.push(c));
        resp.on("end", () => {
          const status = resp.statusCode || 0;
          if (status < 200 || status >= 300) {
            return reject(new Error(`backend responded ${status}`));
          }
          resolve(Buffer.concat(chunks).toString("utf8"));
        });
      }
    );
    r.on("error", reject);
    r.on("timeout", () => r.destroy(new Error("backend request timed out")));
    r.end();
  });

  return JSON.parse(raw);
}
