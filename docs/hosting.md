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

## Is Supabase really the right vault? (researched, September 2026)

**The worry: "hundreds of users, it must be instant, and Supabase sounds
expensive at scale."** Re-checked against vendor pages and 2026 comparisons.
The verdict: **yes for EduBridge — and the reasons are specific, not lazy.**

### The cost math at this school's size (checked figures)

| | Free tier (verified Sep 2026) | EduBridge's real use |
| --- | --- | --- |
| Supabase Free | 500 MB database · 50,000 monthly active users · 1 GB files · 5 GB egress · **200 peak concurrent connections** · 2M realtime messages/mo | ~1,000 users incl. parents ≈ **2% of the MAU allowance**; a school's text-and-marks database is a few MB; realtime messages (see below) are throttled by design, not by luck |
| Supabase Pro | $25/mo · 8 GB database · 100 GB files · 100k MAU · **$10/mo compute credit included** · no pause | The ceiling for years; the credit effectively makes small compute ~$0 up to its allowance |
| Firebase (the common alternative) | per-operation billing | 2026 comparisons put a 10k-DAU read-heavy app at **$50–150/mo vs Supabase's $25–50** — per-read billing punishes exactly our shape (everyone reads the same few pages many times a day) |

"Hundreds of users" is *nothing* in database terms — Supabase's own free tier
is built for apps 50× this size, and the concurrency limit (200 peak
connections) is reached only if every connection is held open, which our
caching design prevents (reads come from static/cache layers; the database
serves writes and personal data).

### The "pop, pop, pop" requirement — where Supabase actually wins

"Upload something, it appears on everyone's screen instantly" is **Postgres
Realtime** (change data capture → websocket broadcast): a teacher posts, and
every subscribed student's screen updates without refresh. This is native to
Supabase. The honest caveat: EduBridge **deliberately throttles it** — the
notification-flood finding (Puvi, friction log §20) means we use realtime for
*in-app* freshness (the screen updates while you're looking at it) and
**digests** for pushes (one daily summary, instant only for absences/urgent).
Instant where you're looking, calm where you're not.

### The alternatives, honestly considered

| Option | Why not (for this project) |
| --- | --- |
| **Firebase / Firestore** | Per-operation pricing punishes read-heavy school apps (3–5× cost in comparisons); NoSQL makes the marks pipeline (computed views, ranks, cross-table rules) awkward; vendor lock-in is real. Supabase's RLS also maps 1:1 to the security plan; Firestore rules are a different dialect to re-learn |
| **PocketBase** | Delightful and nearly free (one VPS ~$5/mo), but single-binary = single point of failure, no managed backups, and realtime/auth/RLS would be hand-rolled — rebuilding the managed parts is how one-person projects die at exam week |
| **Appwrite (self-hosted)** | Same story: more control, more servers to babysit; Appwrite Cloud exists but its free tier is smaller and the ecosystem for Next.js + realtime is younger |
| **Convex** | Excellent DX and truly instant sync, but another proprietary runtime + pricing model to learn; the schema and SQL knowledge in this repo would be thrown away |
| **Neon / Railway + hand-rolled API** | Cheaper at large scale, but we'd build auth, storage, realtime and row-security ourselves — months of undifferentiated work against a school deadline |
| **Supabase self-hosted** | The escape hatch, on record: it's open source Postgres. If pricing ever turns hostile, the data and schema leave intact — no lock-in exists |

The two-decision summary: **(1) a relational database is non-negotiable** —
marks, ranks, enrolment and attendance are relational by nature, and the
report card is a SQL view; **(2) managed beats cheap** — the maintainer model
(maintenance.md) requires a backend that patches itself, backs itself up, and
pages nobody at 2 a.m. Supabase is the only option that is both. When the
school formally adopts EduBridge, the account moves into the school's name —
the costs above are then the school's infrastructure line, not a student's
card.
