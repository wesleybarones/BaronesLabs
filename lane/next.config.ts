import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
    inlineCss: true,
    staleTimes: { dynamic: 60, static: 300 },
  },
};

export default nextConfig;
