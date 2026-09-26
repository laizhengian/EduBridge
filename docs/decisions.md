# Decision log — why this over that

**Question this doc answers:** "For everything in the app, why was this chosen
over the alternative?" Every major decision in EduBridge, with the honest
tradeoffs — what won, what lost, and what would make us revisit. Where a fuller
analysis exists elsewhere, it's linked.

---

## Stack decisions

### 1. Backend: Supabase (Postgres) — over Firebase, PocketBase, Appwrite, Convex, self-hosting on AWS/Fly/Railway
- **Why it won:** a real relational database (marks, ranks, enrolment and report
  cards are SQL views — NoSQL fights this), Row-Level Security that matches the
  security plan line for line, Postgres Realtime for the "post → appears
  instantly" requirement, auth and storage included, and a free tier whose
  limits (50k MAU, 200 realtime *connections*) are ~50× a school's size. The
  full cost table and the "isn't it just AWS underneath?" answer live in
  [hosting.md](hosting.md).
- **What lost and why:** Firebase (per-operation pricing punishes read-heavy
  school apps 3–5×; NoSQL marks pipeline is awkward); PocketBase (cheap but
  self-managed — the 2 a.m. pager lands on a student); Appwrite (younger
  Next.js ecosystem, more babysitting); Convex (great sync, but proprietary
  runtime throws away the SQL model); self-hosting ($10–20/mo minimum on
  Fly/Railway with zero managed parts — more than Supabase Pro for less).
- **Revisit if:** pricing turns hostile (the schema is portable — it's plain
  Postgres — so leaving is possible, which is the point of SQL).

