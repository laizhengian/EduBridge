# EduBridge

**A school app built around one question: what should a family see the moment they open it?**

EduBridge is the student-and-parent side of a school communication app, built as a
modern replacement for legacy school portals that bury information behind menus,
forms, and dropdowns. It is a website that behaves like a phone app — installable,
fast on cheap hardware, usable by an 8-year-old or a grandparent.

> **Status:** interactive front-end with sample data. Sign-in, the database, and the
> companion teacher app are the next phases (see the roadmap below).

---

## What makes it different

- **Nothing vanishes.** Homework is a durable queue — owed work stays on the board,
  sorted by deadline, until it's struck off. No daily-feed forgetting.
- **Zero forms to view anything.** Pages open showing their data; filters are optional
  chips, never gatekeepers.
- **The 10-second home.** Overdue items pinned at top, what's due today, latest
  announcements, next events — no navigation required.
- **Two apps, one design.** This family app is view-only. A separate teacher/admin
  companion (same design language, one shared database) handles posting — one post
  appears everywhere.
- **Habits, not gimmicks.** Reminders and clarity instead of points, streaks, or
  leaderboards.

## In the app today

| Area | What it does |
|---|---|
| **Today** | Greeting, overdue (pinned), due today, circulars, upcoming events |
| **Homework** | Durable board, deadline-sorted, filter chips, tick-off with undo toast |
| **Timetable** | Today preselected on mobile; full week board on desktop |
| **Events** | Boxed list, add-to-calendar (.ics download), More/Less details |
| **Hub** (tree) | Everything else: attendance, results, school life, absence notes, holidays, circulars, student feedback, hotlines, FAQ, privacy |
| **Attendance** | Today's status first; excused absences counted separately from unexplained; ECA as one card per activity |
| **Exam results** | One exam at a glance with change-since-last; colour only below the pass mark; progress report stamped with its issue date |
| **School life** | Photo galleries (tap-to-open albums), school-video slots, a competitions archive, and campus info (address, day schedule, facilities) |
| **Student feedback** | One-decision form (kind pre-chosen, name optional) with status tags and the school's reply printed on the item |
| **Hotlines & FAQ** | Who to call with tap-to-call; plain-language answers to what families ask most |
| **Welcome flow** | Google sign-in or username/password (mocked), then class selection |

## Docs worth reading

| Doc | What's inside |
|---|---|
| [`docs/goals.md`](docs/goals.md) | The four goals and ten principles every feature must serve |
| [`docs/plan.md`](docs/plan.md) | Locked decisions and build order |
| [`docs/roadmap.md`](docs/roadmap.md) | From here to school-wide: interviews, the three apps, one vault, and real costs |
| [`docs/backend-plan.md`](docs/backend-plan.md) | The database schema, RLS rules, caching and job design — derived from the teacher interviews |
| [`docs/maintenance.md`](docs/maintenance.md) | Who fixes, updates and pays for the app after launch — the runbook and the licence plan |
| [`docs/features.md`](docs/features.md) | Every feature, tied to the problem it solves |
| [`docs/design.md`](docs/design.md) | The design constitution: fonts with jobs, the 8–60 rule |
| [`docs/how-its-built.md`](docs/how-its-built.md) | The tech stack explained with zero jargon |
| [`docs/security-plan.md`](docs/security-plan.md) | Who can do what, and how student data stays safe |
| [`docs/platform.md`](docs/platform.md) | iOS compatibility and the Expo/React Native decision |
| [`docs/hosting.md`](docs/hosting.md) | What the backend will actually cost — Vercel/Supabase free tiers, risks, and decision rules |
| [`docs/performance.md`](docs/performance.md) | What's already fast, what's staged for the backend |
| [`docs/production-hardening.md`](docs/production-hardening.md) | Rate limiting (live), RLS recipes, auth decision, caching, async jobs, secrets gate, load testing |
| [`docs/running-the-app.md`](docs/running-the-app.md) | Step-by-step guide to running the app in development |
| [`docs/clobas-teardown/`](docs/clobas-teardown/) | Section-by-section teardown of the old portal, with evidence |

## Tech stack

- **Next.js 16 + TypeScript + Tailwind CSS 4** — one codebase, web now, native later
- **Local-first state** — homework ticks persist on-device; the API shape mirrors the
  future database layer, so wiring Supabase swaps the implementation, not the screens
- **Small, purposeful dependencies** — Lucide icons and the `motion` gesture/spring
  library, tree-shaken to only what's used; no component framework pulling in half of npm
- **Native-feel interactions** — bottom sheets with real drag physics, swipe-away toasts,
  haptics, press states, all reduced-motion aware

## Roadmap

1. **Real backend** — Supabase: Google sign-in restricted to the school domain,
   class join codes, homework/circulars/events in Postgres
2. **Teacher & admin app** — separate app, same design language, one database;
   the 30-second homework post with read receipts
3. **PWA install + offline cache** — "last updated" stamps when Wi-Fi drops
4. **Native wrap** — Capacitor for Android APK / iOS, full parity with web
5. **Pilot** — a handful of classmates, daily-use feedback, then the teacher champion

## Running it locally

```bash
cd web
npm install
npm run dev
```

Open the printed localhost URL. No environment variables needed yet — sample data
only. When the backend phase begins, `.env.local` will hold the database keys
(never committed).

---

*Built as a focused, student-led alternative to 60-feature portals where nothing
works well. Fewer features, actually used.*
