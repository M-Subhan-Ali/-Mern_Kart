import type { NextConfig } from "next";
import withPWA from "next-pwa";

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
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_ROUTE}/:path*`,
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
