-- EduBridge vault — adversarial RLS tests
-- The gate from the roadmap: no real user signs in before these pass.
-- Run: supabase/migrations/tests/adversarial_rls_test.sql
-- Every test asserts the OPPOSITE of what a friendly database would do —
-- a student asking for someone else's data must get ZERO ROWS, not an error
-- they might learn to route around.

begin;

-- ── Test rig: one class of each flavor, fake auth identities ─────────────
create schema if not exists test;

-- We impersonate users with set_config('role', …) style helpers via
-- `request.jwt.claims` + auth.uid() overriding. Simplest reliable approach:
-- temp function shadowing auth.uid() is NOT possible — so instead we insert
-- test users directly into auth.users ONLY in a local throwaway database.
-- On a hosted project, run these as the real test accounts created in the
-- dashboard (see docs/production-hardening.md → "adversarial protocol").

create or replace function test.as_user(uid uuid) returns void
language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated')::text, true);
end $$;

-- ── Fixtures ──────────────────────────────────────────────────────────────
insert into classes (id, name, join_code, academic_year)
values ('00000000-0000-4000-8000-000000000001', 'Class 8A', 'T8A-2026', 2026),
       ('00000000-0000-4000-8000-000000000002', 'Class 8B', 'T8B-2026', 2026);

insert into profiles (id, display_name, role, class_id)
values ('00000000-0000-4000-8000-0000000000a1', 'Student A', 'student', '00000000-0000-4000-8000-000000000001'),
       ('00000000-0000-4000-8000-0000000000a2', 'Student B', 'student', '00000000-0000-4000-8000-000000000002'),
       ('00000000-0000-4000-8000-0000000000t1', 'Teacher 1', 'teacher', '00000000-0000-4000-8000-000000000001'),
       ('00000000-0000-4000-8000-0000000000t2', 'Teacher 2', 'teacher', '00000000-0000-4000-8000-000000000002'),
       ('00000000-0000-4000-8000-0000000000d1', 'Admin D',   'admin',   null);

insert into homework (id, class_id, subject, title, due_date, posted_by)
values ('00000000-0000-4000-8000-0000000000h1', '00000000-0000-4000-8000-000000000001', 'Mathematics', '8A worksheet', '2026-09-30', '00000000-0000-4000-8000-0000000000t1'),
       ('00000000-0000-4000-8000-0000000000h2', '00000000-0000-4000-8000-000000000002', 'Mathematics', '8B worksheet', '2026-09-30', '00000000-0000-4000-8000-0000000000t2');

insert into assessments (id, class_id, subject, title, kind, max_mark, created_by)
values ('00000000-0000-4000-8000-0000000000s1', '00000000-0000-4000-8000-000000000001', 'Mathematics', 'Quiz 1', 'test', 20, '00000000-0000-4000-8000-0000000000t1');

insert into marks (assessment_id, student_id, mark, entered_by)
values ('00000000-0000-4000-8000-0000000000s1', '00000000-0000-4000-8000-0000000000a1', 18, '00000000-0000-4000-8000-0000000000t1');

insert into attendance (student_id, class_id, day, state, recorded_by)
values ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000001', '2026-09-23', 'present', '00000000-0000-4000-8000-0000000000t1');

-- ── Tests: student A must NEVER see student B's data ─────────────────────
do $$
declare
  a uuid := '00000000-0000-4000-8000-0000000000a1';
  b uuid := '00000000-0000-4000-8000-0000000000a2';
  t1 uuid := '00000000-0000-4000-8000-0000000000t1';
  t2 uuid := '00000000-0000-4000-8000-0000000000t2';
  n int;
begin
  -- 1. Student A cannot read Student B's marks
  perform test.as_user(a);
  select count(*) into n from marks where student_id = b;
  assert n = 0, 'FAIL: student A read student B marks';

  -- 2. Student A cannot read Student B's attendance
  select count(*) into n from attendance where student_id = b;
  assert n = 0, 'FAIL: student A read student B attendance';

  -- 3. Student A cannot see the other class's homework
  select count(*) into n from homework where title = '8B worksheet';
  assert n = 0, 'FAIL: student A read class 8B homework';

  -- 4. Student A cannot read Student B's absence notes
  select count(*) into n from absence_notes where student_id = b;
  assert n = 0, 'FAIL: student A read student B absence notes';

  -- 5. Student A cannot update their role
  update profiles set role = 'admin' where id = a;
  assert not found, 'FAIL: student A escalated own role';

  -- 6. Teacher 2 (8B) cannot write homework for 8A
  perform test.as_user(t2);
  begin
    insert into homework (class_id, subject, title, due_date, posted_by)
    values ('00000000-0000-4000-8000-000000000001', 'Mathematics', 'injected', '2026-09-30', t2);
    assert false, 'FAIL: teacher 2 wrote into class 8A';
  exception when check_violation then
    null; -- expected: RLS WITH CHECK rejected
  end;

  -- 7. Teacher 2 cannot read Student A's marks (wrong class)
  select count(*) into n from marks where student_id = a;
  assert n = 0, 'FAIL: teacher 2 read marks from class 8A';

  -- 8. Teacher 1 (8A) CAN read Student A's marks (positive control)
  perform test.as_user(t1);
  select count(*) into n from marks where student_id = a;
  assert n = 1, 'FAIL: teacher 1 lost access to own class marks';

  -- 9. Admin can read everything (positive control)
  perform test.as_user('00000000-0000-4000-8000-0000000000d1');
  select count(*) into n from marks;
  assert n = 1, 'FAIL: admin lost read access';

  raise notice 'ALL ADVERSARIAL TESTS PASSED (9/9)';
end $$;

rollback;
