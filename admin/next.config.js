/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
