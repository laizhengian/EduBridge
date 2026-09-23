# Goals & Principles — EduBridge

*Why this app exists, what it must do better than Clobas, and the principles it follows.
This is the top of the doc stack — every feature in `features.md` and every screen in
`design.md` must serve a goal on this page. If a feature can't point at one, it doesn't get built.*

---

## What's wrong with Clobas (the short version)

Full evidence with screenshots: `clobas-teardown/friction-log.md`. In summary:

- Information **vanishes** — homework shows one day, then it's gone; work you still owe disappears
- Everything is **buried** — menus, search forms, and dropdowns before you see a single fact
- Data entry is a **tax** — 5+ field forms meant teachers stopped posting (Teacher Notes is empty)
- It **lies** — invalid dates like `00/08/2026`, empty modules like "Best Performers"
- It's **slow and cramped** on the phones students actually own

Every goal below is the direct opposite of one of those failures.

---

## The four goals

### Goal 1 — Organized: everything has one obvious place

- Work is a **durable queue by state** — owed, due today, done — not a daily feed.
  Yesterday's unfinished homework stays on the board until it's done (Clobas loses it)
- The Today screen is four clearly separated sections: **Overdue / Due today /
  From the office / Coming up** — each with one heading
- Nothing is buried: **≤ 2 taps** from home to anything
- One scroll tells you the state of your school life. No hunting, no cross-referencing

### Goal 2 — Frictionless: the easy path is the only path

- **Zero forms to view anything.** Clobas gates homework behind a search form; here,
  opening a page shows the data. Filters are optional chips, never requirements
- **Posting takes under 30 seconds** — subject chips and due-date chips
  (Today / Tomorrow / pick a date) instead of Clobas's dropdown-and-calendar maze.
  Posting must be easier than *not* posting, or teachers won't post
- **Sign-in is the school Google account; joining a class is one short code.**
  No new passwords, no account setup by the office
- Plain words on every screen. If a label needs explaining, the label is wrong

### Goal 3 — Quick: the 10-second app

- Open it → see what's due and what's new → done. The most important information
  requires **zero taps** — it's on the first screen
- **Fast on old hardware**: server-rendered pages, minimal JavaScript, no blur effects.
  Target: under 1 second navigation on a 3-year-old mid-range Android
- Never a loading spinner for data we already have (cached last-known data when
  Wi-Fi drops, with an "updated at" stamp)

### Goal 4 — Good habits, gently

Help students act earlier, not just know later:

- **Overdue stays visible** — pinned, red, at the top, until struck off.
  You can't forget what you still owe
- **Due-soon states** — "due tomorrow" looks different from "due in three weeks",
  so the natural reaction is to start early, not to discover things the night before
- **Evening-before reminders** (later phase, once real data exists): a notification
  the night before something is due
- **Events invite action** — an event isn't just listed, it has a clear next step:
  sign up / RSVP / add to calendar, so "there's an event" turns into "I'm going"
- **Habits through clarity and reminders — not gamification.** No points, no streaks,
  no leaderboards. Clobas's empty "Best Performers" box is the cautionary tale

---

## The benefits, by person

*The one-slide answer to "why replace Clobas?"*

| Who | What they get |
|---|---|
| **Students** | Never lose track of owed work; know what's due today in 10 seconds; reminders that build the do-it-early habit |
| **Teachers** | Post homework in under 30 seconds from any device; read receipts ("seen by 18/24") instead of chasing the class; one post reaches web and app |
| **Parents** | The same Today screen, read-only — what's due, what's happening — without learning a new system (later phase) |

---

## Principles the app follows

1. **State, not recency** — nothing disappears because a day passed
2. **Zero forms to view** — forms exist only to create and filter, never to read
3. **≤ 2 taps** to anything from the home screen
4. **Trust markers on every item** — who posted it and when; no anonymous information
5. **Ship nothing empty** — a module with no data is worse than no module
6. **Tool, not brochure** — compact scannable rows, air between sections, small titles,
   no marketing voice (full rules: `design.md`)
7. **For everyone** — kids, teens, parents, grandparents: big touch targets, plain
   labels, no jargon, no abbreviations
8. **Fast is a feature** — old hardware is the baseline device, not an edge case
9. **One backend, every surface** — a teacher post appears on the website and the
   future app alike; no syncing, ever
10. **Honest data** — dates are validated on entry, counts are real. An app that
    shows `00/08/2026` once loses trust permanently. Averages are computed over
    **enrolled subjects and graded items only** — and say what they include
    (a confirmed defect from the student survey, friction log §22)
11. **One decision per screen** — show only the choice that's relevant *now*,
    hide the rest until they are (Higgs Law: every extra option adds decision
    time, and decision time is friction). The Welcome screen asks *how do you
    sign in?* — one primary door, the alternative revealed only when asked for.
    The Hub groups ten destinations by need instead of listing them as equals.
    Complex on the back end, one clear action on the front.
12. **Worth opening, not addictive** — if people are interested in learning
    more and staying on the app, it is already good. Attention is earned with
    speed, fresh information and one-tap answers — never begged for with
    streaks, points or notification floods (all on the not-building list).
    Notifications are digest-first; the app treats the user's attention as
    finite and loans it back with interest.

---

## How we'll know it's working

- A student opens the app cold and knows what to do within 10 seconds — no explanation
- Pilot classmates open it **daily without being told to** (usage is the only metric that matters)
- A teacher posts their first homework in under 30 seconds, with no help after one walkthrough
- Zero "where do I find X?" questions during the pilot

---

## Doc map

- `goals.md` — this file: the why (goals + principles)
- `plan.md` — locked decisions and build order
- `features.md` — the feature list, each tied to a problem it solves
- `design.md` — the design constitution every screen must pass
- `clobas-teardown/friction-log.md` — the evidence: section-by-section failures, with screenshots
