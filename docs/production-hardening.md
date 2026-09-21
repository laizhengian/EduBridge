# Production hardening — hack-proof, lawsuit-proof, load-proof

**Question this doc answers:** "This app will be used by hundreds of people. How do we
make sure it doesn't get hacked, doesn't get the school sued, and doesn't fall apart
when everyone opens it at once?"

It turns those five worries into concrete, checked work. Two kinds live here:

- **Built now** (this pass, against the current mock-data app) — infrastructure that
  is real code today and carries straight into the backend.
- **Gated on the backend** — the exact recipes, written down now so nothing is
  improvised under pressure. Nothing here is skipped; it's scheduled.

Companion docs: [security-plan.md](security-plan.md) (data rules),
[performance.md](performance.md) (front-end speed), [hosting.md](hosting.md) (costs).

---

## 1. Rate limiting — BUILT

**Threat:** one scripted user (or one runaway device loop) hammering writes —
hundreds of requests per second — starving everyone else.

**What's live:** `web/proxy.ts` (Next.js 16's replacement for middleware — same
pipeline, new name) rate-limits every mutating request (POST/PUT/PATCH/DELETE) by IP:
**30 writes / minute / IP**, then **HTTP 429** with a `Retry-After` header and a
plain-language message.

Design decisions worth remembering:

- **Why per-IP and not per-user:** hundreds of students share a handful of school
  NAT IPs. Per-user limits come with the auth ticket (below). The IP limit blunts
  scripted abuse and runaway loops — it is a floodgate, not a policy.
- **Why 30/min:** generous enough that a whole classroom NATing through one IP
  submitting absence notes never trips it; tight enough that a script sending 300
  requests/second gets shut out in under a second.
- **Why only mutating verbs:** on the static host, page views are served from the CDN
  *before* this code runs — throttling GETs would only tax real navigation.
- **The store is in-memory, per process, and resets on deploy** — correct for a
  single-instance app. `web/lib/rate-limit.ts` documents the swap to Upstash Redis
  (same function signature) the day a second instance or a queue worker exists.
  Free Upstash tier covers a school.
- **Writes fail loudly:** any mutating request that reaches the app gets **501** — no
  endpoint may fake success. Endpoints must be *built*, never assumed.

**Verified:** 31 rapid POSTs from one IP → 30×501 then 429 with `Retry-After`;
documented in the verification note at the end of this file.

---

## 2. Locking the database down — RLS recipes (gated on Supabase)

Row-Level Security is the deny-by-default engine from [security-plan.md](security-plan.md):
the *database itself* refuses rows a user may not see, even if application code has a
bug. The recipes below are written as real SQL now, so backend week is assembly, not
design.

**Ground rules for every table:**

1. **Enable RLS before the first row exists.** `ALTER TABLE ... ENABLE ROW LEVEL
   SECURITY` runs in the same migration that creates the table — never "later".
2. **Deny by default:** with RLS on and no policy matching, every operation is
   refused. Write policies only for what each role genuinely needs.
3. **Never expose the `service_role` key to any client.** It bypasses RLS entirely.
   It lives only in server-side jobs (email, digests). The browser gets the `anon`
   key only. The secrets audit (`npm run audit:secrets`) fails the build if a
   Supabase JWT ever lands in tracked source.
4. **One helper, every policy:** a single `auth_role()` SQL function decides who is
   what, so policies can't drift apart.

```sql
-- ─── Identity helpers ────────────────────────────────────────────────────
create or replace function public.auth_role() returns text
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata' ->> 'role', 'anon');
$$;

create or replace function public.is_teacher_of(class_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from class_teachers ct
    where ct.class_id = is_teacher_of.class_id
      and ct.teacher_id = auth.uid()
  );
$$;

-- ─── Example: homework ───────────────────────────────────────────────────
alter table homework enable row level security;

create policy "read: own class" on homework for select using (
  class_id = (select class_id from students where id = auth.uid())
  or is_teacher_of(class_id)
  or public.auth_role() = 'admin'
);

create policy "write: teachers of the class" on homework for insert with check (
  is_teacher_of(class_id)
);

create policy "tick: students tick their own" on homework_completions for insert with check (
  student_id = auth.uid()
);
```

**The same pattern, stated in English, for the sensitive tables:**

