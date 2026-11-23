import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    // Alleen voor lokale tests: gewone Postgres in plaats van Neon.
    resolveAlias: process.env.USE_LOCAL_PG
      ? { "@/db": "./src/db/local.ts" }
      : {},
  },
};

export default nextConfig;
