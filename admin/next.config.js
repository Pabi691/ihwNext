/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'indianhairworld.com',
      'cdn.indianhairworld.com',
      'server.indianhairworld.com',
    ],
  },
};

module.exports = nextConfig;
