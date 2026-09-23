# EduBridge — Roadmap

*The plan from here to a school-wide platform: what happens when, what gates it,
how all the apps stay connected, and what it will cost. Written to be shown to
teachers and school staff. Companion docs: [goals.md](goals.md) ·
[backend-plan.md](backend-plan.md) · [features.md](features.md) ·
[hosting.md](hosting.md) · [maintenance.md](maintenance.md).*

---

## Where we are today

- The **family app** (students + parents) is fully designed and working on
  sample data: Today, Homework, Timetable, Events, Circulars, the Hub (absence
  notes with photo attach, holidays), and a first-run welcome. Security headers,
  rate limiting, secrets auditing and the hardening playbook are live
  ([production-hardening.md](production-hardening.md)).
- The **evidence base is collected**: five teacher interviews
  (friction log §20) and the closed student survey (§21). They agree on the
  same core flaw — **everything costs too many taps and the portal sometimes
  loses what was entered** — and they name the first screens to build.
- What does **not** exist yet — by design, not accident: a real database, real
  sign-in, the teacher and admin apps.

---

## Stage 1 — The evidence base (done, September 2026)

*This stage was planned as "interview everyone first." It happened. The findings
now gate every later stage: no feature gets built unless it traces to a named
person's problem.*

What the teacher interviews said (full record in
[friction log §20](clobas-teardown/friction-log.md)):

1. **Input cost is the product's deepest flaw** — four of five teachers
   independently: attendance, marks and homework are typed or re-typed.
   Nisha: *"a template that automatically has all the info — I just post it."*
2. **The portal loses teacher data** — marks that don't save, attendance that
   won't load. Trust-killer #1.
3. **Marks are one pipeline, not two modules** — mid-terms are hand-calculated
   today; the system must compute them.
4. **"Late" is recorded as "absent"** — a data-correctness bug with real
   consequences for a child's record.
5. **Notification flood is real** — parents are getting too many.
6. The only "new feature" asks — ranking by marks, merit/demerit — are honest,
   and both are designed as opt-in, never a public leaderboard.

The admin interviews are still **pending** — Stage 5 keeps its planned shape
until they land, and nothing admin-side gets built before they do.

---

## Stage 2 — The real backend (start now)

The backend is one shared vault that **every** app reads and writes. Building it
now means the teacher app has data to post into on day one. Full schema, RLS
policies, caching and job design: [backend-plan.md](backend-plan.md).
**The migrations are written**: `supabase/migrations/0001_init.sql` (schema +
deny-by-default RLS) with the adversarial test suite in
`supabase/migrations/tests/` — setup steps in `supabase/README.md`.

- **Supabase** (Postgres): the five core tables first — profiles, classes,
  homework, attendance (four states), assessments + marks — plus circulars,
  absence notes and read receipts.
- **Sign-in:** school Google accounts, plus issued username/password for
  younger students.
- **Row-Level Security on every table** — deny-by-default; adversarial tests
  (a student account reading another student's rows must get zero rows) before
  any real user signs in.
- **The trust layer** behind every teacher write: autosave drafts, explicit
  server-confirmed "Saved", offline tolerance with honest labels — built
  *because* teachers lost marks to the old portal.
- **Hardening recipes pre-written:** RLS SQL, auth flow, caching, async job
  queue, secrets gate, load-test ladder —
  [production-hardening.md](production-hardening.md).

**Gate:** the adversarial security tests pass before any real user signs in.

**Legal, before Stage 3:** the in-app **Privacy & terms** page (plain language,
honest about what is stored) is reviewed against the school's own policies, and
a real contact route is named before the first parent account exists. The page
lives at `/privacy`.

---

## Stage 3 — Deploy the family app (first real users)

- Deploy on the $0 path first (see [hosting.md](hosting.md) for the exact
  tradeoffs), tied to the GitHub repo — every push updates the site.
- Pilot with **one class** and its teacher; measure the two numbers that matter:
  - % of the class opening the app each day
  - % of homework items ticked off before their due date

**Gate:** one class uses it daily for two weeks without Ian being a human
helpline.

---

## Stage 4 — Build the teacher app, from the interview findings

Same design language, same database, separate app. The first two screens are
decided by the evidence (§14–15 in [features.md](features.md)):

- **Tap-the-row attendance** ([features.md §14](features.md)) — roster opens
  all-present, tap to move a child through present → late → excused → absent,
  reason chips, autosave, explicit "Saved". A normal class is two taps total;
  a morning reminder if attendance isn't taken (Deborah's ask).
- **The marks grid** ([features.md §15](features.md)) — one table behind every
  assessment, autosave per cell, totals and mid-term aggregates computed by the
  database, never keyed in.
- **The 30-second post** — pick class, type, tap. Due-date chips (Today /
  Tomorrow / Pick date) instead of calendar forms.
