# Design Constitution — EduBridge
*Implements the principles in `goals.md`; translated from app-skill.md to a school utility app. Every screen must pass this.*

## The one-line bar
A stranger opens this on their phone with one thumb and four seconds and thinks:
**a person with taste made this, for this school specifically.**

## Who we're building for (the 8–60 rule)
Users range from **8-year-old kids to 60-year-old teachers**, plus parents and
grandparents. Consequences:
- Size follows importance: the thing that matters most on a screen is the biggest thing
  (the day counter, section headers) — not decoration, information
- Every touch target ≥44px, every label written in plain words a child can read
- High contrast text; muted color only for genuinely secondary details
- One obvious action per section; nothing depends on hover or prior app experience
- Fonts have clear jobs (see below) — variety must mean something, never decoration
- **Text size is a setting, not a compromise** (added from user review): the Hub
  offers Standard / Large / Larger. It scales the **root font size**, and type is
  sized in rem — so every screen grows in proportion and nothing can clip (a
  per-element bump would break rows; root scaling can't). The choice restores
  before first paint, so larger type never flashes small. New screens must keep
  type in rem/text-* classes — never fixed px — or they silently opt out of
  accessibility

## Fonts — two, each with a clear job
- **Nunito** (`.font-display`): headings, section titles, big numbers, buttons' labels.
  Rounded and sturdy — friendly to an 8-year-old, legible to a 68-year-old
- **Public Sans**: body text, list rows, metadata. Neutral, quiet, easy for long reading
- No third font. A serif for its own sake is decoration — decoration is not a job
- Display sizes: page titles `text-2xl`–`text-4xl` (importance-sized), section headers
  `text-[17px]`–`text-base`, everything else 13–15px

## Substitution test (app edition)
Swap "Oakbridge" out. If the app still makes sense, it's generic slop. Our identity:
- **Oakbridge green** (`#1d6b4f`) as the single accent — from the tree in the school's actual logo
- Warm paper background (`#faf9f7`), ink text, hairlines — never cool gray, never pure white
- Voice: plain and short. Say the thing, then stop — "2 homework items due today." No cleverness, no sentences trying to be charming
- Everything written must be **customer-facing**: no tech words, no AI-slop phrasing, no
  clever headlines — anything on screen could be shown to a parent or the school office as-is

## The space rule (added from user review, rebalanced after v2)
- Air goes BETWEEN sections, not inside rows. Section gaps: `mt-8`–`mt-10` mobile.
- Rows stay compact and scannable (`py-3.5`–`py-4`, single-line where possible) —
  a school app is a tool, not a landing page. Minimum scrolling to reach anything.
- Titles are labels, not hero banners: page titles `text-2xl` mobile / `text-3xl` desktop.
- Nothing cramped may ship. Made for kids and grandparents: primary targets ≥44px,
  labels unabbreviated.

## Speed budget (added from user review, amended when materials arrived)
- Must feel instant on old hardware: no `backdrop-blur` on page content (a top killer
  on cheap phones), no large images without sizing, minimal client JS per page
- **Exception — system materials:** translucent blurred surfaces are allowed *only*
  on fixed chrome that floats above the page: the tab bar, the desktop masthead,
  bottom sheets, and toasts. Never on in-flow content
- Static-first: pages render on the server and cache; JS hydration is the exception
- No blocking loaders; perceived <1s navigation on a 3-year-old mid-range Android

## Segmentation rule (added from user review)
Lists are boxed into cards with hairline borders on the paper background — the Today
screen and Homework board read as clear separate "boxes" a child can point at, not one
continuous open feed. Each box has one heading. Dividers inside a box are faint;
the box edge itself is the boundary.

## Navigation rule (added from user review)
Five bottom slots: Today · Homework · **Hub** (tree icon, center, raised) · Timetable ·
Events. The four tabs are the daily destinations; the Hub holds everything else
(absence notes, holidays, letters, future sections) on a big-tile page. Desktop nav
carries the same four links; the Hub lives in it too when there is more than one
secondary page. A child should never wonder where a feature lives: daily things are
tabs, everything else is in the tree.

## Two apps, one design (added from user review)
- **The family app (this app):** view-only for students and parents — read, tick off,
  add to calendar. No posting UI anywhere; posting happens in the companion app below
- **The teacher/admin app (later):** same visual language, same database; exists for
  posting and managing. Never mix posting controls into the family app
- A post in one app appears in the other automatically — one database, no syncing
- **One codebase, doors by role** (updated September 2026): teacher tools live at
  `/teacher/*` inside the same app and appear only for teacher accounts — the Hub
  grows a Teacher tools group. Students and parents never see the doors, so the
  family surface stays view-only; there is still no posting UI *in the family
  screens*. This matches the product plan (one app, role-based feature sets) and
  keeps one design system, one deploy, one review surface

## Hard bans (from app-skill, enforced here)
- No emoji in headings, buttons, or navigation
- No default indigo/blue-purple, no gradient heroes, no glassmorphism
- No uniform chevron-card stacks; no two adjacent sections sharing the same layout
- No Geist/Inter/Roboto as identity font
- No hover-only affordances; every control works by touch and has a pressed state
- No marketing-voice copy ("seamless", "empower", "unlock")
- No subtext essays under page titles. If a paragraph under a heading explains what the
  screen is, the screen is not clear enough — delete it

## The two canvases (parity contract)
The web app **is** the app. APK/iOS later = this exact app wrapped (Capacitor), not a rewrite.
- **Mobile baseline** composed first at 375px: single column, bottom tabs, ≥44px targets,
  inputs ≥16px, safe areas
- **Desktop expansion** arranges the SAME content more generously: Today gets a main/side
  split; Timetable becomes a full-week board; Homework gets a summary rail; more whitespace.
  Desktop never has content mobile lacks — and vice versa
- Zero horizontal scroll 320→1440px

## Motion floor (rebuilt for native feel)
- First screen: items enter with staggered rise within 1s of load, no input needed
- Signature moment (one): **the strike** — marking homework done draws a strike-through
  line across the title and the day's counter ticks. Tied to the actual work
- **Springs, not eases:** anything a finger causes — press states, chips, sheet
  return, toast release — settles with a hint of overshoot (`--spring`). Entrances
  and exits stay quick and quiet
- **Press feedback is universal:** every tappable control uses the shared
  `pressable` response (scales down ~3%, dims slightly, springs back). No control
  may feel dead under the finger
- **Bottom sheets** present like iOS: spring up from the bottom edge, dim the page,
  close on tap-outside, Escape, or a downward drag on the grabber — with
  fling-to-dismiss on velocity. Content scrolls inside the sheet; the page locks
- **Toasts swipe away** horizontally like system notifications, with fling
- **Scroll-linked elevation:** fixed chrome gains its shadow only when content
  actually passes beneath it
- **Tactile feedback:** committed actions give a short haptic tick (Android today;
  iOS gets it when the native shell arrives — see platform.md). Successes feel
  different from warnings. Never on scroll or hover
- **Keyboard:** forms submit with Enter; fields carry `enterKeyHint`,
  `autoComplete`, and disable autocorrect where wrong; the keyboard resizes the
  page (never overlays the buttons)
- **Glyphs, not text marks:** status symbols (✓, ✗, —, !) are drawn SVG glyphs,
  never characters — text glyphs shift with every platform font
- Focus states visible (`:focus-visible` only — never on touch); all motion
  respects `prefers-reduced-motion` (transforms off, counters render final values)
- No bounce easing, nothing delays comprehension, no loaders

## Color discipline
One accent (green) for interaction and identity — 90/10. Red only for overdue.
Semantic tags (event/holiday/exam) are small **dot + word** labels (a colored dot and
plain text), never colored pill badges — pills read as marketing chips. Each section
has one clear heading; a screen is a set of separated lists, not one long feed.

## Structure rules carried from the friction log
Zero forms to view data · state not recency · ≤2 taps to anything · trust markers
(who posted, when) on every item · ship nothing empty · details are trust.
