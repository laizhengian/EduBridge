# UX Teardown — Clobas (old app + new "AI-vibe-coded" version)

A running log of failure patterns found by actually using the app. Every entry becomes a
**rule we build by**, so the replacement never inherits the same sins. This doc feeds the
PRD and the acceptance criteria of every feature.

## How to read this
- **Failure**: what the app actually does (symptom, with screen reference)
- **Why it kills the app**: the deeper wrong assumption
- **Our rule**: the design decision that makes this impossible in our app

---

## Failure log

### F1. Homework is a "today feed", not a durable queue
- **Failure**: The homework tab shows only *today's* homework. Homework posted/due two days
  ago is unreachable — it has vanished.
- **Why it kills the app**: Homework is a queue with deadlines, not a daily feed. A student
  who misses one day loses the record of what they still owe. Once students learn the app
  can silently hide owed work, they stop trusting it for anything.
- **Our rule**: Homework is a durable board. Every unfinished item stays visible, sorted by
  due date, with overdue items in a distinct pinned state at the top. Items only leave the
  board when *the student* marks them done (or a filter hides them — never by default).
  A "day view" may exist as a filter, but never as the only view.

---

## Design rules (growing list)
1. **No data vanishes because a day passed.** Screens show *state* (pending / overdue /
   done / upcoming), never mere recency.
2. **Every core action ≤ 2 taps from home.** If homework, timetable, or events are buried
   in menus, we have failed.
3. **Trust markers everywhere.** Every item shows who posted it and when — stale data is
   visible as stale, not disguised as fresh.
4. **Correctness of the model beats beauty.** A gorgeous screen that hides owed homework
   is worse than an ugly list that doesn't.
5. **Built for weak networks.** School Wi-Fi is bad; the app must tolerate it (small
   payloads, cached last-known state, no spinner-of-death).
6. **Teacher input must cost seconds, not minutes** (Phase 2) — the data-entry tax is what
   starves school apps of fresh data.

*(Rules 1–4 seeded from the first teardown session; more added as screenshots are analyzed.)*
