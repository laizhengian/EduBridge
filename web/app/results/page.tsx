"use client";

import { useState } from "react";
import { examResults } from "@/lib/mock-data";
import { ChevronIcon, DotTag } from "@/components/ui";
import { PageBackdrop } from "@/components/PageBackdrop";

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** The honest average: graded subjects only, each on the same scale — and the
    screen says so (goals.md principle 10). */
function averageOf(results: { score: number; max: number }[]): number {
  return Math.round(
    results.reduce((sum, r) => sum + (r.score / r.max) * 100, 0) / results.length,
  );
}

export default function ResultsPage() {
  const [latest, previous] = examResults;
  const [showModules, setShowModules] = useState(false);
  const avg = averageOf(latest.results);
  const prevAvg = previous ? averageOf(previous.results) : null;
  const delta = prevAvg === null ? null : avg - prevAvg;
  const below = latest.results.filter((r) => r.score < r.passMark);

  return (
    <div className="mx-auto max-w-3xl">
      <PageBackdrop motif="results" />
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Exam results
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {latest.term} · released {longDate(latest.issuedAt)}
        </p>
      </header>

      {/* The headline is the average — one number for the term. Individual
          subject marks are one tap away, not a wall of numbers (one decision
          per screen). No grade letters: the mark and the pass line say it all. */}
      <section
        className="rise mt-6 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-muted">Average mark</p>
            <p className="mt-1 font-display text-4xl font-semibold tracking-tight">
              {avg}
              <span className="text-base font-normal text-muted">/100</span>
            </p>
          </div>
          {delta !== null && delta !== 0 && (
            <p
              className={`text-sm font-semibold ${
                delta > 0 ? "text-accent-strong" : "text-danger"
              }`}
            >
              {delta > 0 ? "Up" : "Down"} {Math.abs(delta)} since{" "}
              {previous.term.split(",")[0]}
            </p>
          )}
          {delta === 0 && (
            <p className="text-sm text-muted">
              Steady since {previous.term.split(",")[0]}
            </p>
          )}
        </div>
        <p className="mt-3 border-t border-hairline pt-3 text-xs leading-5 text-muted">
          The average of {latest.results.length} graded subjects, each marked out
          of 100 — nothing else is counted in.
        </p>
        {below.length > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-danger">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-danger" />
            {below.length === 1
              ? `${below[0].subject} sits below the pass mark`
              : `${below.length} subjects sit below the pass mark`}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowModules(!showModules)}
          aria-expanded={showModules}
          className="pressable mt-4 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-accent"
        >
          {showModules
            ? "Hide the subject marks"
            : `Show all ${latest.results.length} subject marks`}
          <ChevronIcon
            className={`h-3.5 w-3.5 transition-transform ${showModules ? "rotate-90" : ""}`}
          />
        </button>

        {showModules && (
          <ul className="mt-1 border-t border-hairline">
            {latest.results.map((r) => {
              const under = r.score < r.passMark;
              return (
                <li
                  key={r.subject}
                  className="flex items-start justify-between gap-3 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium">{r.subject}</p>
                    {under && (
                      <p className="mt-0.5">
                        <DotTag color="red">
                          below the pass mark ({r.passMark})
                        </DotTag>
                      </p>
                    )}
                    {r.teacherComment && (
                      <p className="mt-0.5 text-[13px] leading-5 text-muted">
                        {r.teacherComment}
                      </p>
                    )}
                  </div>
                  <p
                    className={`shrink-0 font-display text-lg font-semibold ${
                      under ? "text-danger" : ""
                    }`}
                  >
                    {r.score}
                    <span className="text-sm font-normal text-muted">
                      /{r.max}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* legend — colour means exactly one thing here */}
      <p className="rise mt-2.5 text-xs leading-5 text-muted" style={{ "--i": 2 } as React.CSSProperties}>
        Colour means one thing: red sits below the pass mark. Everything else is
        a pass, so it stays plain.
      </p>

      {/* the progress report, stamped with its issue date so it can't go stale silently */}
      <section
        className="rise mt-6 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[17px] font-semibold">
            Student progress report
          </h2>
          <DotTag color="green">up to date</DotTag>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          “{latest.classTeacherComment}”
        </p>
        <p className="mt-3 border-t border-hairline pt-3 text-xs text-muted">
          Issued by the class teacher · Class 8B · {longDate(latest.issuedAt)}
        </p>
      </section>

      {/* earlier this year, compact */}
      {previous && (
        <section className="rise mt-6 pb-2" style={{ "--i": 4 } as React.CSSProperties}>
          <h2 className="font-display text-[17px] font-semibold">
            Earlier this year
          </h2>
          <p className="mt-0.5 text-xs text-muted">{previous.term}</p>
          <div className="mt-3 rounded-xl border border-hairline bg-paper px-4 py-1">
            {previous.results.map((r, i) => (
              <div
                key={r.subject}
                className={`flex items-center justify-between py-3 ${
                  i > 0 ? "border-t border-hairline" : ""
                }`}
              >
                <span className="text-[15px] text-muted">{r.subject}</span>
                <span className="text-sm text-muted">
                  {r.score}/{r.max}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-5 pb-2 text-xs text-muted">
        Sample data for the design preview.
      </p>
    </div>
  );
}
