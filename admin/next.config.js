/** @type {import('next').NextConfig} */

// Admin's own URL — browser API calls are routed here so they go through
// the Next.js proxy (rewrites below) and never hit connect.indianhairworld.com
// directly from the browser, avoiding CORS entirely.
const ADMIN_URL = (
  process.env.NEXT_PUBLIC_ADMIN_URL || "https://ihwadmin.vercel.app"
).replace(/\/+$/, "");

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: ADMIN_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://connect.indianhairworld.com/api/:path*",
      },
    ];
  },
  images: {
    domains: [
      'indianhairworld.com',
      'cdn.indianhairworld.com',
      'connect.indianhairworld.com',
    ],
  },
};

module.exports = nextConfig;
