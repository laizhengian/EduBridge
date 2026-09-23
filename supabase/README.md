# The EduBridge vault (Supabase)

The database is the single source of truth for every app surface — family app,
teacher tools, and the later admin surface. Schema and rules live as SQL in
this folder, reviewed in git like code. Full design rationale:
[docs/backend-plan.md](../docs/backend-plan.md); the security model:
[docs/security-plan.md](../docs/security-plan.md).

## What's here

| File | Purpose |
| --- | --- |
| `migrations/0001_init.sql` | Full schema: classes, profiles, homework, four-state attendance, assessments + marks (one pipeline), events (with links), circulars (news), absence notes, read receipts, enrolments. Deny-by-default RLS on every table. |
| `migrations/tests/adversarial_rls_test.sql` | The security gate: 9 cross-class access attacks; every one must fail. Rollbacks, so it's safe to re-run. |

## Setup (about 10 minutes, no credit card)

1. Create a project at [supabase.com](https://supabase.com) (free tier — the
   limits vs a school's real usage are analyzed in docs/hosting.md).
2. Open **SQL Editor** → paste `migrations/0001_init.sql` → **Run**.
   (CLI alternative: `supabase db push` after linking the project.)
3. Run the tests: paste `migrations/tests/adversarial_rls_test.sql` → Run.
   You must see `ALL ADVERSARIAL TESTS PASSED (9/9)`. **Do not skip this** —
   it is the gate before any real user signs in (roadmap Stage 2).
4. Create the first staff users in **Authentication → Users** (invite by
   email), then set their `role` and `class_id` in the `profiles` table from
   the dashboard — **never** from the client (RLS blocks it; roles are
   server-managed by design).

## Connecting the app

Copy `web/.env.example` to `web/.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=…        # public anon key — guarded by RLS
SUPABASE_SERVICE_ROLE_KEY=…            # server-only, never exposed
```

`.env.local` is gitignored and the secrets gate (`npm run audit:secrets`)
fails the build if a key ever lands in tracked code. The anon key is
*designed* to be public — the row security is the lock, not the key.

## Converting the frontend (the seam is already cut)

The screens read through four functions in `web/lib/store.ts` and
`teacher-store.ts`. Swapping those function bodies for Supabase queries
converts every screen at once — no page changes:

| Mock function | Becomes |
| --- | --- |
| `getHomework()` | `supabase.from('homework').select('*').order('due_date')` |
| `toggleDone(id)` | read receipts row (`read_receipts` insert) |
| `addHomework(item)` | `supabase.from('homework').insert(…)` (teacher post → realtime to every open screen) |
| `attendance/marks` stores | the `attendance` / `marks` tables (four states already match) |

## Realtime (the "pop, pop, pop")

Subscribe to the homework table for the class; a teacher post appears on
every open screen without refresh. Push notifications stay digest-first
(one daily summary; instant only for absences/urgent) per the notification
rule in backend-plan.md — instant where you're looking, calm where you're not.
