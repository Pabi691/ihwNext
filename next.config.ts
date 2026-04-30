import type { NextConfig } from "next";

const sanitizePublicApiUrl = (value?: string) => {
  const normalized = (value || "").trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return "https://connect.indianhairworld.com";
  }
  return normalized.replace(/\/+$/, "").replace(/\/api\/v1$/i, "");
};

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: sanitizePublicApiUrl(process.env.NEXT_PUBLIC_API_URL),
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com",
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
