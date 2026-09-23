# Backend plan — build order, schema, and the rules data must follow

**Question this doc answers:** "The interviews are in — what exactly do we build
for the backend, and in what order?" Written September 2026, after the teacher
interviews (friction log §20). Every table and rule below traces to a named
person's problem. Companion docs: [production-hardening.md](production-hardening.md)
(the security recipes) · [hosting.md](hosting.md) (the costs) · [roadmap.md](roadmap.md).

## The one rule the interviews set

> "A template that automatically has all the info — I just post it." — Nisha
> "Just go: demerit this, demerit that." — Akram

The backend's job is to make **every write either one tap or already filled
in**. That single sentence shaped everything below: derived fields are computed
by the system, never typed by a teacher; drafts save themselves; and the server
confirms every save, because Nisha lost marks and Deborah lost attendance to a
portal that swallowed writes.

## Phase B1 — the core vault (build first)

Five tables, nothing more. Every extra module is a Clobas trap (breadth over depth).

```sql
-- 1. People and roles. Roles live in auth users' app_metadata (server-writable),
--    never in a client-editable column. One row per student/parent/teacher.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('student','parent','teacher','admin')),
  class_id uuid references classes(id),          -- students + their class teachers
  created_at timestamptz not null default now()
);

-- 2. Classes. Join codes for students; teachers link via class_teachers.
create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,                            -- e.g. "Class 9A"
  join_code text not null unique,
  academic_year int not null
);

-- 3. Homework. One row per post. Defaults do the work: the teacher picks
--    class + subject, everything else has a pre-chosen answer.
create table homework (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id),
  subject text not null,
  title text not null,
  details text,
  due_date date not null,
  posted_by uuid not null references profiles(id),
  posted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. The four-state attendance log. Four states because "late" recorded as
--    "absent" is a live bug in the old portal (Annie, friction log §20).
create table attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  class_id uuid not null references classes(id),
  day date not null,
  state text not null check (state in ('present','late','excused','absent')),
  note text,                                     -- why, for excused/late
  recorded_by uuid not null references profiles(id),
  unique (student_id, day)                       -- one truth per child per day
);

-- 5. Assessment items and marks — ONE pipeline (Puvi: homework and marks are
--    the same thing in STEM; Annie: mid-terms must not be hand-calculated).
--    A "mark" attaches to any assessment; report aggregates are VIEWS, computed
--    by the database, never typed by anyone.
create table assessments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id),
  subject text not null,
  title text not null,          -- "Homework 4", "Mid-term", "Quiz"
  kind text not null check (kind in ('homework','test','exam','continuous')),
  max_mark numeric not null,
  weight numeric not null default 1,
  due_date date,
  created_by uuid not null references profiles(id)
);
create table marks (
  assessment_id uuid not null references assessments(id),
  student_id uuid not null references profiles(id),
  mark numeric,                                  -- null = not yet entered
  entered_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  primary key (assessment_id, student_id)
);
-- The report card's numbers are views over these two tables:
create view assessment_totals as
  select student_id, class_id, subject,
         sum(mark * weight) / nullif(sum(max_mark * weight), 0) * 100 as percent,
         rank() over (partition by class_id, subject order by
                      sum(mark * weight) / nullif(sum(max_mark * weight), 0) desc) as position
  from assessments a join marks m using (assessment_id)
  group by student_id, class_id, subject;
```

Plus two tables the app already promises: `circulars` (poster, body, urgency)
and `absence_notes` (student, days, reason, certificate photo path, status —
the office queue). `read_receipts(post_id, user_id, seen_at)` completes the
teacher-app promise of "seen by 18/24".

### The rules data must follow (Row-Level Security)

Deny-by-default on every table — full SQL in [production-hardening.md](production-hardening.md).
The shape:

| Table | Student/parent | Teacher | Admin |
| --- | --- | --- | --- |
| homework | read own class | write own classes | all |
| attendance | read own (parent: own child) | write own classes | all |
| marks | read own | write own classes | all |
| assessment_totals (ranks) | read own only | read own classes | all |
| profiles | read self + own teachers' names | read own classes | all |

Ranks are **never** exposed class-wide unless the school opts in per exam —
Annie's ask is legitimate, but a rank table shown to every child is a
leaderboard, and that's on the not-building list for the student app.

## Phase B2 — the trust layer (the lesson from Nisha and Deborah)

1. **Autosave drafts.** The marks grid and attendance roster save drafts
   (debounced, ~1s) before the teacher commits. A dropped connection never
   means re-entering — the draft is in IndexedDB and re-uploads.
2. **Explicit saved state.** Every write shows the round-trip: "Saved 14:02"
   comes from the server's confirmation, not from the button going grey.
3. **Offline tolerance, honest labels.** On flaky school Wi-Fi, reads come from
   the cache with a visible "last updated" stamp (already the documented
   pattern); writes queue and confirm when the network returns.

## Phase B3 — the job queue (nothing slow blocks a tap)

Emails (digests), notification fan-out, any future PDF parsing and AI-free
report generation run as queued jobs (pg-boss on the same Postgres) — the
teacher's tap returns the moment the write is durable. Recipes already written
in production-hardening.md.

## The notification rule (Puvi's parents)

Digest-first, categories, opt-out:

- **Default: one daily digest** at a set hour — new homework, marks posted,
  circulars.
- **Instant only for**: absences recorded same-day, and urgent circulars.
- Every category individually opt-out-able; never one push per homework item.

## Build order and the gate

1. **B1 tables + RLS + adversarial tests** (student A reading student B must
   get zero rows, per table per role) — *gate: tests pass before any real user*.
2. **B2 trust layer** behind the marks grid and attendance roster — the
   teacher-app screens in [features.md](features.md) §14–15 are the first real
   clients, which is exactly the order the interviews demand: the people who
   suffer the most get the first build.
3. **B3 queue** when the first digest or email exists.

## What we deliberately do NOT build

- A second attendance system for extracurriculars (one `attendance` model, an
  `activity` column when needed — never two systems; that's §15 of the old
  portal's disease).
- Client-computed report cards (they *will* disagree with the database).
- An admin "marks approval workflow" — the interview data shows the problem is
  entry cost, not approval theatre.
- Excel import (deferred: with a one-grid + autosave entry and auto-aggregation,
  the pressure that made Annie ask for import mostly disappears; revisit only
  if teachers still import after a term).
