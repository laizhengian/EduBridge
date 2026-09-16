# Project Plan — OIS Hub (working title)
*The Clobas replacement for Oakbridge International School. Locked 16 Sep 2026.*

## North star
> **The 10-second app: open it, see what's due today and what's new, done.**

## Locked decisions
| Decision | Choice | Why |
|---|---|---|
| Platform order | **Website first**, native app later | Easier MVP; lets Ian validate with a teacher before app-store work |
| Integration | **One shared backend**; web + app are two skins | A teacher post lands in one database → appears everywhere. Nothing to sync. |
| Stack | **Next.js + TypeScript + Tailwind** | One codebase, huge tutorial ecosystem, beginner-friendly |
| Backend | **Supabase** (free tier) | Postgres + Google auth + storage + realtime, no servers to manage |
| Hosting | **Vercel** (free tier), deploy later | Build local first; create accounts when showing classmates |
| Sign-in | **Google accounts restricted to @oakbridge.edu.my** | Real identity, no new passwords, school-verified |
| Class structure | Students join a class with a code (e.g. `G8B-2026`) | No roster import needed; DB rules enforce who sees what |
| Scale | ~500 students | Trivial for Postgres; free tier covers it with huge headroom |
| Reliability | Managed hosting + cached last-known data | Survives weak school Wi-Fi; no servers to babysit |

## Design language (the anti-Clobas)
- Calm: one accent color, generous white space, no clip-art banners, no 8-color calendars
- **Zero forms to view data** — filters refine, never gate (friction-log rule #2)
- **State, not recency** — owed/overdue/done/upcoming; nothing vanishes because a day passed (rule #1)
- **≤ 2 taps** from home to anything (rule #3)
- **Trust markers** — every item shows who posted it and when (rule #4)
- **Ship nothing empty** — dead modules erode trust (rule #5)
- Mobile-first layout: bottom tab nav, big touch targets (rule #8)

## Build slices (one at a time, verify before moving on)
1. **Scaffold + design placeholder** ← we are here
   Next.js app with every screen laid out using realistic mock data:
   Today (home), Homework, Timetable, Events, bottom nav.
   *Ian reviews the look and layout before any real data exists.*
2. **Foundation** — Google login (@oakbridge.edu.my only) + join-class-by-code flow
3. **Homework board** — the durable queue: everything owed, overdue pinned, mark-done,
   post in <30s (subject chips + due-date chips, optional note)
4. **Timetable** — this week's grid, zero forms
5. **Events** — upcoming list + calendar with a legend that exists
6. **Polish + offline cache** — fast loads, installable (PWA), stale-data badges
7. **Pilot** — share with ~5 classmates, gather feedback, iterate
8. **Teacher phase** (needs a teacher champion) — teacher accounts, official circulars,
   attendance/results views; teacher posts appear on web *and* future app automatically

## Explicitly deferred
Push notifications, fees, bus tracking, chat/DMs, photo gallery, admissions, alumni,
auto-grading — killed for now per the wedge strategy; revisit only with school buy-in.

## Docs map
- `docs/plan.md` — this file (locked decisions)
- `docs/ux-teardown.md` — failure log → design rules (updated as evidence arrives)
- `docs/clobas-teardown/friction-log.md` — the teacher-showable evidence doc
- `docs/clobas-teardown/screenshots/` — 20 captures of the current portal