- **Read receipts** — "seen by 18/24" on every announcement.
- **"Repeat last week"** — recurring homework in one tap.
- **Feedback triage** — staff reply to student feedback from one place
  (Akram's daily task).
- **Digest-first notifications** (Puvi's finding): one daily digest by default,
  instant only for absences and urgent circulars, per-category opt-outs.

**Gate:** a teacher posts real homework and takes attendance, unaided, each in
under 30 seconds, on their first try.

---

## Stage 5 — Build the admin app (pending its interviews)

*Admin interviews have not happened yet — the shape below is the plan, and it
stays a plan until the office staff have told us their week. No problem, no
feature.*

Expected shape:

- Circular composer with **per-family read receipts** and re-send reminders to
  those who haven't read
- Absence overview: who is away today, by class, with certificates attached
- Account and class management: issue passwords, link parents to children,
  move students between classes at year-end
- The one-page printable report card — possible *because* the marks pipeline
  computes everything (Stage 2); the layout is then a template problem

**Gate:** the office sends a circular and can see exactly which families haven't
read it, without touching WhatsApp.

---

## Stage 6 — Mobile apps

The website already behaves like an app on a phone. Native comes when a school
confirms it's wanted, using **Expo / React Native** — the same TypeScript code,
same design tokens, same shared vault, so it's skins on the same body, not a
rewrite. iOS + Android from one codebase; absence-note photos open the camera
natively; push notifications replace the evening-before reminder's last mile.
Decision criteria in [platform.md](platform.md).

---

## How all the apps stay in one place

One vault, three skins, zero syncing:

```
                    ┌──────────────────────┐
                    │   Supabase (vault)   │
                    │  one database, one   │
                    │  set of rules        │
                    └──────────┬───────────┘
              read/write under role rules  │
        ┌──────────────────┼──────────────────────┐
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│  Family app   │  │  Teacher app   │  │   Admin app   │
│ students +    │  │ posts, marks,  │  │ circulars,    │
│ parents       │  │ receipts       │  │ accounts      │
└───────────────┘  └────────────────┘  └───────────────┘
        web + mobile       web + mobile       web (desktop-first)
```

- **One database.** A teacher posts homework once; it appears for students
  instantly. Nothing is ever copied or synced.
- **One set of rules.** Row-Level Security lives in the vault, not in the apps —
  so nobody can "fix" access from inside an app.
- **One design system.** Shared tokens, fonts, and components across all three
  apps (already proven by the family app's code).
- **One repository, three folders.** `web/` (family), `teacher/`, `admin/` —
  shared packages for the design system and API types, so a post type defined
  once is correct everywhere.
- **One deployment pipeline.** Push to GitHub → all apps deploy together.

---

## What it will cost

Full pricing research with the numbers checked against vendor pages:
[hosting.md](hosting.md). The one-line version:

**Pilot ≈ $0/mo** (static hosting + Supabase free tier) → **school-wide
≈ $65–90/mo** at the ceiling, and the architecture — three apps, one vault —
means costs grow with *users*, never with *apps*. Operations and the
app-must-pay-for-itself plan: [maintenance.md](maintenance.md).

---

## Testing: how we make sure it works before students touch it

Each stage ends with a gate, and the whole platform passes **rigorous testing**
in layers (the automated security layer is specified in
[production-hardening.md](production-hardening.md)):

- **Automated:** every push runs typecheck, lint, the secrets gate, and the
  security tests (adversarial row-level-security probes: cross-class reads must
  fail)
- **Manual pilot scripts:** for each app, a written script a teacher or student
  can follow: "post homework, tick it, verify the parent view" — pass required
  before each stage's gate
- **The 8–60 rule on real people:** each release is used by an 8-year-old, a
  60-year-old and a teacher before it ships
- **Real-device check:** before the pilot, run the app on an actual iPhone
  (Safari + Add to Home Screen) and an Android phone, per the checklist in
  [platform.md](platform.md); Lighthouse mobile ≥ 90 on the deployed site
- **Load reality-check:** before school-wide launch, a scripted simulation of
  500 users refreshing at 7:00 AM (the real morning spike); the baseline rig
  and current numbers are in production-hardening.md
- **Rollback:** every deploy is reversible in one click, and nightly backups
  start with the Supabase Pro plan

---

## The one-page version

1. **Done:** five teacher interviews + the student survey. Findings recorded;
   the first teacher screens are decided by them.
2. **Now:** build the shared vault (Supabase) with the RLS rules and the trust
   layer; pass adversarial tests.
3. **Then:** deploy the family app to one pilot class.
4. **Then:** teacher app — attendance and the marks grid first (the evidence
   picked them), then the 30-second post and read receipts.
5. **Then:** admin app — after its interviews; circulars with read receipts,
   absence overview, printable report card.
6. **Mobile:** Expo shells over the same vault when a school confirms.
7. **Cost:** ~$0 pilot → **~$65–90/mo school-wide**. Three apps, one vault;
   costs scale with users, not apps.
