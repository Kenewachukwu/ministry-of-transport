import type { NextConfig } from "next";

/**
 * What the pages may load. Scripts and styles allow `unsafe-inline` because Next.js
 * writes small inline bootstrap scripts and styles; a stricter nonce-based policy
 * would force every page to be rendered per request. Everything else is limited to
 * this site plus the picture hosts the admin accepts and Vercel Blob (uploads).
 * Production only: the development server needs eval and a live-reload socket.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self' https://vercel.com https://*.vercel-storage.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const publicSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
];

const nextConfig: NextConfig = {
  // Embedded Postgres (WASM) is a local-development convenience; keep it out of
  // bundles and out of the deployed function's traced files.
  serverExternalPackages: ["@electric-sql/pglite"],
  outputFileTracingExcludes: {
    "*": ["node_modules/@electric-sql/pglite/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      // Pictures uploaded through the admin (Vercel Blob public store).
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  // The public pages used to live under /direction-a. Keep every old address working, permanently.
  async redirects() {
    return [
      { source: "/direction-a", destination: "/", permanent: true },
      { source: "/direction-a/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      // Every page (listed first, so the admin's stricter rules below win where they overlap).
      { source: "/:path*", headers: publicSecurityHeaders },
      {
        // The admin is private: keep it out of search engines, out of frames,
        // out of caches, and don't leak its URLs (invite/reset links) as referrers.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
