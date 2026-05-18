/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // allowedDevOrigins: ['hypnotic-handball-numbly.ngrok-free.dev'],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