| Table | Students | Parents | Teachers | Admin |
|---|---|---|---| migration |
| `homework` / `timetable` / `circulars` | read own class | read linked child's class | read/write own classes | all |
| `homework_completions` | write **own** | — | read own classes | all |
| `absence_notes` (incl. medical photos) | read/write **own** | read/write own child's | read own classes | all |
| `feedback` | create; read own | create | read all (office) | all |

**Test it like an attacker (backend gate):** for every table, run the
"wrong-person query" as each role — student A asking for student B's rows, a parent
for someone else's child, a student posting homework — and require **zero rows /
explicit refusal** in the test suite. RLS that was never attacked in a test is a
hope, not a control.

---

## 3. Real authentication — vendor decision (gated on backend)

**Requirement recap:** school-issued accounts, school-domain Google sign-in, roles
assigned by admins, per-user rate limits, and no credentials in the browser's reach.

**Decision: Supabase Auth.** Same vendor as the database, so RLS policies and auth
claims speak the same language (`auth.uid()` inside the policies above), the free
tier covers a school (see [hosting.md](hosting.md)), and issued-username accounts are
first-class (email+password rows the school provisions). Clerk and Firebase Auth both
work — Firebase would mean two systems to reason about, Clerk is excellent but its
free tier is 10k MAU we don't need and adds a vendor for no RLS tie-in. Recorded as
the tradeoff table in [hosting.md](hosting.md).

**Concrete shape when it lands:**

- Sign-in: Google restricted to `@oakbridge.edu.my` + issued username/password for
  younger students (bcrypt cost ≥ 12 handled by the vendor).
- Sessions: **httpOnly, Secure, SameSite=Lax cookies only** — never localStorage.
  `@supabase/ssr` handles the cookie flow server-side.
- Roles: stored in `app_metadata` (server-writable only — users can't self-promote
  by editing their JWT), assigned by an admin screen, read by the `auth_role()`
  helper above.
- **Per-user rate limits** join the IP gate in `proxy.ts`: read the session cookie,
  look up the user, apply tighter mutating limits (e.g. 10/min) — same limiter, one
  more key dimension.
- Login lockout: 5 failed attempts → 15-minute lockout (auth plan, Phase B).

---

## 4. Caching — what already exists, what comes with data

