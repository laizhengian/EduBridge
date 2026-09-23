# Feature candidates — EduBridge

*Every feature answers a real, observed problem and serves one of the goals in `goals.md`. If a feature can't name the problem it solves, it doesn't get built. "Useful" beats "impressive."*

## The filter

A feature qualifies only if it does one of these:

- Saves someone time **they currently spend** (not hypothetical time)
- Prevents something from being **missed** (homework, circulars, deadlines)
- Removes friction the old portal created (Clobas screenshots are the proof)

Everything else is a gimmick and goes on the "not building" list.

## Building (in order)

### 1. Homework board — built in mockup
- **Problem:** Clobas shows one day of homework; older work vanishes (F1). Posting needs 5+ form fields (F2).
- **Fix:** durable queue, oldest deadline first; strike to finish; post via chips in under 30 seconds.

### 2. Google sign-in + class join codes
- **Problem:** hundreds of students must get in without the school creating accounts.
- **Fix:** sign in with school Google account; join a class with a short code (e.g. `G8B-2026`). Database rules make it impossible to see another class's data.

### 3. Today screen — built in mockup
- **Problem:** Clobas buries everything in menus; the important thing (what's due, what's new) is never on page one.
- **Fix:** open the app → due today + overdue + new circulars + next event. Zero taps.

### 4. Teacher & admin app — a separate companion app
- **Problem:** teachers don't use the old tools — friction kills posting (Teacher Notes is empty; homework form is a wall). Mixing posting controls into the family app would clutter screens that children and parents use.
- **Fix:** a **second app for teachers and administrators**, same design language and same database: post homework in under 30 seconds with chips, publish letters, take attendance in two taps per class. One post lands everywhere the family app reads. The family app itself stays **view-only**: students and parents read, tick off, and add to calendar — nothing to configure, nothing to break.
- **Now evidence-backed:** five teacher interviews (friction log §20) name the
  same flaw from four of five teachers — every action is typed or re-typed, and
  the portal sometimes loses what was entered. The two flows below (§14–15) are
  the first teacher screens for that reason.

### 5. Read receipts for homework
- **Problem:** teachers currently have no idea whether students saw the homework.
- **Fix:** teacher sees "seen by 18/24" on each post. Students do nothing extra — opening it is the receipt. This is the feature that convinces a teacher champion, because it saves them the "did everyone see this?" chase.

### 6. Offline view
- **Problem:** school Wi-Fi dies; an app that shows an error is worse than no app (design rule 5).
- **Fix:** last-loaded data stays visible with a "last updated 10:32" stamp; auto-refreshes when the network returns.

### 7. The Hub + absence notes + holidays (built in mockup)
- **Problem:** four tabs can't hold a whole school app; parents especially need one obvious place to find "everything else". Absence notes currently mean phoning the office or a WhatsApp message into the void.
- **Fix:** a tree-shaped Hub button in the middle of the bottom bar opens a big-tile page: Tell the school I'm away (reason chips + today/tomorrow + a photo of the doctor's certificate + send), Holidays (closed days, add-to-calendar), Circulars.

### 8. Events + circulars with real text
- **Problem:** circulars are table rows with a date bug (`00/08/2026`); calendar colors have no legend.
- **Fix:** full-text letters on one scroll; every tag named; dates validated on entry.

### 9. Attendance, done honestly — built in mockup (`/attendance`)
- **Problem:** the portal counts every absence the same — a medical-certificate
  absence equals a skip (testimony, friction log §14); ECA rolls are per-date
  with broken selector buttons (§15).
- **Fix:** today's status first; days-away split into **excused** (reason on
  file) and unexplained, said in a plain sentence; extracurriculars as **one
  card per activity** with per-session ✓/✗ and reasons — no date picking.

### 10. Exam results + a dated progress report — built in mockup (`/results`)
- **Problem:** rows colored pink on 98/100 with no legend (screenshot 06); marks
  reported unreliable; the "Student Progress Report" never updated after the
  portal's recent "AI update" (§16).
- **Fix:** one exam at a glance with change-since-last-exam, colour used for
  exactly one thing (below pass mark) with the legend written out, teacher
  comments kept, and the progress report **stamped with its issue date** plus an
  up-to-date marker so staleness is visible, never silent.

### 11. School life: gallery + competitions — built in mockup (`/life`)
- **Problem:** the portal's Photo Gallery is an empty page with zero photos
  (screenshot 07); past competitions and fun events exist nowhere, so the
  school's best moments are unrecorded.
- **Fix:** photo albums with covers and tap-to-open grids (stock photos now,
  real school photos later); a competitions archive with results; school-video
  rows with slots ready for the school's YouTube links; and campus info —
  address with a maps link, the shape of a school day, office hours, facilities.
  Content ships — never an empty shell.

### 12. Hotlines + FAQ — built in mockup (`/hotlines`, `/faq`)
- **Problem:** the portal's hotline page has empty Details columns and a
  "Senoir" typo; onboarding is a 46-page PDF manual (friction log §11, §13).
- **Fix:** hotlines with role, working hours and tap-to-call; an in-app
  plain-language FAQ answering what families actually ask. Zero documents.

### 13. Student feedback with a visible reply — built in mockup (`/feedback`)
- **Problem:** the portal has a feedback module, but sending something into it
  is a black hole — no confirmation, no status, no evidence anyone read it.
