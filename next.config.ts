import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

const createNextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(isDev ? { distDir: ".next-user" } : {}),
    turbopack: {
      root: process.cwd(),
    },
  };
};

export default createNextConfig;
