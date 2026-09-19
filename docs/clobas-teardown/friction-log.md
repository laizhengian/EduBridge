# Clobas Portal — Friction Log

### Section-by-section: why the current portal is hard to use
*Every point below is observable on screen (screenshot referenced) or is direct testimony from a daily student user. Written as bullets so it can be reviewed in 5 minutes.*

---

## The one-line summary
> The portal makes you **search for data the app already has**, hides daily essentials **3 clicks deep**, shows **empty modules**, gets details **wrong** (invalid dates, mislabeled pages, random colors), **miscounts absences** — and a recent "AI update" shipped **without changing the data underneath** — so nobody trusts it and nobody uses it.

---

## 1. Homework — the most important feature, the most friction
Evidence: `screenshots/08-homework-search-form.png`

- Page is titled **"STUDENT HOMEWORK DETAILS"** — not homework. The banner image says **"ATTENDANCE"** (wrong page banner, reused stock art).
- To see your own homework you must first fill a **search form**: Subject → Status → Due Date.
  - Subject dropdown: a **long, tiny-font list** of every subject — including non-subjects like **Break** and **Lunch**.
  - Status dropdown: jargon values ("Need Correction"...).
  - Due Date: **manual calendar picker** (month + year arrows, one click per field).
- Only **after** submitting the form do you get results. Wrong/empty filters = "no homework" — the app can *hide* your homework from you.
- Student testimony (daily user): *"You need to choose from a super long, super small list of subjects, status, due date manually in a calendar — too much friction."*
- **Cost:** checking homework takes ~6 inputs across 3 fields; students give up and ask friends instead.
- **What good looks like:** open tab → see **everything still owed**, sorted by due date, overdue pinned at top. Zero form fields. Filters exist but never block the default view.

## 2. Time Table — static data behind a query form
Evidence: `screenshots/01-timetable-search-form.png`

- Requires 3 required fields before showing anything: **Academic Year** (dropdown), **TimeTableType** (dropdown: "Lower Secondary G 6-8 2026"), **Duration** (date-range picker).
- The timetable is **static for months** — there is nothing to query. The form exists only because the page is built as a "report", not a screen.
- Weekly grid itself is fine (Day/Time columns, subject legend with faculty) — the only section that survives contact with reality, once you get past the form.
- **Cost:** every timetable check starts with a pointless form; on a phone the tiny dropdowns are unusable.
- **What good looks like:** open → **this week's grid immediately**. No fields. Maybe a term-switcher if terms change.

## 3. Attendance — empty by default
Evidence: `screenshots/03-attendance-search-form.png`

- "ATTENDANCE DETAILS" requires **Start Date + End Date** before showing anything; default state is an **empty box**.
- Radio buttons "Dates / Months" — two modes to learn for a simple question: *"was I marked present today?"*
- **Cost:** the #1 attendance question (today) is the hardest to answer.
- **What good looks like:** today's status first; history below it.

## 4. Home dashboard — everything except what you need
Evidence: `screenshots/02-home-dashboard.png`

- Modules: Flash News, **Best Performers (empty)**, Virtual Notice Board, Today's Birthday, Thought of the Week, K-Links.
- **Homework is not on the home page at all** — it lives 3 taps deep (LMS Module → Homework → fill form).
- "Best Performers" ships **empty**. "Thought of the Week" shows **"No data found"**.
- **Today's Birthday** shows a Grade-2 student's **photo, name, grade** to the whole school — a privacy problem.
- "Theme: Brown → Save as my Theme" — effort spent on themes while core data is behind forms.
- Footer "Today's Quote" is **cut off mid-sentence** ("You have to dream before yo...").
- **Cost:** the daily landing page is decoration; the daily job (homework, circulars) is elsewhere.
- **What good looks like:** home = **today**: homework due, new circulars, next event. Nothing else.

## 5. E-Circulars — the critical channel, in a broken table
Evidence: `screenshots/06-ecircular-detail.png` (+ related shots in folder)

- One circular displays its date as **"00/08/2026"** — an impossible date, shipped to production.
- Full letter text (Dear Parents...) crammed into **table cells**; no document layout, no attachments model.
- Circulars are the school's **only official channel** — and they arrive in a raw data table.
- **Cost:** parents/students skim or miss circulars; school then re-sends via WhatsApp anyway.
- **What good looks like:** a clean **feed**: title, date, body, attachment, "new since last visit" marker.

## 6. Results — colors that lie
Evidence: `screenshots/06-results-color-rows.png`

- Rows are colored **pink with no legend**. Pink normally means "fail" — but Chemistry **98/100** and Biology **93/100** are pink, Mathematics **100/100** is white. The colors mean nothing.
- "Select an Exam": 11 pills (Assessment 1–7, Project 1–3, Mid Term) — you re-query for every exam instead of seeing the term.
- Marks table itself is fine (Subject, Secured/Max, Pass Marks) — the data is good, the presentation undermines it.
- Teacher's comment box: genuinely good — keep this.
- **Cost:** parents see pink and panic; students learn to ignore the colors → signal lost.
- **What good looks like:** one subject-by-term view, color only for **below pass mark**, legend if any color is used.

