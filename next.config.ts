import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn-icons-png.flaticon.com"],
  },
  env: {
    NEXT_PUBLIC_VERCEL_INSIGHTS: "0",
  },
};

export default nextConfig;
