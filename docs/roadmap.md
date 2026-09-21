# EduBridge — Roadmap

*The plan from here to a school-wide platform: what happens when, what gates it,
how all the apps stay connected, and what it will cost. Written to be shown to
teachers and school staff. Companion docs: [goals.md](goals.md) ·
[security-plan.md](security-plan.md) · [features.md](features.md).*

---

## Where we are today

The **family app** (students + parents) is fully designed and working on sample
data: Today, Homework, Timetable, Events, Circulars, the Hub (absence notes with
photo attach, holidays), and a first-run welcome + class setup. Security headers
are live and the full plan for protecting student data is written
([security-plan.md](security-plan.md)).

What it does **not** yet have — by design, not by accident:

- A real database (everything is sample data)
- Real sign-in (the welcome flow is a preview of the real one)
- The teacher and admin apps

Those are the next three chapters, gated by interviews and testing, below.

---

## Stage 1 — Interview everyone first (next week)

**Nothing gets built for teachers or admins until they have told us what is
actually wrong with the tools they use today.** This is the same discipline that
shaped the family app — the friction log came before the code — and it is what
keeps EduBridge from becoming Clobas 2.0.

### Teacher interviews (all teachers)

Ask about their current week, not about features:

- How do you tell your class about homework today? How long does that take?
- What happens when a student says "you never posted that"?
- How do you find out if anyone read your announcement?
- What do you do the night before a test to remind the class?
- If posting took under 30 seconds from your phone, what would you post more of?

### Admin interviews (office staff, coordinators)

- How do circulars go out today? Who chases parents who didn't read them?
- How do parents currently tell you a child is sick? What happens to the note?
- What reports do you prepare by hand every week?
- When a family joins mid-year, how many systems must be updated?

