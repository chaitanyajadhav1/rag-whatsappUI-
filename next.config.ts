import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/pdf-parse/lib/**/*"],
  },
};

export default nextConfig;
