import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static, so the site builds to plain files in `out/`
  // and is served by Cloudflare as static assets (see wrangler.jsonc).
  output: "export",
  trailingSlash: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
