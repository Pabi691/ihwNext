/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'indianhairworld.com',
      'cdn.indianhairworld.com',
      'connect.indianhairworld.com',
    ],
  },
};

module.exports = nextConfig;
