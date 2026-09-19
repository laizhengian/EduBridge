# 🔐 Vibe-Coded App Security Checklist
### The bare minimum to not get hacked — for apps built fast, shipped faster.

---

## 1. Authentication & Session Management

> If you get this wrong, nothing else matters. Auth is your front door.

- [ ] **Never roll your own auth.** Use a battle-tested library (Auth.js / NextAuth, Clerk, Supabase Auth, Firebase Auth, Lucia).
- [ ] **Enforce strong passwords.** Minimum 8 characters. Check against `haveibeenpwned` API on registration.
- [ ] **Rate-limit login attempts.** 5 fails = 15-minute lockout. Prevents brute force.
- [ ] **Use secure, httpOnly, SameSite=Strict cookies** for session tokens. Never store JWTs in `localStorage`.
- [ ] **Session timeout.** Idle timeout (15–30 min) + absolute timeout (8–24 hours). Invalidate server-side on logout.
- [ ] **No session IDs in URLs.** They leak via Referer headers, browser history, and analytics.
- [ ] **Implement MFA/TOTP** for any app handling user data or payments. At minimum, offer it as an option.
- [ ] **OAuth state parameter.** Validate it on callback to prevent CSRF during social login flows.

---

## 2. Authorization (Access Control)

> Auth is who you are. AuthZ is what you can do. Most breaches are AuthZ failures.

- [ ] **Deny by default.** All endpoints and resources are private unless explicitly made public.
- [ ] **Server-side enforcement on every request.** Never trust client-side checks — they are trivially bypassed.
- [ ] **Row-Level Security (RLS)** if using Postgres/Supabase. Users can only read/write their own rows.
- [ ] **Validate ownership on every mutation.** `UPDATE post SET ... WHERE id = $1 AND user_id = $2` — always.
- [ ] **Role-based access control (RBAC).** At minimum: `user`, `admin`. Check roles server-side.
- [ ] **No direct object references (IDOR).** Don't expose sequential IDs. Use UUIDs, and still check ownership.
- [ ] **Admin routes behind IP allowlisting or stricter auth** if sensitive.

---

## 3. Input Validation & Injection Prevention

> The #1 attack vector. Every input is hostile until proven otherwise.

- [ ] **Parameterized queries always.** Never concatenate user input into SQL. Use your ORM correctly — no raw queries with interpolation.
- [ ] **Validate and sanitize all inputs server-side.** Type, length, format, allowed characters. Use Zod, Valibot, or Joi.
- [ ] **Escape output by context.** HTML entities in HTML, proper escaping in JSON/JS/CSS/URLs. Your templating engine should do this by default.
- [ ] **No `dangerouslySetInnerHTML` / `v-html` / `innerHTML`** with user content. Use a sanitizer (DOMPurify) if you must render HTML.
- [ ] **Shell command injection.** Never pass user input to `exec()`, `system()`, `child_process`. Use argument arrays, never string concatenation.
- [ ] **File upload validation.** Check MIME type, file magic bytes, maximum size, and extension. Store outside web root. Scan with ClamAV for sensitive apps.
- [ ] **XML External Entity (XXE) disabled** if parsing XML. Most parsers disable this by default now, but verify.
- [ ] **No eval()** with user input. Ever.

---

## 4. API Security

> Your API is a public attack surface. Treat it like one.