**Already true today (no action needed):** every page is **statically prerendered**
— HTML is built once and served from the CDN edge. The most frequent request ("open
the app, read homework") is never recomputed per user *at all* — there is no compute
in the request path. That is the strongest cache there is, and it's why the current
mock-data app is free to run (hosting.md).

**When real data lands, the rule is: cache per *content*, never per *user*.**
The design already leans this way — the Higgs-Law screens (today's timetable, to-do
homework, this week's events) are the same for everyone in a class:

| Content | Shared by | Strategy |
|---|---|---|
| Timetable, homework list, circulars | whole class | `unstable_cache`/`revalidateTag` keyed by `class` + term; revalidate on teacher post |
| "My done-ticks" | one student | stays in the client store — nothing to cache |
| Absence notes / feedback | one person + office | **never cached** — always fetch fresh with the session |
| Images | everyone | already `next/image` (AVIF/WebP, sized, lazy) |

- Revalidation is **event-driven** (teacher posts → `revalidateTag('homework:8B')`),
  not time-based guesses, so no one ever sees stale homework — the staleness
  complaint from the friction log must not be re-invented here.
- Per-user rates: personalized shards are cheap to compute (one indexed query); the
  cache is for the shared, heavy reads.

**Indexes to create with the tables (backend gate):** `homework(class_id, due_date)`,
`timetable(class_id, weekday)`, `absence_notes(student_id, date)`,
`completions(student_id, homework_id)` (unique — doubles as a double-submit guard),
`feedback(created_at desc)` for the office queue. One composite index per screen's
actual query — added in the same migration as the table, never "later".

---

## 5. Async jobs — the recipe (gated on backend)

**Principle:** the request thread never waits on slow work. Everything slow — email,
AI, PDF parsing, bulk notifications — becomes a **queued job** the request only
*enqueues* (a few ms), and workers drain the queue with retries.

**Vendor choice: Supabase + pg-boss** (Postgres-backed queue, no new vendor, free
tier same as the DB). QStash or Upstash QStash is the alternative if email volume
grows past pg-boss's sweet spot. Recorded in hosting.md.

| Job | Trigger | Notes |
|---|---|---|
| Send absence-note email to teacher | note submitted | enqueue → 202 immediately → user sees "sent" |
| Daily homework digest (optional, later) | cron 17:00 | one job per class, batched email |
| AI anything (summary of circular, etc.) | request | 30s timeout, retry ×2 with backoff, result cached |
| PDF parse of circulars | admin uploads | worker, not request thread; timeout 60s |
| Photo processing (medical certs) | upload | private bucket + signed URLs per security-plan.md |

**Implementation notes:** jobs table lives in the same Postgres (RLS applies —
students can only *see their own* job status); retries with exponential backoff ×3;
dead-letter after 3 failures + admin alert. **Never** on Vercel Hobby: long-running
request handlers; 10s function cap on Hobby — jobs run in a worker, not the request.

---

## 6. Secrets — never in the front end (BUILT: automated gate)

**Rule:** anything ending in `_KEY`/`_SECRET`/`_TOKEN` is server-side only. The
browser receives the Supabase `anon` key (designed to be public, protected by RLS)
and **nothing else**. `NEXT_PUBLIC_*` is a promise that the value ships to every
visitor — treat it as radioactive for credentials.

**Built now: `npm run audit:secrets`** (`web/scripts/audit-secrets.mjs`):
scans every git-tracked file for credential shapes — private-key blocks, Supabase
JWTs, assigned `secret`/`token`/`password` values, bearer headers, Slack/Google/
Stripe/SendGrid key shapes — and **fails the run if any appears**, listing file and
rule. Placeholders (`your-api-key-here`), `process.env` references and docs are
ignored, so it stays signal, not noise. Run it in CI and before every deploy; wire
into the pre-deploy step of the runbook. Detector verified against a real-shaped
secret in testing (fires), placeholder and `process.env` refs (ignored).

**Also true:** `.env*` is gitignored; `.env.example` documents every key with
placeholder values only; rotation drill is Phase B (security-plan.md) — confirm any
key can be swapped via the platform secret manager without a code change.

---

## 7. Load testing — BUILT: the baseline rig

`npm run loadtest` (autocannon, 10s per scenario, against a local server):

- **home** — 100 concurrent connections on the front door: the "everyone opens the
  app at 7:30am" moment.
- **writes** — 50 connections of POSTs through the proxy gate: the gate must answer
  every request (200s of 429/501 count as *answered*), never hang.

**Pass bars (local):** home p99 < 300 ms, zero socket errors both scenarios.
Dev-server runs are noisy (on-demand compilation dominates), so the baseline is
always measured against a **production build** (`next build && next start`).

**The production ladder (backend pass):** stage 1 = 1× expected peak (whole school
at once ≈ few hundred concurrent); stage 2 = 5×; stage 3 = 10×, holding p99 < 1 s.
Record each stage's numbers in this file. A test that isn't re-run against
production is a rehearsal, not a gate — re-run in CI against the deployed preview
after the backend lands.

---

## 8. Lawsuit-proofing (already standing, restated)

The legal exposure of a school app is children's data. Already built and documented in
[security-plan.md](security-plan.md) and the in-app Privacy & terms page (`/privacy`)
— the hard edges:

- minimum collection (no birth dates, no phone numbers, no photos of children),
- parents see their own child only (RLS enforces),
- medical-cert photos: private bucket, expiring signed URLs, term expiry,
- no ads/trackers/analytics selling data — ever,
- privacy policy + terms live in the app (`/privacy`),
- data deletion path (a student leaving can be fully removed) — Phase C gate.

Nothing in this hardening pass changes those; the rate limiter and validation add
abuse-resistance to the same surfaces.

---

## Verification note (this pass — measured numbers)

- Production build clean (19/19 routes static + proxy layer); typecheck clean.
- **Rate limit:** 31 rapid POSTs from one IP → 30× `501`, then **`429`** with
  `Retry-After` and all security headers intact; page GETs untouched throughout.
- **`audit:secrets`:** clean — 47 tracked files scanned; detector verified against a
  real-shaped secret (fires) and placeholders / `process.env` refs (ignored).
- **Load test, production build, local machine:**

  | Scenario | Throughput | p50 | p99 | Errors |
  |---|---|---|---|---|
  | home — 100 concurrent | **1,358 req/s** | 71 ms | 131 ms | 0 (14,933 requests) |
  | writes through the gate — 50 concurrent | **2,024 req/s** | 24 ms | 43 ms | 0 (22,264 answered) |

  Read that against the actual load: a school-wide simultaneous open is a few
  hundred requests in the first seconds — three orders of magnitude below what the
  static front door absorbs on one laptop. Re-run this after deploy and again when
  the first database-backed screen ships (ladder above).
