# Run doc — OIS Hub web app (web/)

Next.js 16 (App Router, Turbopack) + Tailwind 4. No backend yet — all screens run on
mock data (`web/lib/mock-data.ts`), so there are no env files or services to set up.

## Reproduce the artifacts

Nothing to generate or copy:

- No `.env.local` (will change when Supabase is wired in — copy it from the main
  checkout at that point).
- Dependencies: `npm install` inside `web/` (a committed `package-lock.json` is the
  source of truth; skip if `web/node_modules` already exists).

## Run the dev server

From the project root:

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory '<project>\web' -RedirectStandardOutput '<project>\.freebuff\preview.log' -RedirectStandardError '<project>\.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id"
```

Notes:

- Run from `web/` (the Next.js root is `web/`, not the repo root).
- Port: Next.js auto-picks. 3000 is often taken by other local processes — read the
  chosen port from the log line `Local: http://localhost:PORT`, then get the listening
  pid with `netstat -ano | grep :PORT` and register that pid.
- Confirm it survived a few seconds later: `Get-Process -Id <pid>` and
  `curl http://localhost:PORT` should return HTTP 200.
- Production check when needed: `npm run build` and `npx tsc --noEmit` inside `web/`.
