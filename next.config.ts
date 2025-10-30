import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fakestoreapi.com" },
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  typescript: {
    // ✅ Allow builds even if there are TS errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Optional: ignore ESLint errors during build (for Render/Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
