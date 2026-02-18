import type { NextConfig } from "next";

const sanitizePublicApiUrl = (value?: string) => {
  const normalized = (value || "").trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return "https://server.indianhairworld.com";
  }
  return normalized.replace(/\/+$/, "").replace(/\/api\/v1$/i, "");
};

const nextConfig: NextConfig = {
  output: "standalone",
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
    domains: ['indianhairworld.com', 'server.indianhairworld.com', 'api.indianhairworld.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.indianhairworld.com',
      },
    ],
  },
  reactStrictMode: true,
  eslint: {
    // Avoid build failure due to ESLint config mismatch while we migrate
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
