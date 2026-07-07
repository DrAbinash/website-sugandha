import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Docker-friendly image handling: serve images directly without the
  // optimization API (which needs sharp + a /_next/image endpoint that
  // doesn't always work behind reverse proxies on Synology).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