### 2. Framework: Next.js (App Router) — over CRA/Vite SPA, plain React Native, Remix
- **Why it won:** static prerendering makes every page load instant from a CDN
  (the survey's #1 complaint was slowness), one codebase deploys to web today
  and wraps in Expo/Capacitor later, and file-based routing keeps the project
  legible to non-experts.
- **What lost:** a Vite SPA (no prerendering story out of the box; every visit
  is client-side work); React Native now (a second codebase mocking the same
  screens with no backend — the decision and its revisit triggers are in
  [platform.md](platform.md)).

### 3. Styling: Tailwind CSS — over CSS modules, styled-components, MUI/Chakra
- **Why it won:** design tokens live in one `:root` block and are enforced by
  utility names; no runtime styling cost (speed budget); any developer or AI
  agent can read a class list and know exactly what renders.
- **What lost:** component libraries (they fight the design constitution — we
  need *our* spacing, *our* materials, *our* motion, not a theme); CSS modules
  (more files, same power, less immediate readability).

### 4. Fonts: Nunito + Public Sans — over Inter-only or a display serif
- **Why it won:** two fonts with two jobs (design.md): Nunito's rounded
  forms are friendly to an 8-year-old and clear to a 68-year-old; Public Sans
  is a neutral workhorse for long reading. Both are open-licensed and
  self-hosted via `next/font` (no render-blocking Google fetch).
- **What lost:** a single family (less hierarchy); a display serif (character,
  but it reads "marketing site", not "tool").

### 5. Icons: Lucide — over hand-drawn SVGs, emoji, icon fonts
- **Why it won:** the set most native-quality apps ship (consistent 24-grid,
  2px strokes, MIT), tree-shaken so we ship only the glyphs we use. Replaced
  hand-drawn icons that were inconsistent in weight.
- **What lost:** nothing material. Brand icons (YouTube) were dropped by
  Lucide — deliberate, and legally safer; we use a play glyph.

### 6. Animation: Motion (Framer Motion's successor) + CSS springs — over ad-hoc keyframes, GSAP
- **Why it won:** real gesture physics for sheets and toasts (velocity fling,
  rubber-band) that I could not hand-roll correctly, with reduced-motion
  respected by the library. Plain CSS handles the rest (press feedback, rise
  transitions) because one motion language beats two.
- **What lost:** GSAP (powerful, but imperative DOM choreography is wrong for
  React screens); CSS-only gestures (hand-rolled touch math was the exact
  "AI-coded weakness" the user called out).

### 7. Text size: root font-size scaling — over per-element bumps or a zoom toggle
This is the decision the user specifically asked to see justified:
- **Why it won:** the setting (Hub → Settings → Standard/Large/Larger) scales
  the **root font size**; because every text size in the app is in rem, the
  whole UI grows *in proportion*. Nothing can clip or overlap because the
  layout was already fluid — a per-element bump (e.g. raising every
  `text-[15px]` to 18px) hard-codes new sizes into fixed layouts and breaks
  rows; a browser zoom toggle also resizes images and touch targets (making
  rows tappable at the wrong size) and can't be shipped as an in-app choice.
- **The guarantee that makes it safe:** new screens must keep type in
  rem/`text-*` classes — never fixed px — or they silently opt out of
  accessibility. This is a written rule in [design.md](design.md).
- **Verified:** every page was audited at 390px width with Larger on; the two
  overflows found (a non-wrapping hint span, an undefined `sr-only`) were
  fixed and re-audited to zero.

### 8. State today: localStorage stores + mock-data file — over building an API too early
- **Why it won:** the frontend had to be *provable* before the backend existed;
  the store functions (`getHomework`, `toggleDone`, `addHomework`) are written
  so their signatures become database calls with no screen changes. Teacher
  posts already flow into the family board through this seam.
- **What lost:** Redux/Zustand (global state we don't need — each screen reads
  one store); building the API first (the old portal's mistake in mirror image:
  infrastructure without a proven surface).

---

## UI/UX decisions

### 9. Four-tab navigation with a tree Hub — over a drawer, a dashboard grid, or more tabs
- **Why it won:** the four daily jobs (Today, Homework, [News], Timetable) get
  one tap each, permanently visible; everything else is grouped by *need* in
  the Hub (About me / From the school / School life / Reference / Settings).
  A hamburger drawer hides destinations (friction without organization); a
  dashboard grid is where choices go to compete (the pre-Hub 10-tile wall).
- **The evidence:** the student survey's "difficult to navigate" and the
  teacher pattern of "too many taps" — plus Higgs Law (goals.md principle 11).

### 10. News and Events are separate tabs — over one combined feed
- **Why it won:** news (what's new, read-once) and events (what's coming,
  date-anchored, add-to-calendar) are different *jobs* with different
  interactions. Merging them forces every visit through an irrelevant half —
  the friction the user asked us to remove. The Hub still cross-links both
  with live "new this week" counts so you never wonder where something lives.
- **What lost:** one fewer scroll for people who want everything at once —
  served instead by the Today screen, which shows the *top* of both.

### 11. Today shows sections, not tiles — over a widget grid
- **Why it won:** open the app and read top-to-bottom: overdue (pinned),
  due today, latest news, coming up. Zero taps to the most important
  information; each section links to its tab so nothing is a dead end.
- **Plain words rule (added from user review):** the UI never explains
  itself with design jargon — no "one tap away", "tree", "in two taps".
  Buttons say what they do ("Post homework"), not how clever the layout is
  ("in 30 seconds"). The jargon lives in the docs, where it belongs.

### 12. One decision per screen (Higgs Law) — over showing all options
- **Why it won:** fewer visible choices measurably reduces hesitation; the
  Welcome flow (one primary door, the alternative quiet), results (featured
  exam first, everything else below), and absence (reason chips with a photo
  as the only other decision) all follow it. See goals.md principle 11.

### 13. Preview honesty: "design preview — sample data" labels — over faking realness
- **Why it won:** the old portal lost trust by *looking* done while broken.
  Every mock-backed screen says what it is. When the vault connects, the
  labels come off — and the trust never had to be rebuilt.

### 14. View-only family app; tools live behind roles — over one screen for everyone
- **Why it won:** children and parents get read/act screens with nothing to
  configure or break; teacher tools exist under `/teacher/*` only for teacher
  profiles — with their **own chrome** (own tab bar, own home, teacher-green
  header) rather than family tabs plus a hidden group, because a teacher's
  app should look like a teacher's app. Classes come **from the account**:
  the office assigns them at year start (`teacher_classes` in the schema) and
  the app personalizes itself — nothing is picked at sign-in, and a new year
  re-personalizes everyone. One codebase, one design system, role-based
  doors — the same mechanism the database's RLS uses, so frontend visibility
  and backend permission agree.

### 15. Progress stamped and dated; averages state their basis — over pretty numbers
- **Why it won:** the old portal's silent staleness (progress report never
  updated) and wrong averages (A3000 and un-enrolled subjects in the math) are
  trust failures. Every average says what it includes; every report shows its
  issue date. Honesty is a feature, not a disclaimer.

### 16. Study Center: link-out, never embed — over in-app players or a link dump
- **Why it won:** embedded YouTube/Kahoot players are the old portal's
  breakage pattern — a third party changes their site and our page breaks with
  it. EduBridge stores the *pointer* and opens the destination in a new tab:
  the worst case is a stale link, never a broken screen. The link is optional
  (share the recommendation now, attach the URL later — the card honestly
  says "link coming"), and compose validates by parsing alone (shows the
  domain it will open), so the teacher's screen can never hang on a paste.
  What lost: in-app embeds (breakage, plus autoplay/microtransaction dark
  patterns we don't control) and an unfiltered link list (drowning students
  in everything defeats the point — chips and recency do the curating).

