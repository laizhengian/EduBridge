"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronIcon, Chip } from "@/components/ui";
import { roster } from "@/lib/mock-data";
import { TEACHER_CLASSES } from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

/**
 * One class at a glance: the roll with attendance history, the lateness
 * tracker, and the actions. Reached from the teacher home's class cards.
 */
export default function ClassPage() {
  return (
    <Suspense fallback={null}>
      <ClassPageInner />
    </Suspense>
  );
}

function ClassPageInner() {
  const params = useSearchParams();
  const klass = params.get("name") ?? TEACHER_CLASSES[0];

  const students = useMemo(() => {
    // The demo rotates the shared roster per class; the vault supplies the
    // real roll per class.
    const shift = klass.length % roster.length;
    return roster.slice(shift).concat(roster.slice(0, shift));
  }, [klass]);

  const [tab, setTab] = useState<"roll" | "lates">("roll");

  const lates = students
    .filter((s) => (s.latesThisTerm ?? 0) > 0)
    .sort((a, b) => (b.latesThisTerm ?? 0) - (a.latesThisTerm ?? 0));

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <Link
          href="/teacher"
          className="pressable inline-flex min-h-[44px] items-center text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Your classes
        </Link>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {klass}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {students.length} students · attendance and lateness this term
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEACHER_CLASSES.map((c) => (
            <Chip
              key={c}
              active={klass === c}
              onClick={() => {
                haptic("light");
                location.href = `/teacher/class?name=${encodeURIComponent(c)}`;
              }}
            >
              {c}
            </Chip>
          ))}
        </div>
      </header>

      <section className="rise mt-5" style={{ "--i": 1 } as React.CSSProperties}>
        <Link
          href="/teacher/attendance"
          onClick={() => haptic("light")}
          className="pressable flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xl bg-accent px-4 text-[15px] font-semibold text-paper"
        >
          Take today's attendance
          <ChevronIcon className="h-4 w-4" />
        </Link>
      </section>

      <div className="rise mt-6" style={{ "--i": 2 } as React.CSSProperties}>
        <div className="flex gap-2">
          <Chip active={tab === "roll"} onClick={() => setTab("roll")}>
            Class roll
          </Chip>
          <Chip active={tab === "lates"} onClick={() => setTab("lates")}>
            Lateness {lates.length > 0 ? `(${lates.length})` : ""}
          </Chip>
        </div>

        {tab === "roll" ? (
          <ul className="mt-3 rounded-xl border border-hairline bg-paper px-4 py-1">
            {students.map((s, i) => (
              <li
                key={s.id}
                className={`py-3${i === 0 ? "" : " border-t border-hairline"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[15px] font-medium">{s.name}</span>
                  {(s.latesThisTerm ?? 0) > 0 ? (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-[13px] font-semibold text-amber-700">
                      {(s.latesThisTerm ?? 0)} lates
                    </span>
                  ) : (
                    <span className="shrink-0 text-[13px] text-muted">
                      on time this term
                    </span>
                  )}
                </div>
                {s.frequentReason && (
                  <p className="mt-0.5 text-[13px] text-muted">
                    usually: {s.frequentReason}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 rounded-xl border border-hairline bg-paper p-4">
            {lates.length === 0 ? (
              <p className="py-4 text-[15px] text-muted">
                Nobody has been late this term.
              </p>
            ) : (
              <>
                <ul className="space-y-3">
                  {lates.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-medium">
                          {s.name}
                        </span>
                        <span className="block text-[13px] text-muted">
                          usually: {s.frequentReason ?? "no pattern yet"}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold ${
                          (s.latesThisTerm ?? 0) >= 5
                            ? "bg-danger-soft text-danger"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.latesThisTerm} lates
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-hairline pt-3 text-[13px] leading-5 text-muted">
                  Five or more lates turns red — worth a word with the family
                  before it becomes a habit.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <p
        className="rise mt-6 text-[13px] leading-5 text-muted"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        Design preview — per-student history, marks and notes arrive with the
        real accounts.
      </p>
    </div>
  );
}
