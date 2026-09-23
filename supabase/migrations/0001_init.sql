-- EduBridge vault — initial schema
-- From docs/backend-plan.md (derived from the teacher interviews + student
-- survey). Apply via the Supabase dashboard SQL editor, or `supabase db push`.
--
-- Design rules this file enforces:
--   * Deny-by-default: RLS is ON for every table; no policy means no access.
--   * Roles live in profiles.role AND are only ever written server-side
--     (clients may update their own display_name — nothing else).
--   * Four attendance states from day one — "late" is never recorded as
--     "absent" (Annie, friction log §20).
--   * One marks pipeline: assessments + marks; report numbers are VIEWS,
--     computed by the database, never typed by a teacher (Puvi, §20).
--   * Averages compute over graded items in enrolled subjects only, and the
--     results view states that basis (student survey §22).
--   * Events carry links (jsonb) — school letters read in place (survey §22).

-- ── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Classes ───────────────────────────────────────────────────────────────
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,                          -- "Class 8B"
  join_code text not null unique,              -- short code students join with
  academic_year int not null,
  created_at timestamptz not null default now()
);

-- ── Profiles (one per auth user) ──────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('student','parent','teacher','admin')),
  class_id uuid references classes(id),
  created_at timestamptz not null default now()
);

-- ── Homework ──────────────────────────────────────────────────────────────
create table if not exists homework (
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

-- ── Attendance: four states, one truth per child per day ──────────────────
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  class_id uuid not null references classes(id),
  day date not null,
  state text not null check (state in ('present','late','excused','absent')),
  note text,
  recorded_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  unique (student_id, day)
);

-- ── Assessments + marks: ONE pipeline from quiz to report card ────────────
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id),
  subject text not null,
  title text not null,          -- "Homework 4", "Mid-term", "Quiz"
  kind text not null check (kind in ('homework','test','exam','continuous')),
  max_mark numeric not null,
  weight numeric not null default 1,
  due_date date,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists marks (
  assessment_id uuid not null references assessments(id) on delete cascade,
  student_id uuid not null references profiles(id),
  mark numeric,                                  -- null = not yet entered
  entered_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  primary key (assessment_id, student_id)
);

-- ── Events: real school letters, with links, read in place ────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  kind text not null check (kind in ('event','holiday','exam')),
  location text,
  details text,
  links jsonb not null default '[]',             -- [{label,url}, …]
  posted_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ── Circulars (News) ──────────────────────────────────────────────────────
create table if not exists circulars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  urgent boolean not null default false,
  posted_by uuid references profiles(id),
  posted_at timestamptz not null default now()
);

-- ── Absence notes (the office queue) ──────────────────────────────────────
create table if not exists absence_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  from_date date not null,
  to_date date not null,
  reason text not null,
  certificate_path text,                         -- storage path of the photo
  status text not null default 'submitted' check (status in ('submitted','seen','resolved')),
  created_at timestamptz not null default now()
);

-- ── Read receipts ("seen by 18/24") ───────────────────────────────────────
create table if not exists read_receipts (
  homework_id uuid not null references homework(id) on delete cascade,
  user_id uuid not null references profiles(id),
  seen_at timestamptz not null default now(),
  primary key (homework_id, user_id)
);

-- ── Enrolment (averages derive from this, never from "has a mark") ────────
create table if not exists enrolments (
  student_id uuid not null references profiles(id),
  class_id uuid not null references classes(id),
  subject text not null,
  primary key (student_id, class_id, subject)
);

-- ── Indexes for the screens that read constantly ──────────────────────────
create index if not exists homework_class_due_idx on homework (class_id, due_date);
create index if not exists attendance_student_day_idx on attendance (student_id, day desc);
create index if not exists marks_student_idx on marks (student_id);
create index if not exists circulars_posted_idx on circulars (posted_at desc);
create index if not exists events_starts_idx on events (starts_at);
create index if not exists profiles_class_idx on profiles (class_id);

-- ── Row-Level Security: deny-by-default on every table ────────────────────
alter table classes       enable row level security;
alter table profiles      enable row level security;
alter table homework      enable row level security;
alter table attendance    enable row level security;
alter table assessments   enable row level security;
alter table marks         enable row level security;
alter table events        enable row level security;
alter table circulars     enable row level security;
alter table absence_notes enable row level security;
alter table read_receipts enable row level security;
alter table enrolments    enable row level security;
alter table teacher_classes enable row level security;

-- teacher_classes: staff read their own assignments; admins manage.
create policy teacher_classes_read on teacher_classes for select
  using (teacher_id = auth.uid() or auth_role() in ('teacher','admin'));
create policy teacher_classes_admin_write on teacher_classes for all
  using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- Helper: the caller's role, from their own profile row.
create or replace function auth_role() returns text
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

