import type { NextConfig } from "next";

// Same-box backend: when API_BACKEND_RESOLVE is set (e.g. 127.0.0.1), remap the
// backend hostname to that IP for every server-side request in this process —
// SSR SEO fetches, the sitemap, the /api proxy. TLS SNI, the Host header and
// cert validation still use the real hostname, so this is transparent and
// secure; it just skips the public CDN/WAF edge that sits in front of the
// origin. undici (global fetch) and node http(s) both honour dns.lookup.
if (process.env.API_BACKEND_RESOLVE) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dns = require("node:dns");
  const target = String(process.env.API_BACKEND_RESOLVE).trim();
  let mapHost = process.env.API_BACKEND_HOST || "";
  if (!mapHost) {
    try {
      mapHost = new URL(process.env.API_BACKEND_URL || "https://server.indianhairworld.com").hostname;
    } catch {
      mapHost = "server.indianhairworld.com";
    }
  }
  const origLookup = dns.lookup.bind(dns);
  dns.lookup = (hostname: string, options: any, callback: any) => {
    const cb = typeof options === "function" ? options : callback;
    if (hostname === mapHost && typeof cb === "function") {
      if (options && typeof options === "object" && options.all) {
        return cb(null, [{ address: target, family: 4 }]);
      }
      return cb(null, target, 4);
    }
    return origLookup(hostname, options, callback);
  };
}

// The site's own public URL — all browser API calls are routed here so
// they go through the Next.js proxy (pages/api/[...path].ts) and never
// hit connect.indianhairworld.com directly from the browser (avoids CORS).
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || SITE_URL,
    NEXT_PUBLIC_SITE_URL: SITE_URL,
  },
  async rewrites() {
    const backend = (process.env.API_BACKEND_URL || "https://server.indianhairworld.com").replace(/\/+$/, "");
    return [
      {
        source: "/uploads/:path*",
        destination: `${backend}/uploads/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "indianhairworld.com",
          },
        ],
        destination: "https://www.indianhairworld.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['indianhairworld.com', 'connect.indianhairworld.com', 'api.indianhairworld.com', 'cdn.indianhairworld.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.indianhairworld.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
    optimizePackageImports: ['react-icons', 'swiper', 'lucide-react'],
  },
};

export default nextConfig;
