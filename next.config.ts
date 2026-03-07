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

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ✅ Fixes: No HSTS header found
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // ✅ Fixes: No COOP header found
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // safer than same-origin if you use OAuth popups
          },
          // ✅ Fixes: No frame control policy (clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // ✅ Fixes: X-Content-Type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ✅ Fixes: Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // ✅ Fixes: Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // ✅ Fixes: No CSP found — adjust domains based on what your app uses
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              "media-src 'self' https:",
              "frame-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;