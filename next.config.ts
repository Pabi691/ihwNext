import type { NextConfig } from "next";

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
