import { NextResponse, type NextProxy, type NextRequest } from "next/server";
import { hit } from "@/lib/rate-limit";

/**
 * Request gate (Next.js 16's replacement for middleware).
 *
 * Two jobs, both mapped to docs/production-hardening.md:
 *  1. Rate limit every mutating request by client IP — 30 writes / minute /
 *     IP. A dropped device in a school Wi-Fi NAT shares one IP with classmates,
 *     so the limit is deliberately generous; it exists to blunt scripted abuse
 *     and runaway loops, not to police humans.
 *  2. Reply to mutating verbs directly — the app has no write endpoints yet,
 *     and any that appear must opt in explicitly (204 responses here would
 *     fake success and swallow submissions silently).
 *
 * Deliberately NOT here: page views. Static pages are served from the edge/CDN
 * before this code runs on a static host; throttling them would only add
 * latency for an army of one. When auth lands, session refresh joins here too.
 */

const WINDOW_MS = 60_000;
const WRITE_LIMIT = 30;

// Static assets and the image optimizer: never counted, never gated.
const SKIP = ["/_next/static", "/_next/image", "/favicon", "/icon", "/manifest"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (SKIP.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!isMutating(request.method)) {
    return NextResponse.next();
  }

  const result = hit(`w:${ipOf(request)}`, WRITE_LIMIT, WINDOW_MS);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Take a breath and try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfter),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  return NextResponse.json(
    { error: "Not implemented — no write endpoints exist yet." },
    { status: 501 },
  );
}

export const config = {
  // Everything except Next's own immutable assets. Page GETs short-circuit
  // above, so matching them here only costs one branch per navigation.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function isMutating(method: string): boolean {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

function ipOf(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// Type guard for the Next 16 proxy convention.
export type { NextProxy };