**The rule:** every finding becomes a named problem ("teachers spend ~10 minutes
per homework post across app + WhatsApp"), and every feature in the teacher/admin
apps must trace back to one. No problem, no feature.

**Output:** `docs/teacher-interviews.md` and `docs/admin-interviews.md` — one
page each: the problems, how many people named them, and the feature each one
justifies.

---

## Stage 2 — The real backend (while interviews happen)

The backend is one shared vault that **every** app reads and writes. Building it
now means the teacher app has data to post into on day one.

- **Supabase** (Postgres): classes, homework, events, circulars, absence notes,
  profiles, read receipts
- **Sign-in:** Google, restricted to `@oakbridge.edu.my`, plus issued
  username/password for younger students
- **Row-Level Security on every table** — exactly the policies in
  [security-plan.md](security-plan.md) — students see own class, teachers write
  own classes, admins all; verified by adversarial tests (a student account
  trying to read another class must fail)
- **The API the future apps share:** the teacher app, admin app and any mobile
  app will call the same database and rules — there is nothing "extra" to build
  per app, which is the whole point of one vault
- **Hardening recipes pre-written:** RLS SQL, auth flow, caching, async job
  queue, secrets gate, load-test ladder —
  [production-hardening.md](production-hardening.md)

**Gate:** the adversarial security tests pass before any real user signs in.

**Legal, before Stage 3:** the in-app **Privacy & terms** page (plain language,
honest about what is stored) is reviewed against the school's own policies, and
a real contact route is named before the first parent account exists. The page
lives at `/privacy` and says plainly what changes when the database arrives.

---

## Stage 3 — Deploy the family app (first real users)

- Vercel, free Hobby plan, tied to the GitHub repo — every push updates the site
- Custom domain if the school provides one
- Pilot with **one class** and its teacher; measure the two numbers that matter:
  - % of the class opening the app each day
  - % of homework items ticked off before their due date

**Gate:** one class uses it daily for two weeks without Ian being a human
helpline.

---

## Stage 4 — Build the teacher app, from the interview findings

Same design language, same database, separate app. Expected shape (subject to
Stage 1 findings):

- **The 30-second post** — pick class, type, tap. Due-date chips (Today /
  Tomorrow / Pick date) instead of calendar forms
- **Read receipts** — "seen by 18/24" on every announcement
- **"Repeat last week"** — recurring homework in one tap
- **Absence notes inbox** — notes and medical certificates land with the class
  teacher; office sees all

**Gate:** a teacher posts real homework in under 30 seconds, unaided, on their
first try.

---

## Stage 5 — Build the admin app, from the admin interviews

Expected shape (subject to Stage 1 findings):

- Circular composer with **per-family read receipts** and re-send reminders to
  those who haven't read
- Absence overview: who is away today, by class, with certificates attached
- Account and class management: issue passwords, link parents to children,
  move students between classes at year-end

**Gate:** the office sends a circular and can see exactly which families haven't
read it, without touching WhatsApp.

---

## Stage 6 — Mobile apps

The website already behaves like an app on a phone. Native comes when the school
confirms it's wanted, using **Expo / React Native** — the same TypeScript code,
same design tokens, same shared vault, so it's skins on the same body, not a
rewrite. iOS + Android from one codebase; absence-note photos open the camera
natively; push notifications replace the evening-before reminder's last mile.

---

## How all the apps stay in one place

One vault, three skins, zero syncing:

```
                    ┌──────────────────────┐
                    │   Supabase (vault)   │
                    │  one database, one   │
                    │  set of rules        │
                    └──────────┬───────────┘
              read/write under role rules  │
        ┌──────────────────┼──────────────────────┐
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│  Family app   │  │  Teacher app   │  │   Admin app   │
│ students +    │  │ posts, read    │  │ circulars,    │
│ parents       │  │ receipts       │  │ accounts      │
└───────────────┘  └────────────────┘  └───────────────┘
        web + mobile       web + mobile       web (desktop-first)
```

- **One database.** A teacher posts homework once; it appears for students
  instantly. Nothing is ever copied or synced.
- **One set of rules.** Row-Level Security lives in the vault, not in the apps —
  so nobody can "fix" access from inside an app.
- **One design system.** Shared tokens, fonts, and components across all three
  apps (already proven by the family app's code).
- **One repository, three folders.** `web/` (family), `teacher/`, `admin/` —
  shared packages for the design system and API types, so a post type defined
  once is correct everywhere.
- **One deployment pipeline.** Push to GitHub → all apps deploy together.

---

## What it will cost

Real numbers, current pricing (checked September 2026). The school's size —
hundreds of students, roughly 24 per class — keeps this firmly in the cheap
tiers.

### The stack and its plans

| Service | Job | Plan at launch | Cost |
|---|---|---|---|
| **Vercel** | hosts the website(s) | Hobby (free) | **$0/mo** |
| **Supabase** | database, sign-in, file storage | Free tier | **$0/mo** |
| **GitHub** | code, history, CI | Free | **$0/mo** |
| **Domain** | `edubridge.school` style address | — | ~$12/yr |

**Launch cost: about $1/month.** Free tiers carry the pilot comfortably:
Supabase Free includes 50,000 monthly active users, 500 MB database and 1 GB
files — a pilot class uses a rounding error of that.

### When the school adopts it school-wide

| Service | Plan | Cost | Why |
|---|---|---|---|
| Supabase | **Pro** | **$25/mo** | 100,000 MAUs included (a full school is ~1,000 incl. parents), 8 GB database, 100 GB files — enough for **years** of absence-note photos |
| Vercel | **Pro** | **$20/seat/mo** | 1 TB bandwidth, team access, preview deploys; a few seats ≈ **$40–60/mo** |
| Domain | — | ~$12/yr | unchanged |

**School-wide total: roughly $65–90/month** — and that's the ceiling for a long
time. The honest caveat: paid Supabase compute runs ~$10/mo at small size; if
the school grows into thousands of active users *per day*, add compute. But
school apps idle at night and weekends; this size school won't outgrow the
small compute for years.

### Why "three plans" was the right worry

The worry was correct in spirit — multi-app platforms *can* get expensive — but
the architecture is what keeps costs flat: **three apps, one backend**. We pay
for the vault once, not per app. Costs grow with *users*, not with *apps*.

### The genuinely free path

If budget is zero, the pilot can run on free tiers indefinitely (Supabase free
tier has no time limit; it pauses projects after 1 week of inactivity — and a
school in session never idles a week). School-wide on free tiers is possible
but unwise: Pro's nightly backups are what you want before 1,000 children's
data lives in the vault.

---

## Testing: how we make sure it works before students touch it

Each stage ends with a gate, and the whole platform passes **rigorous testing**
in layers:

- **Automated:** every push runs typecheck, lint, and the security tests
  (adversarial row-level-security probes: cross-class reads must fail)
- **Manual pilot scripts:** for each app, a written script a teacher or student
  can follow: "post homework, tick it, verify the parent view" — pass required
  before each stage's gate
- **The 8–60 rule on real people:** each release is used by an 8-year-old, a
  60-year-old and a teacher before it ships
- **Real-device check:** before the pilot, run the app on an actual iPhone
  (Safari + Add to Home Screen) and an Android phone, per the checklist in
  [platform.md](platform.md); Lighthouse mobile ≥ 90 on the deployed site
- **Load reality-check:** before school-wide launch, a scripted simulation of
  500 users refreshing at 7:00 AM (the real morning spike); free/pro tiers
  handle this comfortably, but we prove it, not assume it
- **Rollback:** every deploy is reversible in one click (Vercel instant
  rollback), and nightly backups start with the Supabase Pro plan

---

## The one-page version

1. **Next week:** interview every teacher and the admins. No features before
   findings.
2. **In parallel:** build the shared vault (Supabase) with the security plan's
   rules; pass adversarial tests.
3. **Then:** deploy the family app to one pilot class.
4. **Then:** teacher app — built only from interview findings, gated on the
   30-second post.
5. **Then:** admin app — circulars with read receipts, absence overview.
6. **Mobile:** Expo shells over the same vault when the school confirms.
7. **Cost:** ~$0 pilot → **~$65–90/mo school-wide**. Three apps, one vault;
   costs scale with users, not apps.
