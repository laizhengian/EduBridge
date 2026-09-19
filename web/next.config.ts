import type { NextConfig } from "next";

/**
 * Security headers — mapped to docs/vibe-coded-app-security-checklist.md
 *
 * CSP note: script-src carries 'unsafe-inline' because Next.js hydration
 * injects inline scripts. When Supabase auth lands, this moves to a
 * nonce-based policy generated in middleware (strict, no unsafe-inline).
 * Tracked in docs/security-plan.md → Phase B.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'", // add the Supabase project origin when the backend lands
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Clickjacking: the app must never be framed by another site.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers guessing file types (MIME sniffing attacks).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to other sites when following links.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Only this app may use the camera (absence-note photo). Nothing else.
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=()",
  },
  // Enforced fully once deployed over HTTPS (Vercel adds its own too).
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // The repo root is web/ itself; stops Turbopack searching for lockfiles above it.
  turbopack: { root: __dirname },
  // Hide the floating Next.js dev-tools badge — not part of the product.
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
