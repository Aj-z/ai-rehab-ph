import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Don't fail build on type errors during development
    ignoreBuildErrors: false,
  },
  reactCompiler: true,
};

export default nextConfig;
