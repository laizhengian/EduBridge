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
- **Fix:** a **second app for teachers and administrators**, same design language and same database: post homework in under 30 seconds with chips, publish letters, take attendance later. One post lands everywhere the family app reads. The family app itself stays **view-only**: students and parents read, tick off, and add to calendar — nothing to configure, nothing to break.

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
Everything later depends on the champion, not on code.
