import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build stamp consumed by the site-health deployment metadata card. Vercel
  // injects the commit hash itself (VERCEL_GIT_COMMIT_SHA); the timestamp is
  // set here at build time so the health page never shows a stale date.
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString(),
  },
  outputFileTracingIncludes: {
    "/api/yacht-social-image/*": [
      "./public/images/brand/mcc-logo-light.png",
      "./public/images/caribbean-water-bg.webp",
      "./public/images/aquanimity/Aquanimity-Dufour-48-Yacht-Charter-BVI.jpg",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
      },
      {
        protocol: "https",
        hostname: "same-assets.com",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.mycaribbeancharters.com",
      },
      {
        protocol: "https",
        hostname: "bali-catamarans.hr",
      },
    ],
    // Optimize images for better Core Web Vitals
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Compression for better performance
  compress: true,
  // Power optimizations
  poweredByHeader: false,
};

export default nextConfig;