## 7. Teacher Notes — a library nobody writes to
Evidence: `screenshots/05-teacher-notes-search-empty.png`

- "DOWNLOAD NOTES" demands **Teacher Name, Notes Title, Description, Start Date, End Date** — five fields to find a file.
- Default result: **empty table**.
- Student testimony: **nobody uses it — teachers don't post notes.**
- **Cost:** a dead module that still occupies nav space and implies a promise the school can't keep.
- **What good looks like:** either curate it (teacher posts in 2 taps) or remove it. An empty feature is worse than no feature.

## 8. K-Links — an entire menu item for one video
Evidence: `screenshots/04-klinks-single-video.png`

- "K-LINKS" contains **exactly one YouTube link** (Cornell Notes method, 175 views).
- **Cost:** top-level nav real estate for one link.
- **What good looks like:** a "Resources" list that can grow, or a link inside a relevant subject page.

## 9. Feedback — a hidden absence-reporting channel
Evidence: Feedback History shots (9 entries, all sick-leave notes) in folder

- The "Feedback" tab is actually **how parents report absence** — sick-leave notes typed into form fields.
- The label says one thing, the usage is another; new parents can't discover it (it's undocumented outside the 46-page manual).
- **Cost:** absence reporting — a daily administrative need — is camouflaged as a suggestion box.
- **What good looks like:** an explicit **"Report absence"** action with date + reason + confirmation.

## 10. Photo Gallery — empty shell
Evidence: `screenshots/07-photo-gallery-empty.png`

- Full page, banner art, and the instruction *"Kindly Click on photo to view Photos"* — followed by **zero photos**.
- **Cost:** another dead module eroding trust ("does anyone run this?").
- **What good looks like:** ship empty states that say *why* it's empty and what will appear — or don't ship the module.

## 11. Hotline — a phone book with empty columns
Evidence: Hotline shots in folder

- 5 phone numbers; the **"Details" column is empty** for every row; typo **"Senoir floor"**.
- **Cost:** the emergency-contact page looks unproofed.
- **What good looks like:** name, role, extension, working hours — proofread.

## 12. Calendar & Holidays — color-coded with no legend
Evidence: View Calendar shots in folder

- Calendar events are color-coded; **the legend doesn't exist** — the colors are unexplainable.
- **What good looks like:** legend attached to the calendar, events tappable in one tap.

## 13. Onboarding by PDF manual
Evidence: `User Manual Parent` menu item (46-page document)

- A **46-page manual** is required learning for a parent portal. That is the clearest possible signal the UI doesn't explain itself.
- **What good looks like:** zero-document onboarding: if a screen needs a manual, the screen is wrong.

---

## 14. Attendance — every absence counts the same

*Direct testimony from a daily student user (Sept 2026), consistent with the screenshot in section 3.*

- The attendance summary **counts every absence as "absent"**. An absence with a
  medical certificate on file counts exactly the same as a skip.
- There is **no excused/unexcused distinction anywhere** in the summary — the one
  number parents and teachers argue about is wrong by construction.
- **What good looks like:** "3 days away — all with a proper reason on file" is a
  different sentence from "3 unexplained absences", and the app should say which
  one is true. EduBridge's preview separates them and says it in plain words.

## 15. ECA attendance — a roll call nobody can read

*Direct testimony from a daily student user (Sept 2026).*

- Extracurricular attendance is listed **per date**. To see how your club is
  going you must **pick the exact date** of one session — the app will not group
  sessions under the activity they belong to.
- Different activities (Robotics, Choir, sports fixtures) are **mixed into one
  date list**, so "ECA attendance" answers a question nobody asked.
- The **period/activity selector buttons don't work at all** — tapping them does
  nothing, shipped like that.
- **What good looks like:** one card per activity, its weekday, and every session
  with attended/not + the reason. EduBridge's preview is built exactly that way.

## 16. Exam marks & the "AI update" that changed nothing

*Direct testimony from a daily student user (Sept 2026).*

- Exam marks are synced from **"A3000"** and parents report them as unreliable —
  wrong or stale numbers surface with no way to question them in-app.
- The **"Student Progress Report" is not updated** — it shows the same content as
  before the school's recent portal update. The portal was recently **"updated
  with AI"** and the report is **still the previous app's text**.
- That is the sharpest possible proof of the pattern in this log: the surface was
  refreshed, **the data layer was not touched**, and nothing flagged the staleness.
