import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@looma/shared"],
  turbopack: {
    root: new URL("../..", import.meta.url).pathname
  }
};

export default nextConfig;
