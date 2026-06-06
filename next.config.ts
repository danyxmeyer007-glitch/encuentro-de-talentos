import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-dev",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
