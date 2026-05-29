import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We live inside a larger repo that has its own lockfile higher up; pin the
  // Turbopack root to this project so Next stops guessing.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
