# How to run EduBridge (development stage)

*A plain, step-by-step guide to getting the app running on a computer.
No experience needed beyond opening a terminal. If you get stuck, the
"Problems and fixes" section at the bottom covers the usual suspects.*

---

## What you need first (one time only)

1. **Node.js version 20 or newer** — this is the engine that runs the app.
   - Check if you have it: open a terminal (PowerShell) and type:
     ```
     node -v
     ```
   - If you see `v20.something` or higher, you're set.
   - If you see an error, install the "LTS" version from https://nodejs.org
     and restart the terminal.

2. **The project folder** — you already have it:
   `C:\Users\IanAI\Desktop\EduBridge`

---

## First-time setup (one time only)

In the terminal, go into the app's folder and install its building blocks:

```
cd "C:\Users\IanAI\Desktop\EduBridge\web"
npm install
```

This takes a few minutes and prints a lot of text. If it ends without the
word "error", it worked. You never need to do this step again (unless you
switch computers).

---

## Starting the app (every time)

```
cd "C:\Users\IanAI\Desktop\EduBridge\web"
npm run dev
```

The terminal will print a line like:

```
- Local:   http://localhost:3000
```

Open that address in your browser. The app is running when you see the
"Welcome to EduBridge" screen.

**To stop it:** click the terminal and press `Ctrl` + `C`.
**Everyday note:** the app reads sample data — nothing you do is saved to a
school server, because there is no school server yet. That's the next step.

---

## Changing things and seeing the result

The screens live in `web/app` — one folder per page:

| Folder | What it is |
|---|---|
| `web/app/page.tsx` | Today screen |
| `web/app/homework` | Homework board |
| `web/app/timetable` | Timetable |
| `web/app/events` | Events |
| `web/app/circulars` | Circulars |
| `web/app/more` | The Hub (absence, holidays, circulars, privacy & terms) |
| `web/app/privacy` | Privacy & terms page |
| `web/app/attendance` | Attendance (excused vs unexcused, ECA per activity) |
| `web/app/results` | Exam results + progress report |
| `web/app/life` | School life: photo galleries, competitions |
| `web/app/hotlines` | Hotlines with tap-to-call |
| `web/app/faq` | Common questions |
| `web/app/welcome` | First-run sign-in screen |
| `web/lib/mock-data.ts` | The sample homework, events and classes |

While the app is running, any file you save appears in the browser within a
second or two — just refresh the page.

**Checking the code is sound** (do this after bigger changes):

```
cd "C:\Users\IanAI\Desktop\EduBridge\web"
npx tsc --noEmit
```

No output means no problems.

---

## Problems and fixes

**"The page won't load"**
Look at the terminal line `- Local: http://localhost:NUMBER` — the number
is not always 3000. Use the number it actually printed.

**"Port 3000 is already in use" / the app shows on a strange port**
Something else took the usual port; the app picks a free one. Same fix as
above: read the port from the terminal and use it.

**"I restarted my computer and now nothing works"**
Normal — the app only runs while the terminal runs. Do "Starting the app"
again.

**"npm install printed warnings"**
Warnings are fine. The word `error` is what matters.

**"I broke it and don't know how"**
The code is safe on GitHub. Reset to the last good state with:
```
cd "C:\Users\IanAI\Desktop\EduBridge"
git fetch origin && git reset --hard origin/main
```
(Warning: this throws away uncommitted changes — that's the point, but
make sure there's nothing you wanted to keep first.)

---

## What this is not yet

This guide runs the **design preview**: real screens, sample data, no
accounts and no server. The plan for the real version (database, sign-in,
deployment) is in [plan.md](plan.md), and the safety rules that must be in
place before any real student data is used are in
[security-plan.md](security-plan.md).
