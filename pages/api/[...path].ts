import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE = "https://server.indianhairworld.com/api";

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
    if (key.toLowerCase() === "host") return;
    if (key.toLowerCase() === "origin") return;
    if (Array.isArray(value)) {
      headers[key] = value.join(",");
    } else {
      headers[key] = value;
    }
  });

  if (!headers.authorization) {
    const webToken = process.env.NEXT_PUBLIC_WEB_TOKEN;
    if (webToken) {
      headers.authorization = `Bearer ${webToken}`;
    }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method && !["GET", "HEAD"].includes(req.method) ? (req as any) : undefined,
      // Required for Node.js when sending a stream body
      duplex: "half",
    } as RequestInit);

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
    res.status(500).json({ error: "Proxy error", message: error?.message ?? "Unknown error" });
  }
}