-- Teacher class assignments — the year-start personalization. A teacher's
-- account is assigned the classes they teach (by the office); when the year
-- rolls over, new rows here re-personalize every teacher's app. Nothing is
-- picked by the teacher at sign-in.
create table if not exists teacher_classes (
  teacher_id uuid not null references profiles(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  academic_year int not null,
  primary key (teacher_id, class_id, academic_year)
);

-- Helper: is the caller an assigned teacher (this year) of this class, or an admin?
create or replace function is_teacher_of(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from teacher_classes tc
    where tc.teacher_id = auth.uid()
      and tc.class_id = cid
      and tc.academic_year = (select date_part('year', now()))
  ) or auth_role() = 'admin'
$$;

-- Helper: a student's class (used by policies on tables that only know the
-- student, e.g. absence notes).
create or replace function class_id_of_student(sid uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select class_id from profiles where id = sid
$$;

-- classes: members and staff can read; admins manage.
create policy classes_read on classes for select
  using (auth_role() is not null);
create policy classes_admin_write on classes for all
  using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- profiles: read yourself, your teachers' names, and (if staff) your class;
-- write only your own display_name; roles are server-managed.
create policy profiles_read on profiles for select
  using (
    id = auth.uid()
    or auth_role() in ('teacher','admin')
    or (class_id in (select class_id from profiles p2 where p2.id = auth.uid()))
  );
create policy profiles_update_self on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- homework: class reads; teachers write their classes; admins all.
create policy homework_read on homework for select
  using (class_id in (select class_id from profiles p where p.id = auth.uid()));
create policy homework_teacher_write on homework for all
  using (is_teacher_of(class_id)) with check (is_teacher_of(class_id));

-- attendance: students/parents read own rows; teachers write their classes.
create policy attendance_read_own on attendance for select
  using (
    student_id = auth.uid()
    or is_teacher_of(class_id)
  );
create policy attendance_teacher_write on attendance for all
  using (is_teacher_of(class_id)) with check (is_teacher_of(class_id));

-- assessments: class reads; teachers of the class create.
create policy assessments_read on assessments for select
  using (class_id in (select class_id from profiles p where p.id = auth.uid()));
create policy assessments_teacher_write on assessments for all
  using (is_teacher_of(class_id)) with check (is_teacher_of(class_id));

-- marks: students read their own; teachers of the class write; admins all.
create policy marks_read_own on marks for select
  using (
    student_id = auth.uid()
    or exists (select 1 from assessments a where a.id = assessment_id and is_teacher_of(a.class_id))
  );
create policy marks_teacher_write on marks for all
  using (
    exists (select 1 from assessments a where a.id = assessment_id and is_teacher_of(a.class_id))
  ) with check (
    exists (select 1 from assessments a where a.id = assessment_id and is_teacher_of(a.class_id))
  );

-- events + circulars: all signed-in users read; staff write.
create policy events_read on events for select using (auth_role() is not null);
create policy events_staff_write on events for all
  using (auth_role() in ('teacher','admin')) with check (auth_role() in ('teacher','admin'));
create policy circulars_read on circulars for select using (auth_role() is not null);
create policy circulars_staff_write on circulars for all
  using (auth_role() in ('teacher','admin')) with check (auth_role() in ('teacher','admin'));

-- absence notes: the student/parent who sent it, staff of the class, admins.
create policy absence_read on absence_notes for select
  using (student_id = auth.uid() or is_teacher_of(class_id_of_student(student_id)));
create policy absence_student_write on absence_notes for insert
  with check (student_id = auth.uid());
create policy absence_staff_update on absence_notes for update
  using (is_teacher_of(class_id_of_student(student_id)));

-- read_receipts: your own receipt; teachers of the class read the tally.
create policy receipts_own on read_receipts for all
  using (
    user_id = auth.uid()
    or exists (
      select 1 from homework h
      where h.id = homework_id and is_teacher_of(h.class_id)
    )
  ) with check (user_id = auth.uid());

-- enrolments: read your own; staff and admins manage.
create policy enrolments_read on enrolments for select
  using (
    student_id = auth.uid()
    or auth_role() in ('teacher','admin')
  );
create policy enrolments_admin_write on enrolments for all
  using (auth_role() in ('teacher','admin')) with check (auth_role() in ('teacher','admin'));

-- ── The marks pipeline views: computed by the database, never typed ───────
-- Averages respect the survey's rule: graded items in ENROLLED subjects only.
create or replace view assessment_totals as
  select
    m.student_id,
    a.class_id,
    a.subject,
    sum(m.mark * a.weight) / nullif(sum(a.max_mark * a.weight), 0) * 100 as percent,
    count(m.mark) as graded_items,
    rank() over (
      partition by a.class_id, a.subject
      order by sum(m.mark * a.weight) / nullif(sum(a.max_mark * a.weight), 0) desc
    ) as position
  from assessments a
  join marks m using (assessment_id)
  join enrolments e
    on e.student_id = m.student_id
   and e.class_id = a.class_id
   and e.subject = a.subject          -- enrolled subjects only
  where m.mark is not null            -- graded items only
  group by m.student_id, a.class_id, a.subject;

-- ── updated_at trigger ────────────────────────────────────────────────────
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger homework_touch before update on homework
  for each row execute function touch_updated_at();
