/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    domains: [
      "img.clerk.com",
      "images.clerk.dev",
      "cdn-icons-png.flaticon.com",
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