### 17. Appearance lives in a real Settings page; legal sits quietly at the Hub's foot — over tiles for everything
- **Why it won:** the Hub answers "where do I find things?", Settings answers
  "how do I make it mine?" — different questions, different surfaces. Colour
  (five accent palettes, not just green), brightness (light/dark/automatic,
  following the OS), and text size are user choices that belong together on
  one page; the signed-in-as card there is also the preview's honest door into
  the teacher app. Privacy and Terms are reference reading, not destinations —
  demoting them to quiet links at the Hub's foot (plus the tab-bar footer)
  keeps them findable without spending tile real estate. Everything coloured
  goes through CSS custom-property tokens, so a theme change is one class on
  `<html>` restored before first paint — no flash, no per-element overrides.
  What lost: a Settings tile inside the Hub (buried a whole surface under a
  tile) and hard-coded palette colours in components (made dark mode and
  accent choices impossible to retrofit cheaply).

### 18. Dark colours lift, they don't inherit — and page wallpaper is one opt-in layer — over hard-coded hexes
- **Why it won:** dark mode isn't a filter over the light palette — iOS lifts
  every system colour a step brighter on near-black, and we now follow: the
  overdue red reads as systemRed-dark (#FF453A family, softened), the accent
  gains a bright tint for labels on dark surfaces (with dark text on amber, as
  iOS does for yellow), and every palette states its own dark values in one
  place (globals.css). The old brick red (#b3382e) read muddy on charcoal —
  exactly the "weird red" the user flagged. Three more palettes (teal,
  indigo, rose) fill out the picker for the eight-strong row. The SubjectChip
  tan and one hover pill were the last hard-coded hexes — both now go through
  `--chip` tokens. Selected swatches show a plain white checkmark (the ring +
  inner dot read as two competing signals); overdue marks carry an alarm-clock
  glyph, not just a red word.
- **Page backdrops:** the faint graph-paper + stationery-glyph wallpaper
  (PageBackdrop) is one component and one CSS block, opt-in per page with a
  motif name, token-coloured so palettes and dark mode tint it for free,
  aria-hidden with no pointer events, fading out after the first screenful so
  it never fights the content. Nine pages use it — Today and the Hub included,
  after review showed the wallpaper reads as the app's fabric, not noise
  (Today's motif mixes the school-day tools; the Hub's doodles are its own
  destination glyphs). Settings and the legal pages stay clean: the control
  room and the fine print don't decorate.
- **What lost:** reusing light colours at reduced opacity for dark mode (the
  muddy-red trap, again); scattering doodles as per-page JSX (n palettes of
  drift, unmaintainable); embedding the motif inside Shell (pages couldn't
  choose — and teacher routes would need a fork).

### 19. One list language: boxed grouped lists everywhere — over mixed open and boxed rows
- **Why it won:** the user's review caught it precisely — Events lived in a box,
  News floated as open text with hairlines, and the mix read as unfinished, not
  designed. The dominant pattern (Homework, Events, Results, attendance, teacher
  lists) won: **one rounded paper box per group, hairline dividers inside**.
  Within the language, surfaces earn variety by *content*, not structure — Events
  date chips fill with the accent-soft tint, the Study Center Hub tile shows the
  kind-glyphs it contains. A progress bar is **content, not chrome** — it
  appears where the done-vs-total ratio is the information (Attendance), never
  as decoration under a header whose numbers already say it (Today, Homework).
  Toasts pin the rule: one fixed charcoal surface in both modes — adaptive
  inverse-pair surfaces (`bg-foreground`) with hard-coded text is exactly the
  dark-mode contrast bug class this app already outlawed.
- **What lost:** the open editorial rows for News (read nicely, but made the app
  feel like two products stitched together); per-page inventiveness with list
  structure (invent inside the box — chips, glyphs, bars — never with the box).
- **News and Results follow the same demotion principle** (review #3): letters
  collapse behind a two-line preview and open in place, grouped by how old they
  are, because "what's new since I looked?" beats an archive order; Results
  headline the average (with its stated basis) and demote the eight subject
  marks behind one tap, because one number answers "how did the term go?" and
  the wall of marks answered nothing. Grade letters (A/F chips) were dropped
  entirely — to an 11-year-old they read as favicons, and the mark plus the
  pass line carry the same meaning without the hieroglyphs.

---

*Where a decision isn't listed, it's small enough to change without a meeting —
this log exists so the big ones don't get re-litigated or quietly reversed.*
