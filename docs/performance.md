# Performance plan — fast now, faster later

**Question this doc answers:** "Is the app optimized for speed?" It separates
what is **already done** from what is **deliberately staged** until the
backend exists (backend work was explicitly deferred by the product owner).

## Already done (September 19, 2026)

**Rendering**
- Every page is a **statically prerendered server component** — the HTML is
  built once, served from CDN cache, zero server work per visit. Only the
  small interactive parts (Shell nav, sign-in form, absence form, homework
  interactions) ship JavaScript. Verify with `npm run build`: every route
  should show as static.
- **No client-side data fetching anywhere.** Mock data is embedded in the
  server HTML, so there are no spinners, no request waterfalls, no
  layout shift from late data.

**Images (the real payload on a phone)**
- All gallery/competition images now go through the built-in **next/image**
  optimizer: AVIF/WebP (typically 30–50% smaller than JPEG), served at the
  size the device actually needs (a phone downloads a thumbnail, not a
  2000px file), lazy-loaded below the fold, long-lived cache.
- Config: `images.remotePatterns` locked to `images.unsplash.com` — the
  optimizer cannot be pointed at arbitrary URLs.

**Fonts**
- Both typefaces are self-hosted at build time via `next/font` — no
  render-blocking request to Google Fonts on first load, and automatic
  fallback metrics so text doesn't jump while fonts load.

**iOS responsiveness**
- `touch-action: manipulation` removes the legacy 300ms tap delay in Safari;
  16px form fields prevent iOS focus zoom (see `docs/platform.md`).

## Deliberately staged (do not build before the backend exists)

| Technique | Why it waits | What to do when the DB lands |
| --- | --- | --- |
| Database indexes | No database yet — indexing nothing is meaningless | Index every foreign key; composite indexes on `(student_id, date)` for attendance and `(student_id, exam_id)` for results; index `starts_at` on events and `due_at` on homework |
| Database search | No searchable corpus yet (mock data is a fixed list) | Postgres full-text or `pg_trgm` on circulars/news titles; always paginate (`limit/offset` or keyset) before results reach the client |
| Server caching / ISR | Data never changes today | Tag-based revalidation: announcements and homework revalidate on publish; timetable revalidates on term change |
| Service worker / offline | Caching stale timetables breaks trust — the exact failure of the old portal | Design alongside the sync strategy; cache shell + last-known data with a visible "as of" stamp |
| Connection pooling / query tuning | No connections exist | Supabase pooled connection (port 6543) for serverless; select only needed columns |

**Rule:** optimize against the real database and real usage data, not before.
Front-end speed work without a backend is done; the next performance work
happens the week the first real table is queried.

## How to check

1. `npm run build` — every route must report as static; watch the route
   size table (target: first-load JS under ~100 KB per route, no route
   growing after "boring" changes).
2. After HTTPS deploy (Vercel), run Lighthouse mobile on `/` and `/homework`:
   target ≥ 90 across the board. Dev-mode scores are meaningless.
3. A iPhone test per `docs/platform.md` before the pilot (also tracked in
   `docs/roadmap.md` → pre-launch gates).