- [ ] **All APIs require authentication** unless intentionally public.
- [ ] **Rate limiting on every endpoint.** Global (100 req/min per IP) + per-endpoint (5 OTP requests/min). Use a sliding window algorithm.
- [ ] **CORS configured strictly.** Allow only your frontend origin. No `Access-Control-Allow-Origin: *` with credentials.
- [ ] **Validate Content-Type.** Reject requests with unexpected content types.
- [ ] **Maximum request body size.** Set a reasonable limit (10 MB default, lower if you don't handle uploads).
- [ ] **No sensitive data in URL query params.** Use POST bodies with TLS.
- [ ] **API versioning.** Deprecate old versions with clear timelines. Don't leave vulnerable v1 endpoints exposed.

---

## 5. Dependency & Supply Chain Security

> Your app is only as secure as its weakest dependency.

- [ ] **`npm audit` / `pip audit` / `bundle audit` on every push.** Run in CI, block merges on critical/high.
- [ ] **Lock files committed** (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `Gemfile.lock`).
- [ ] **Pin dependency versions.** No `^` or `~` in production. Use exact versions or a lockfile.
- [ ] **Review new dependencies before adding.** Check: last commit date, maintainer count, weekly downloads, known vulns.
- [ ] **Automated dependency updates** (Dependabot, Renovate). Merge patch updates aggressively.
- [ ] **SBOM generation** for production builds. Know what's in your app.
- [ ] **Avoid typosquatted packages.** Double-check spelling (`reat` vs `react`, `requests` vs `request`).

---

## 6. Secrets & Configuration

> Leaked secrets = instant compromise. This happens daily.

- [ ] **No secrets in source code.** Ever. Not even in comments. Not even "temporarily."
- [ ] **Use environment variables** for all secrets. Load via `.env` in dev, inject via platform secrets manager in prod.
- [ ] **`.env` in `.gitignore`.** Add it before the first commit. Provide `.env.example` with dummy values.
- [ ] **Pre-commit hook to scan for secrets** (gitleaks, truffleHog, git-secrets). Catches accidents before they hit the repo.
- [ ] **Rotate secrets after any suspected leak.** Assume compromise, act immediately.
- [ ] **Database URLs, API keys, JWT secrets** — all env vars. All unique per environment.
- [ ] **Use platform-native secret stores** in production (AWS Secrets Manager, Vercel Env, GitHub Secrets, Doppler).

---

## 7. Transport Security (HTTPS / TLS)

> Without TLS, everything else is optional for attackers.

- [ ] **HTTPS everywhere.** Redirect HTTP → HTTPS. HSTS header with `max-age=31536000; includeSubDomains`.
- [ ] **Modern TLS only.** TLS 1.2 minimum, TLS 1.3 preferred. Disable SSLv3, TLS 1.0, TLS 1.1.
- [ ] **Strong cipher suites.** No RC4, no 3DES, no CBC-mode ciphers. Use AEAD ciphers (AES-GCM, ChaCha20-Poly1305).
- [ ] **Valid certificates from trusted CA.** Auto-renew with Let's Encrypt or use your platform's managed certs.
- [ ] **HTTP Strict Transport Security (HSTS)** preload if possible. Submit to hstspreload.org.

---

## 8. Data Storage & Encryption

> If you store it, protect it. If you don't need it, don't store it.

- [ ] **Passwords hashed, never encrypted.** Use bcrypt, scrypt, or Argon2id. Minimum work factor: bcrypt cost 12, Argon2 memory 64MB.
- [ ] **PII and sensitive data encrypted at rest.** Use AES-256-GCM. Manage keys via KMS, not in app config.
- [ ] **Database not publicly accessible.** IP allowlist or VPC-only. No `0.0.0.0/0` in security groups.
- [ ] **Encrypted backups.** Test restoration regularly. A backup you can't restore is not a backup.
- [ ] **Data retention policy.** Delete data you don't need. Logs, analytics, old user data. Define retention windows.
- [ ] **No sensitive data in logs.** Strip passwords, tokens, PII from log output. Use a logging redaction library.
- [ ] **GDPR/CCPA compliance** basics: user data export and account deletion endpoints.

---

## 9. Cross-Site Scripting (XSS) Prevention

> Still in the OWASP Top 10 for a reason.

- [ ] **Content Security Policy (CSP).** Start with `Content-Security-Policy: default-src 'self'` and loosen only as needed. No `unsafe-inline` or `unsafe-eval` unless absolutely required.
- [ ] **Output encoding in templates.** React does this automatically if you don't use `dangerouslySetInnerHTML`. Confirm your framework escapes by default.
- [ ] **Sanitize user HTML.** Use DOMPurify (browser) or a server-side equivalent. Whitelist allowed tags and attributes.
- [ ] **X-XSS-Protection: 0** (legacy header, can cause issues. CSP replaces this.)
- [ ] **Trusted Types enabled** if using modern browser APIs. Prevents DOM XSS at the browser level.

---

## 10. Cross-Site Request Forgery (CSRF) Protection

> If you use cookies for auth, you need this.

- [ ] **SameSite=Strict or Lax on session cookies.** Strict if you can, Lax if you need cross-site navigation.
- [ ] **CSRF tokens** if using form submissions with cookies. Most frameworks (Rails, Laravel, Django) include this by default.
- [ ] **Custom request header requirement** for SPA APIs. Browsers enforce that custom headers trigger a preflight, which blocks simple CSRF.
- [ ] **Origin and Referer header validation** for sensitive state-changing requests.

---

## 11. Logging & Monitoring

> You can't defend what you can't see.

- [ ] **Structured logging.** JSON logs with timestamp, level, user ID, request ID, action. Makes searching and alerting possible.
- [ ] **Log authentication events.** Logins, logouts, failed attempts, password changes, MFA changes.
- [ ] **Log sensitive actions.** Data exports, deletions, role changes, payment events, API key creation.
- [ ] **Centralized log aggregation.** Ship logs off-instance immediately. Use your platform's logging service or a third party.
- [ ] **Real-time alerting.** PagerDuty, Opsgenie, Slack webhooks. Alert on: spike in 401s, spike in 403s, unusual DB queries, spike in error rate.
- [ ] **Audit trail** for compliance-relevant apps. Immutable, append-only log of all data access and modifications.

---

## 12. Infrastructure & Deployment

> Secure the castle, not just the throne room.

- [ ] **Principle of least privilege.** IAM roles with minimum necessary permissions. No `*` in policies.
- [ ] **Firewall / Security groups.** Only expose ports 80 and 443. Database, Redis, etc. on private subnets only.
- [ ] **Regular OS and runtime updates.** Enable automatic security patches for the OS. Update language runtimes (Node, Python, Go) before EOL.
- [ ] **Container image scanning.** Scan for known vulns in CI. Use minimal base images (Alpine, Distroless). No root user in containers.
- [ ] **Immutable infrastructure.** Deploy new instances, don't patch live ones. Makes rollback easy.
- [ ] **Web Application Firewall (WAF)** if exposed to the internet. Cloudflare, AWS WAF. Blocks common attack patterns automatically.
- [ ] **DDoS protection.** At minimum, put Cloudflare in front. Free tier covers most small-to-medium attacks.

---

## 13. Mobile / Client-Side Specific

> If your vibe-coded app has a mobile client or heavy frontend.

- [ ] **No secrets in the client.** API keys, tokens, secrets — they all live on the server. The client gets a session cookie or short-lived access token.
- [ ] **Certificate pinning** for mobile apps calling your API (optional but recommended for sensitive apps).
- [ ] **Jailbreak / root detection** on mobile (basic check, not foolproof).
- [ ] **Biometric auth** integration for sensitive actions (payments, PII access).
- [ ] **Secure local storage.** Use Keychain (iOS) / EncryptedSharedPreferences (Android). Never plain `AsyncStorage` or `UserDefaults` for tokens.

---

## 14. Incident Response Readiness

> Assume breach. Have a plan.

- [ ] **Security contact file** (`security.md` or `SECURITY.md` in repo) with email/PGP key for vulnerability reports.
- [ ] **Incident response runbook.** Who does what, when. Contact numbers. Communication templates.
- [ ] **Ability to revoke all sessions** globally. Admin endpoint to invalidate every active session token.
- [ ] **Database backup and restore tested monthly.** You will need this if ransomware or data corruption hits.
- [ ] **Break-glass admin access.** Emergency procedure to lock down the app, take it offline, or cut off all access.

---

## 15. Quick Pre-Launch Pen Test (DIY)

> Run through these before going live. They catch the obvious stuff.

- [ ] **Check all HTTP headers.** Use [securityheaders.com](https://securityheaders.com). Look for missing CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
- [ ] **Scan dependencies.** `npm audit`, `pip-audit`, or run `snyk test` on your project.
- [ ] **Test all file upload endpoints** with oversized files, wrong types, and EICAR test string.
- [ ] **Try to access another user's data** by changing IDs in URLs and API calls. Should get 403/404.
- [ ] **Submit special characters** (`<script>`, `' OR 1=1 --`, `../../etc/passwd`) in every input field. Nothing should break or reflect.
- [ ] **Check if your API responds without auth headers.** Every protected endpoint should return 401.
- [ ] **Review your `.env` file.** Is anything in there that would be catastrophic if leaked? Rotate it before launch anyway.
- [ ] **Run an OWASP ZAP baseline scan.** Free, open-source, finds low-hanging fruit in minutes.

---

## 16. Frameworks & Tools Quick Reference

| Area | Recommended Tools |
|------|-------------------|
| Auth | Clerk, Auth.js, Supabase Auth, Lucia Auth |
| Validation | Zod, Valibot, Joi |
| Rate Limiting | Upstash Ratelimit, express-rate-limit, rack-attack |
| CSP | helmet (Express), django-csp, SecureHeaders (Rails) |
| Secret Scanning | gitleaks, truffleHog, GitHub secret scanning |
| Dep Scanning | Dependabot, Snyk, npm audit, OWASP Dependency-Check |
| WAF / CDN | Cloudflare (free tier is excellent) |
| Logging | Pino, Winston, Lograge, Datadog, Logtail |
| Security Headers | securityheaders.com, Mozilla Observatory |
| SAST / DAST | Semgrep, CodeQL, OWASP ZAP |

---

## ⚠️ The Golden Rule

> **If you vibe-coded it, you must security-review it before it touches real user data.**

Speed of development does not excuse security negligence. A breach will cost you more time, money, and reputation than the hours saved by skipping these checks.

This checklist is the **minimum**, not the ceiling.

---

*Last updated: March 2026 · Licensed CC0 — use freely, share widely.*
