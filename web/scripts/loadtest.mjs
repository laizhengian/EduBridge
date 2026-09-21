#!/usr/bin/env node
/**
 * Load-test baseline — `npm run loadtest` (server must be running).
 *
 * Answers "will this fall apart when hundreds of users open it at once?" with
 * numbers, not vibes. Two scenarios against a local server:
 *
 *   1. home     — the front door as hundreds of students open it at 7:30am
 *   2. writes   — mutating requests through the proxy gate (expect 429/501,
 *                 never a hang or a crash)
 *
 * Full ladder and pass bars live in docs/production-hardening.md → "Load testing".
 */

import autocannon from "autocannon";
import process from "node:process";

const BASE = process.argv[2] ?? "http://localhost:54873";

function run(opts) {
  return new Promise((resolve, reject) => {
    autocannon({ ...opts, url: BASE }, (err, result) => (err ? reject(err) : resolve(result)));
  });
}

function summarize(name, r) {
  const p99 = r.latency.p99 ?? r.latency.max;
  const errors = r.errors ?? 0;
  const non2xx = r.non2xx ?? 0;
  console.log(
    `${name.padEnd(22)} ${String(r.requests.average).padStart(7)} req/s  ` +
      `p50 ${r.latency.p50}ms  p99 ${p99}ms  ` +
      `${r[ "2xx" ] ?? r.statusCodeStats?.[200]?.count ?? "?"} ok · ${non2xx} non-2xx · ${errors} errors`,
  );
  return { p99, errors };
}

console.log(`Load test against ${BASE}\n`);

const home = await run({
  url: BASE,
  duration: 10,
  connections: 100,
  pipelining: 1,
});
const s1 = summarize("home (100 clients)", home);

const writes = await run({
  url: `${BASE}/api/nope`,
  method: "POST",
  body: JSON.stringify({ probe: true }),
  headers: { "content-type": "application/json" },
  duration: 10,
  connections: 50,
});
const s2 = summarize("writes (gated, 50)", writes);

console.log("");
const bars = [
  ["home p99 < 300ms (local)", s1.p99 < 300],
  ["home zero errors", s1.errors === 0],
  ["writes answered every time", s2.errors === 0],
];
let failed = false;
for (const [name, ok] of bars) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed = true;
}
process.exit(failed ? 1 : 0);
