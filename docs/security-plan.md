# EduBridge — Security Plan

*How we keep this school app safe for students, teachers, administrators, and their data.
This plan turns [vibe-coded-app-security-checklist.md](vibe-coded-app-security-checklist.md)
into concrete decisions for EduBridge — web now, mobile later.*

---

## Who uses EduBridge, and what can they do?

Three roles. One account holds exactly one role. The role decides everything a person
can see and do — this is called **role-based access control**, and it is enforced by the
server, never by the app screen.

| | Student | Parent | Teacher | Admin |
|---|---|---|---|---|
| Read homework, timetable, events, circulars | own class | own child's class | own classes | all |
| Tick homework done | own only | — | — | — |
| Post homework / events / circulars | — | — | own classes | all |
| Send absence note | own | own child | — | — |
| See who read an announcement | — | — | own classes | all |
| Create accounts, issue passwords, manage classes | — | — | — | only |

**Three hard rules behind that table:**

- **Deny by default.** Everything is private until a rule says otherwise.
- **The server decides, every time.** If a student edits the app to ask for another
  class's homework, the server refuses. Hiding it on screen is not security.
- **One person, one role.** Roles live in the database, assigned by an admin — never
  chosen by the user at sign-up.

**Email allowlist.** Sign-in accepts only verified school addresses
(`@oakbridge.edu.my`). Teacher and admin roles require an admin to grant them; a Google
account alone never confers authority.

---

## What is different because this is a school?

Children's data. That changes the bar.

- **Collect the minimum.** Name, class, school email. No birth dates, no phone numbers,
  no photos of children, no location. If a field has no job, it does not exist.
- **Parents see their own child only** — set by the admin linking accounts, enforced by
  row-level rules, never by a dropdown the user could lie to.
- **Absence-note photos (medical certificates) are sensitive.** Only the class teacher
  and office may open them; they expire (auto-delete after the school term); students
  can delete their own; they are never shared beyond that.
- **No ads, no trackers, no analytics selling data. Ever.**
- **Accounts are provisioned by the school** (issued username/password or approved
  email). Nobody self-registers; nobody can enrol themselves into a class.

---

## What is protecting the app today (already built)

Done while the app still runs on sample data, so it is correct before real users arrive:

- **Security headers on every page** — the browser-side protections configured in
  `web/next.config.ts`:
  - *Content-Security-Policy* — scripts and styles may only come from the app itself;
    nothing injected by an attacker may run
  - *frame-ancestors 'none' + X-Frame-Options: DENY* — no other site may embed the app
    (blocks clickjacking)
  - *X-Content-Type-Options: nosniff* — blocks a class of file-confusion attacks
  - *Referrer-Policy* — full URLs never leak to other sites
  - *Permissions-Policy* — only this app may use the camera (for absence-note photos);
    microphone and location are denied outright
  - *Strict-Transport-Security* — browsers must use HTTPS once deployed
- **Dependencies scanned — 0 known vulnerabilities** (`npm audit`, current major
  versions of Next.js and React)
- **No secrets in code.** The env template (`web/.env.example`) documents every key;
  real values live only in gitignored `.env.local` / the host's secret manager
- **No risky patterns.** No `eval`, no raw HTML insertion, no `dangerouslySetInnerHTML`
  anywhere; React escapes all rendered content by default
- **Local device storage holds no credentials** — currently only display state (chosen
  class, ticked homework); when tokens arrive they go in secure server-side cookies

---

## Phase B — when the real backend lands (Supabase)

This is the "real users" gate. Nothing goes live until every line here is true.

- [ ] **Accounts:** Supabase Auth — Google sign-in restricted to the school email
      domain, plus issued-username/password for younger students
- [ ] **Passwords (issued accounts):** cost-12 bcrypt at minimum; login rate-limited —
      5 fails = 15-minute lockout
- [ ] **Sessions:** httpOnly, Secure, SameSite=Lax cookies only — never localStorage;
      server-side logout invalidates the session
- [ ] **Row-Level Security on every table** (the deny-by-default engine):
      students read own class; parents read linked child; teachers read/write own
      classes; admins all — verified by *actually trying* each cross-role access in tests
- [ ] **Server-side role checks on every mutation** — ownership checked in the same
      query (`WHERE id = $1 AND class_id = $2`), never "the app wouldn't send that"
- [ ] **UUIDs everywhere** — no sequential IDs that let people enumerate other users
- [ ] **Input validation server-side on every field** with a schema library (Zod):
      type, length, allowed characters — including the absence-note text
- [ ] **Uploads (medical certificates):** images only, 10 MB cap, MIME + magic-byte
      check, private storage bucket with expiring signed URLs — never public URLs
- [ ] **CSP becomes nonce-based** (removes the development-time `'unsafe-inline'`
      relaxation noted in `next.config.ts`)
- [ ] **Secrets rotation drill once**: confirm every key lives in the platform secret
      manager and can be swapped without a code change
- [ ] **Backups on + restore tested** before the first real homework is posted

## Phase C — before the school pilot

- [ ] **Security contact** (`SECURITY.md`) — a school staffed email for reports
- [ ] **HTTPS + HSTS verified** on the live domain (securityheaders.com scan)
- [ ] **Auth attempt alerting** — spike in failed logins notifies the admin
- [ ] **Pen-test pass** per the checklist's DIY section: try other users' IDs (expect
      refusal), script tags in every field (expect escaped text), API without login
      (expect 401), oversized/wrong-type upload (expect rejection)
- [ ] **Admin actions logged** — account creation, role changes, data deletion: who,
      what, when, in an append-only log
- [ ] **Data deletion path** — a student leaving the school can be fully removed

---

## The mobile app (later)

The mobile apps read the same server as the website — the security lives there, not in
the app. Mobile adds its own rules:

- **No secrets in the app package.** Only the public anon key; all authority flows
  through the server
- **Session tokens in Keychain (iOS) / EncryptedSharedPreferences (Android)** — never
  plain localStorage
- **Face ID / fingerprint unlock** for parents' and teachers' accounts
- **Biometric unlock, not stored passwords**; certificate pinning evaluated at launch
- **The web-first headers apply at the server**, so the API is protected for both
  clients identically — one hardening, two apps

---

## The one-line rule

> **Real student data does not touch this app until Phase B is fully checked.**
> The checklist's golden rule applies doubly here: a school app is trusted with
> children by default, and that trust is earned in configuration, not promised in prose.