- **What good looks like:** every report **stamped with its issue date** and an
  up-to-date marker — so a stale report is visible at a glance instead of silent.
  (EduBridge's preview does exactly this; see `/results`.)

## 17. The pattern confirmed: surface polish, zero quality control

*New testimony, Sept 2026 — after the portal's "AI update".*

The portal now looks modern on the surface, but **one second of real use breaks
it**: buttons that do nothing (section 15), a summary that miscounts (section
14), a report that never updated (section 16), on top of the shipped defects
already documented above (impossible dates, wrong banners, empty Details
columns, "Senoir"). This is what software built and shipped **without anyone
walking through the daily tasks** looks like — generation is not the same thing
as quality control.

The standard this replacement commits to: **every screen is walked through the
real task before it ships**, and the honest label "design preview — sample data"
sits on every screen until real data arrives. An app that lies about being done
is worse than one that says it isn't.

## 18. Feature inventory — what the portal offers, and what it does with it

*Every module the portal advertises, with its actual state (evidence above +
daily-user testimony) and what the EduBridge preview does instead.*

| Feature the portal advertises | State in the portal today | In the EduBridge preview |
|---|---|---|
| Attendance tracker | All absences counted alike; excused/medical not separated; behind a date-range form | Today's status first; excused counted separately, in plain words (`/attendance`) |
| Exam results | Rows colored pink on 98/100; marks reported unreliable (A3000); 11 exam pills to re-query | One exam at a glance, change-since-last, color only below pass mark, legend stated (`/results`) |
| Student progress report | Not updated — same content as before the recent "AI update" | Issued date stamped on the report + "up to date" marker (`/results`) |
| ECA / extracurricular attendance | Per-date list, exact date required, activities conflated; selector buttons don't work | One card per activity, weekday, per-session ✓/✗ with reasons (`/attendance`) |
| Student timetable | Fine grid behind a 3-field query form | Opens showing this week, today preselected (`/timetable`) |
| Homework notes | Search form (subject/status/date) to see your own homework; notes module dead | Opens showing everything owed, sorted, one-tap CSV export (`/homework`) |
| Latest news (Flash News) | On the dashboard among empty modules | Circulars feed with poster + time, one name (`/circulars`) |
| E-circulars | Impossible dates (00/08/2026), letter text in table cells | Clean feed, valid dates, poster and time on every item (`/circulars`) |
| Hotlines | 5 numbers, empty Details column, "Senoir" typo | Role, working hours, tap-to-call on every row (`/hotlines`) |
| Student feedback | Actually the hidden absence-reporting form | An explicit "Tell the school I'm away" flow with photo attach (`/absence`) |
| Photo gallery | Empty page, zero photos | Real albums with covers and tap-to-open grids (`/life`) — content ships, never an empty shell |
| Events calendar | Color-coded with no legend | Legend chips on every list, one-tap .ics export (`/events`, Hub) |
| Competitions / past events | No module at all | Archive with results and a slot ready for highlight videos (`/life`) |
| FAQ / manual | 46-page PDF manual required learning | In-app plain-language FAQ; zero documents (`/faq`) |
| Campus info / YouTube (K-Links) | One lone video in a top-level menu | Part of School life, with room to grow (`/life`) |
| Privacy | A child's photo & birthday broadcast school-wide | Plain-language privacy & terms page; minimum data (`/privacy`) |


- **Search-first design.** Timetable, Attendance, Homework, Teacher Notes, Results — all demand form-filling before showing data the app already holds. The user does the querying; the app behaves like a database console.
- **Buried daily essentials.** Homework (the daily job) is 3 taps + a form from the home page.
- **Empty shipped modules.** Best Performers, Thought of the Week, Photo Gallery, Teacher Notes, K-Links(≈) — five modules with no or near-no content.
- **Detail rot = trust rot.** "00/08/2026", wrong banners/titles, truncated quote, "Senoir", meaningless colors, ©2020 vs ©2026. Each is small; together they say *nobody is home*.
- **Desktop-only thinking.** Tiny dropdowns, hover menus, no touch targets — on the phones students actually use, this is unusable.
- **Privacy blind spots.** A child's photo/birthday broadcast to all users.
- **Manual-required UX.** 46-page PDF = the UI confessing it isn't self-explanatory.

## Design rules this log commits us to (full list in `../ux-teardown.md`)

1. **No data vanishes because a day passed** — show state (owed/overdue/done/upcoming), never recency-only.
2. **Zero forms to see your own data** — filters refine; they never gate.
3. **≤ 2 taps** from home to homework, timetable, circulars, today's attendance.
4. **Every item shows who posted it and when** — staleness visible, not hidden.
5. **Ship nothing empty** — no module without content or a real plan for content.
6. **Color only when it means something** — and always with a legend.
7. **Details are trust** — dates validate, titles match content, zero typos on official pages.
8. **Mobile is the primary surface** — big targets, no hover menus, works on weak Wi-Fi.

---

*Sources: 20 screenshots collected 16 Sep 2026 (`screenshots/`, 8 named + additional shots), plus direct testimony from a daily student user. Compiled as the requirements baseline for the replacement portal.*
