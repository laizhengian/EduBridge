# Design Constitution — OIS Hub
*WEBSKILL.md translated from marketing sites to a school utility app. Every screen must pass this.*

## The one-line bar
A stranger opens this on their phone with one thumb and four seconds and thinks:
**a person with taste made this, for this school specifically.**

## Substitution test (app edition)
Swap "Oakbridge" out. If the app still makes sense, it's generic slop. Our identity:
- **Oakbridge green** (`#1d6b4f`) as the single accent — from the tree in the school's actual logo
- **Fraunces** serif for display (warm, academic — like a school crest, not a SaaS dashboard)
- **Public Sans** for UI/body (quiet, readable, not a default font)
- Warm paper background (`#faf9f7`), ink text, hairlines — never cool gray, never pure white
- Voice: plain and short. Say the thing, then stop — "2 homework items due today." No cleverness, no sentences trying to be charming

## The space rule (added from user review, rebalanced after v2)
- Air goes BETWEEN sections, not inside rows. Section gaps: `mt-8`–`mt-10` mobile.
- Rows stay compact and scannable (`py-3.5`–`py-4`, single-line where possible) —
  a school app is a tool, not a landing page. Minimum scrolling to reach anything.
- Titles are labels, not hero banners: page titles `text-2xl` mobile / `text-3xl` desktop.
- Nothing cramped may ship. Made for kids and grandparents: primary targets ≥44px,
  labels unabbreviated.

## Speed budget (added from user review)
- Must feel instant on old hardware: no `backdrop-blur` (a top killer on cheap phones),
  no large images without sizing, minimal client JS per page
- Static-first: pages render on the server and cache; JS hydration is the exception
- No blocking loaders; perceived <1s navigation on a 3-year-old mid-range Android

## Hard bans (from WEBSKILL, enforced here)
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

## Motion floor
- First screen: items enter with staggered rise within 1s of load, no input needed
- Signature moment (one): **the strike** — marking homework done draws a strike-through
  line across the title and the day's counter ticks. Tied to the actual work
- Every control responds on press; focus states visible; all motion respects
  `prefers-reduced-motion` (transforms off, counters render final values)
- No bounce easing, nothing delays comprehension, no loaders

## Color discipline
One accent (green) for interaction and identity — 90/10. Red only for overdue.
Semantic tags (event/holiday/exam) are small **dot + word** labels (a colored dot and
plain text), never colored pill badges — pills read as marketing chips. Each section
has one clear heading; a screen is a set of separated lists, not one long feed.

## Structure rules carried from the friction log
Zero forms to view data · state not recency · ≤2 taps to anything · trust markers
(who posted, when) on every item · ship nothing empty · details are trust.
