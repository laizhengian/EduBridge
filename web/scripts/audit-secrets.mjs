#!/usr/bin/env node
/**
 * Secrets pre-flight — runs in CI and before every deploy (`npm run audit:secrets`).
 *
 * Fails if anything that looks like a real credential sits inside files that
 * could reach git or a bundle: tracked files, staged files, or buildable source.
 * Catches the #1 vibe-coded-app failure mode: a working key committed once,
 * then rotated-not-revoked forever.
 *
 * Rules live in ALLOW (tuned to keep this signal, not noise):
 *  - this file (self-reference), docs, lockfiles
 *  - template/example placeholders and bare variable names
 *  - generic words that merely contain the word "key" or "secret"
 */

import { execSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");

// Only files git actually tracks (respects .gitignore; .env* is ignored).
let files;
try {
  files = execSync("git ls-files", { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
} catch {
  console.error("audit:secrets — must run inside the git checkout");
  process.exit(2);
}

const SCANNABLE = /\.(ts|tsx|js|jsx|mjs|cjs|json|html|css|md|txt|ya?ml|toml|sh|env)$/;

// Real-looking credentials only. Placeholders (your-api-key-here, <token>,
// $VAR, process.env.X) are excluded by construction.
const RULES = [
  {
    name: "private key block",
    re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP |DSA )?PRIVATE KEY-----/,
  },
  {
    name: "Supabase service-role / anonymous JWT",
    re: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  },
  {
    name: "API key with assigned value",
    re: /\b(?:apikey|api_key|secret|token|password|passwd|pwd|client_secret)\b["']?\s*[:=]\s*["'][^"'\s]{12,}["']/i,
  },
  {
    name: "bearer-style hardcoded credential",
    re: /\b(?:Authorization|Bearer)\b["']?\s*[:=]?\s*["'][A-Za-z0-9._-]{20,}["']/,
  },
  {
    name: "Slack/xox token",
    re: /xox[baprs]-[A-Za-z0-9-]{10,}/,
  },
  {
    name: "Google API key shape",
    re: /\bAIza[0-9A-Za-z_-]{30,}\b/,
  },
  {
    name: "Stripe key",
    re: /\b(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{16,}\b/,
  },
  {
    name: "SendGrid key",
    re: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/,
  },
];

const ALLOW = [
  /(^|\/)package-lock\.json$/i,
  /audit-secrets\.mjs$/,
  /(^|\/)\.github\//,
  /(^|\/)docs\//,
];

const findings = [];

for (const file of files) {
  if (ALLOW.some((a) => a.test(file))) continue;
  if (!SCANNABLE.test(file)) continue;

  let content;
  try {
    content = execSync(`git show ":./${file}"`, { cwd: root, encoding: "utf8", maxBuffer: 16e6 });
  } catch {
    continue; // deleted in index, binary, or unreadable — not a leak signal
  }

  for (const { name, re } of RULES) {
    if (re.test(content)) findings.push({ file, name });
  }
}

if (findings.length > 0) {
  console.error("\naudit:secrets — POSSIBLE CREDENTIALS IN TRACKED FILES:\n");
  for (const f of findings) console.error(`  ${f.file}  —  ${f.name}`);
  console.error(
    "\nReview each finding. If real: REVOKE the credential (rotating is not enough),\n" +
      "move it to .env.local / the host's secret manager, then re-run.\n",
  );
  process.exit(1);
}

console.log(`audit:secrets — clean (${files.length} tracked files scanned)`);
