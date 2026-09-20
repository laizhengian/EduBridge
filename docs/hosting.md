# Hosting & cost plan — what the backend will actually cost

**Question this doc answers:** "Vercel and Supabase can get costly fast — what
will hosting really cost EduBridge?" (Researched September 2026; prices below
were checked against vendor pages and 2026 pricing guides.)

## The honest headline

EduBridge is **one school**, not a startup. A few hundred students and parents
who check homework a few times a day is *tiny* by web standards. The pricing
scares that go viral ("my Vercel bill was $500") happen to apps with millions
of visits or runaway loops — not to a school portal. The realistic bill for
EduBridge is **$0/month now, and at most $25/month if we ever want zero
pause-risk on the database**.

## Phase 0 — today, before any backend exists

The whole app is statically prerendered (18/18 routes, no server work per
visit), so it can be hosted for free anywhere that serves static sites:

- **Cloudflare Pages** — free, unlimited bandwidth, global CDN. Needs a
  one-time adapter config for Next.js.
- **GitHub Pages** — free, static export only, no server routes ever.

At this stage **Supabase/Vercel cost concerns don't exist yet** — there is no
backend to bill.

## Phase 1 — when real sign-in and data arrive

The default plan (already written into the roadmap) is Vercel (or Netlify) for
the app + Supabase for the database and sign-in:

| Piece | Free tier (checked Sep 2026) | When it would cost money |
| --- | --- | --- |
| Vercel Hobby | $0 · 100 GB bandwidth · 1M function invocations/mo | **Non-commercial personal use only** (fair-use clause); over limits → Pro $20/user/mo |
| Netlify Free | $0 · 100 GB bandwidth · 125k function calls/mo | Pro $19/user/mo |
| Supabase Free | $0 · 500 MB database · 1 GB file storage · 5 GB egress · 50k monthly active users | Pauses after 1 week of inactivity; 2-project limit. Pro $25/mo removes pausing |
| Cloudflare Pages + Workers | $0 · unlimited bandwidth | Full Next.js needs the Workers adapter (extra config, some edge cases) |
| Railway / Render | ~$5/mo for a small always-on server + Postgres | Simple mental model, no pause risk, but you run the server |
| Neon (Postgres) | $0 · autosuspends on idle | Suspension is fine for our read-heavy pattern |

### The three real risks in the free tiers — and the fixes

1. **Vercel Hobby's non-commercial clause.** A free school project made by a
   student is not commercial, so Hobby is defensible — but if the school
   adopts EduBridge officially, the clean move is transferring the project to
   the school as an organization (Pro $20/mo) or to Cloudflare. Don't hide
   from this clause; plan for it.
2. **Supabase's 1-week inactivity pause.** During a long school holiday with
   zero logins, the free database sleeps. Fixes: a scheduled weekly read
   keeps it warm, or accept that holiday-week first-loads wake it up (a few
   seconds), or Pro at $25/mo.
3. **Gallery photos filling the 1 GB file storage.** Next/image already
   compresses to WebP; at ~150 KB per optimized photo that's thousands of
   photos before it matters. If the school wants full-resolution originals
   online, that's the day Storage becomes a paid line item.

## What "costly fast" would actually look like

The horror stories come from three things EduBridge doesn't have:
server-rendering every page on every visit (our pages are static),
un-optimized images (next/image since the speed pass), and viral traffic.
A school of ~1,000 users checking homework twice a day uses maybe a few GB of
bandwidth a month — 2–3% of the free allowance.

## Decision rules (write these down so we don't re-litigate)

- Start free. **Cloudflare Pages or Vercel Hobby for the app; Supabase Free
  for data.** Total: $0.
- First payment, if any, is **Supabase Pro $25/mo** — bought only when a
  real person is annoyed by a real pause, not preemptively.
- If the school officially adopts the app: move hosting into the school's
  account (Pro/organization) so a teacher, not a student, owns the bill and
  the data.
- Re-check this table the week before the pilot — pricing pages drift.
