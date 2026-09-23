# Maintenance — keeping EduBridge alive without burning out its maker

**Question this doc answers:** "Who fixes, updates and pays for this thing after
launch — and how does it stay one person's side project instead of a second
job?" Written September 2026.

## The rule that keeps maintenance sane

**The data maintains the app; the app doesn't maintain data.** Almost nothing in
EduBridge needs a human to keep it current: teachers post homework and take
attendance, the office publishes circulars, and the timetable/report cards
compute from those writes. If a screen needs Ian to update it for the app to be
true, that screen is designed wrong. (The one honest exception so far: the
School life photos and videos, which are school marketing content — the school
should own those, not the developer.)

## The monthly checklist (~1 hour)

| When | What | How |
| --- | --- | --- |
| Every push | Nothing breaks in ways CI can't see | Typecheck + secrets gate + adversarial security tests run automatically ([production-hardening.md](production-hardening.md)) |
| Weekly, 2 min | Open the app as a student would | Today → Homework → one circular. If it's slow or lying, fix it the same week |
| Monthly, ~30 min | Platform bills & limits dashboard | Supabase usage (MAU, DB size, storage), hosting bandwidth — all free-tier dashboards; the alert is *looking once a month* |
| Monthly, ~15 min | Dependency updates | `npm outdated`; update minors, read advisories. One controlled update pass, never daily churn |
| Each term | Backups & restore drill | Download a Supabase backup, actually restore it somewhere, confirm. An untested backup is a rumor |
| Each term | Review the friction log | New complaints go in `clobas-teardown/friction-log.md` the same week they're heard — the log is the roadmap's source |

**Escalation reality:** when the school officially adopts EduBridge, the
maintenance agreement is explicit and small — a monthly fee (below) covering
the checklist above plus bug fixes within one school week. Written down, so
nobody is doing unpaid 2 a.m. support for 1,000 people.

## What the app must pay for, and what it costs

### The floor (pilot, one class): ~$0/month

- Hosting: free static tier (see [hosting.md](hosting.md) for the exact vendors)
- Database: Supabase free tier (50k MAU vs a pilot's ~30)
- Domain: ~$1/month amortized

At the floor, "maintenance cost" is literally the hour a month above.

### School-wide: ~$65–90/month at the ceiling

Supabase Pro $25 (backups, no pause) + hosting $20–60 + domain. Priced in full
in [roadmap.md](roadmap.md) → What it will cost.

### Who pays

- **While it's Ian's project:** Ian, out of pocket — it's a rounding error.
- **When a school adopts it:** the school, as a small monthly licence. The
  honest pitch: the old portal's licence already costs the school money *and*
  wastes ~30 teacher-minutes a day to input friction (five interviews say so).
  At even RM500/month, EduBridge costs less than the time it returns in one
  morning.
- **Never:** students or parents. It is school infrastructure, like the bell.

## The update pipeline (so "update the app" is boring)

1. Changes land as commits on `main` — every push deploys automatically; every
   deploy is one-click reversible.
2. Anything risky (schema changes, new auth flows) goes behind the stage gates
   in [roadmap.md](roadmap.md) — adversarial tests before real users, pilot
   class before school-wide.
3. The student survey runs **every term**, five questions, same as this first
   one. The friction log compares terms; drift ("it got slow again") shows up
   in the data, not in vibes.
4. Release notes live in the changelog, and the family app's Hub shows a
   one-line "What's new" on meaningful updates — because a silent update is
   how users learn distrust.

## When Ian is unavailable (the bus factor)

- **The repo is the documentation.** Every decision lives in `docs/`, every
  doc answers the question it was written for. A competent developer (or AI
  agent) can pick up the codebase from `README.md` → `docs/` alone — that is a
  design requirement, not luck.
- **The vault is standard.** Supabase is plain Postgres; the data can leave.
  No proprietary lock-in exists anywhere in the stack.
- **The school's exit is real.** If the project ever stops, the school gets the
  repo, the database, and the docs. Software that can be handed over is
  software that can be trusted with children's data.

## The things that quietly kill school software (and the guard)

| Killer | The guard |
| --- | --- |
| Scope creep — "just add one more module" | features.md's filter: name the person and the problem, or it's not built |
| The demo rot — looks great, dies in week 3 | The two pilot metrics (opens/day, homework ticked before due) are the truth, reviewed weekly |
| The single-maintainer cliff | This doc, the repo-as-manual rule, and the explicit school agreement |
| Cost surprise | The monthly bill glance; hosting.md's ceiling math already done |
| Trust rot — one data-loss incident | The trust layer (autosave, explicit "Saved") and the termly restore drill |
