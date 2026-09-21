/**
 * Fixed-window rate limiter.
 *
 * PRODUCTION NOTE (docs/production-hardening.md → "Rate limiting at scale"):
 * this in-memory store is per-process and resets on deploy. It is the right
 * tool while the app is a single instance with no API routes. When real
 * mutating endpoints land, swap `hit()`'s body for Upstash Redis (free tier
 * covers a school) — the signature is designed so nothing else changes.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_KEYS = 5000; // bound memory: drop the oldest bucket beyond this

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets (for Retry-After). */
  retryAfter: number;
};

export function hit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_KEYS) {
    let oldestKey = "";
    let oldest = Infinity;
    for (const [k, v] of buckets) {
      if (v.resetAt < oldest) {
        oldest = v.resetAt;
        oldestKey = k;
      }
    }
    if (oldestKey) buckets.delete(oldestKey);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: Math.ceil(windowMs / 1000) };
  }

  bucket.count += 1;
  const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: limit - bucket.count, retryAfter };
}

export function resetRateLimitsForTests(): void {
  buckets.clear();
}
