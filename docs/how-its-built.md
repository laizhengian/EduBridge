# How the EduBridge app is built — the plain version

*No tech jargon in this document. If you can use a smartphone, you can read this.
Written for teachers, parents, and school staff who want to understand what they're being asked to trust.*

---

## The one-paragraph answer

The app is a **website that behaves like a phone app**. Families open it in the browser —
no app store, no installing, no updating. It shows homework, the class timetable, school
events, and letters from the office. Everything is saved in a **secure online vault** for the
school's data, so a teacher can post homework from a laptop and every student sees it
instantly on any device. When the time comes, this exact app gets wrapped into a proper
Android and iPhone app too — same app, same information, nothing rebuilt.

There are **two apps, one design**: this one for families (view-only — read, tick off,
add to calendar), and a separate companion app for teachers and office staff, used to
post homework, letters, and announcements. A post in the teacher app appears in this
app immediately — both apps read from the same vault, so there is nothing to sync.

---

## The four building blocks

### 1. The screen you look at — "the front"

What you see and tap: today's homework, the timetable, the event list.
Built with the same everyday technology that most modern websites use, which means:

- It **looks right on any screen** — a small phone, a big monitor, anything in between
- It **works by touch or mouse**, for an 8-year-old and for a teacher of 60
- Pages are **sent ready-made**, so they appear quickly even on slow school Wi-Fi
  and older phones

### 2. The online vault — "the database"

Every homework item, event, and letter lives in one secure, organised storage place online
(run by a company called Supabase, used by schools and startups worldwide):

- **A teacher posts once → everyone sees it** on phone, laptop, tablet — no re-typing
- **Students only ever see their own class.** The vault itself enforces this — it's a
  locked rule of the storage, not a promise from our code
- **It keeps backups automatically**, so nothing is lost if a device dies
- **Sign-in is the school Google account** — the app only accepts `@oakbridge.edu.my`
  addresses, so everyone is a real student, teacher, or parent

### 3. The free home — "hosting"

The app lives on Vercel, a hosting service with a generous free tier used by millions of
websites. What that means for the school:

- **No servers to buy or look after.** Nothing at the school to plug in or restart
- **No cost while we pilot** — the free tier comfortably covers a whole school
- **Updates appear seconds after they're made**, and if an update ever misbehaves,
  we can roll back to yesterday's version in one click

### 4. The pocket app — "coming later"

The exact same app, wrapped into a real Android and iPhone app with a tool called
Capacitor. Families download it from the app store like any other app. Because it's the
same app underneath:

- **A teacher never posts twice.** One post appears on the website and in the app
- **No feature ever drifts apart** between phone and web versions

---

## What we deliberately did NOT build (and why)

The old portal had 60+ features, and most sat empty and unloved. This app starts small and
deep instead of wide and shallow:

- **No fees module, no bus tracking, no photo gallery, no admissions** — the old portal
  had all of these; screenshots of them sitting broken are in our evidence folder
- **No chat** — WhatsApp already does this; we'd only add a worse version
- **No points, streaks, or leaderboards** — the old portal's "Best Performers" box was
  permanently empty. We build habits with reminders and clarity, not rewards

Every feature that IS in the app has a named reason for existing — see `features.md`.

---

## How your data is protected

- Each student sees **only their own class's** homework, letters, and events — enforced
  by the storage vault itself, at the deepest level, not just the visible screen
- **Only school Google accounts work** — no strangers, no new passwords to forget
- The vault **backups automatically** every day
- **No ads, no trackers, no selling data** — the app is built for one school only

---

## What happens if something breaks

- The hosting and the vault are **professionally managed** — the companies fix their own
  outages, 24/7, no school IT effort needed
- If school Wi-Fi dies, **the app still shows the last information it loaded**, with a
  note of when it was last updated
- Every change to the app is **recorded and reversible** — if an update causes a problem,
  the previous version comes back in one click
- One person with a laptop (the project maintainer) can fix and ship most issues the
  same day — there is no vendor ticket queue, no support line, no waiting

---

## The short table for the slide deck

| Question | Answer |
|---|---|
| What is it? | A website that works like a phone app |
| Where does the information live? | A secure online vault with automatic backups (Supabase) |
| Who can see what? | Only your own class; only school Google accounts get in |
| What does the school need to run it? | Nothing — no servers, no IT staff, no cost during the pilot |
| Phones too? | Yes — the same app wrapped for Android and iPhone later, with no rebuild |
| Why so few features? | Fewer, deeper features that actually get used beat 60 that don't |