- **Fix:** one decision on the screen (what you want to say — the kind is
  pre-chosen, the name optional); after sending, the item appears with a status
  tag ("Received — in review" → "Replied"), and the school's answer is printed
  on the item itself. The loop visibly closes.

### 14. Tap-the-row attendance — the template that fills itself (teacher app)
- **Problem (Nisha, Deborah, Annie):** attendance is a per-student dropdown, sometimes won't load, and records "late" as "absent". Nisha's ask is the whole spec: *"a template that automatically has all the info — I just post it."*
- **Fix:** the roster opens **all present by default** — the template *is* filled in. A tap moves a child through present → late → excused → absent (four states from day one; "late ≠ absent" is a live data bug in the old portal). Default-nothing is the old app's mistake; default-everyone-present means a well-behaved class is **two taps total** ("Everyone in?" → "Post"), and a normal class is one tap per exception. A morning reminder arrives if attendance isn't taken by a set time (Deborah's ask). Reasons are chips, not typing. Saves autosave-as-draft, and the post shows an explicit server-confirmed "Saved" — because the portal's habit of losing entered marks (Nisha) is the trust-killer we are reversing.

### 15. The marks grid — one pipeline from quiz to report card (teacher app)
- **Problem (Puvi, Nisha, Annie):** marks are typed by hand, sometimes twice (they don't save); mid-terms are calculated manually; homework and marks live in separate modules though they're the same thing in STEM; report cards can't fit a page when printed.
- **Fix:** **one marks table** behind every assessment — homework scores, quizzes, tests, continuous marks. The teacher sees a spreadsheet-like grid (rows = students, columns = assessments) with **autosave and an explicit "Saved" per cell**. Totals, mid-term aggregates and report-card numbers are **computed by the database, never keyed in** (the backend view is already designed in backend-plan.md). Because the pipeline is unified, the one-page printable report card becomes a template problem, not a data problem. Excel import is deliberately deferred — if entry costs ~2 seconds per cell, the import pressure disappears.

### 16. Homework Radar — the student's week at a glance (the sellable one)
- **Problem (survey + Akram's "see when students are doing well or doing bad"):** a homework list shows work; it doesn't show *trajectory*. Students can't see a slipping week coming, and parents can't help before the deadline passes.
- **Fix:** on top of the homework board (not a separate module), one honest progress line per week: **what got done on time, what slipped, what's left** — and for the coming week, the load mapped out day by day so a heavy Thursday is visible on Monday. It is *reflective*, not comparative: no points, no streaks, no class leaderboard (that stays on the gimmick list) — just the student's own week, plus an **optional share-to-parent** toggle so a parent sees the same radar. This is the pitch feature: every homework app lists work; EduBridge shows the week before it goes wrong.

### 17. The attendance summary that fills itself (student/parent side)
- **Problem (Nisha's teacher-side ask, mirrored for families):** nobody should assemble their own attendance picture, and "excused vs unexplained" must never be conflated (the old portal counts every absence the same — §14).
- **Fix:** the existing `/attendance` summary becomes **auto-maintained**: every teacher tap (present/late/excused/absent) updates the student's running record in real time — counts, the plain-language split of excused vs unexplained, and patterns stated honestly ("3 lates this month, all Mondays"). No form, no date picking, no manual anything — the summary *is* the data the teacher app already posted. Paired with the marks pipeline, this is the family-facing proof that the system is one thing, not modules.

## Later (only after the pilot proves the core)

- **Homework reminders:** browser/phone notification the evening before something is due. Useful, but only once there's real data worth reminding about.
- **Parent view:** a parent sees the same Today screen for their child (read-only). High value for the school pitch, zero extra data entry.
- **Timetable:** built in mockup; becomes real once a class's timetable is typed in once by anyone (a student can do it — it's their own class).
- **Add-to-calendar on every event** — built in mockup; one tap downloads a pre-filled event file, no account or setup needed.
- **RSVP / sign-ups for events:** a real "I'm going" button wired to the database once real data exists. The Add-to-calendar action covers the need until then.
- **Photo attach for homework:** teacher snaps the whiteboard instead of typing. Useful, but file storage can wait.

## Not building (the gimmick list)

- **AI anything** — "AI summaries" of three-line homework entries is slop.
- **Chat / messaging** — WhatsApp already owns this; we'd be a worse WhatsApp.
- **Gamification (points, streaks, badges)** — patronizing for teens, noisy for everyone.
- **A "leaderboard" or "best performers" module** — literally the dead module in Clobas (empty box, screenshot 07).
- **Theme switcher / dark mode** — Clobas ships one (screenshot 02) while its dates are invalid. Priorities.
- **Fees, transport, admissions, library** — institution-fed modules with no student value for the pilot; this is Clobas's breadth-over-depth trap.

## Why this order

1–3 are the wedge (students use it with zero adult permission).
4–5 recruit the teacher champion (posting is effortless; receipts prove value).
6–7 make it trustworthy enough to show the school office.
**14–15 are the teacher app's first two screens** — five independent interviews
named teacher input cost (and data loss) as the portal's deepest flaw, so the
flows that cost the least taps get built first, on the backend in
[backend-plan.md](backend-plan.md).
**16–17 are the sellable pair** — one for students (radar), one for families
(auto-maintained record) — built on the same data, no extra entry from anyone.
Everything later depends on the champion, not on code.
