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
    // The browser calls Laravel directly (see components/AdminContext.jsx).
    NEXT_PUBLIC_BACKEND_URL: BACKEND_URL,
    // Local dev only: send /images through pages/api/[...path].js so uploads
    // land on the live CDN (it swaps in PROD_UPLOAD_TOKEN). A flag, never the token.
    NEXT_PUBLIC_IMAGES_VIA_PROXY: process.env.PROD_UPLOAD_TOKEN ? "1" : "",
  },
  async rewrites() {
    return [
      // Proxy /uploads/* to backend so images load correctly
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
