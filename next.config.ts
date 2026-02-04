import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
