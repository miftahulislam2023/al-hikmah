import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Enable ESLint during builds
    ignoreDuringBuilds: false,
    // Directories to check with ESLint
    dirs: ['src'],
  },
};

export default nextConfig;
