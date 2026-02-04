import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
