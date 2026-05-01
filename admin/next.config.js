/** @type {import('next').NextConfig} */

const ADMIN_URL = (
  process.env.NEXT_PUBLIC_ADMIN_URL || "https://ihwadmin.vercel.app"
).replace(/\/+$/, "");

const BACKEND_URL = (
  process.env.API_BACKEND_URL || "https://server.indianhairworld.com"
).replace(/\/+$/, "");

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: ADMIN_URL,
  },
  async rewrites() {
    return [
      // Proxy all /api/* calls to the actual backend (server-to-server, no CORS)
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      // Proxy /uploads/* to backend so blog images load correctly
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
  images: {
    domains: [
      "indianhairworld.com",
      "cdn.indianhairworld.com",
      "connect.indianhairworld.com",
      "server.indianhairworld.com",
    ],
  },
};

module.exports = nextConfig;
