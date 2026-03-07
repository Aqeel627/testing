import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;