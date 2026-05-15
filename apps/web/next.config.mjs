import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@looma/shared"],
  turbopack: {
    root: new URL("../..", import.meta.url).pathname
  }
};

export default withMDX(nextConfig);
