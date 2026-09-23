"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui";
import { type RosterStudent } from "@/lib/mock-data";
import {
  attLabel,
  cycleAtt,
  freshRoster,
  TEACHER_CLASSES,
  REASON_OPTIONS,
} from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

/**
 * Tap-the-row attendance (features.md §14). The roster opens all-present.
 * A tap moves a child through present → late → excused → absent. Reasons are
 * OPTIONAL — a quick-pick chip, a written line, or nothing at all; the post
 * is never blocked. Recurring reasons surface as one-tap suggestions based
 * on the term so far (the lateness tracker's data).
 */
export default function TeacherAttendancePage() {
  const [klass, setKlass] = useState<string>(TEACHER_CLASSES[1]);
  const [rows, setRows] = useState<RosterStudent[]>(() =>
    freshRoster(TEACHER_CLASSES[1]),
  );
  const [posted, setPosted] = useState<string | null>(null);
  const [writing, setWriting] = useState<string | null>(null); // student id with the custom-reason box open

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of rows) c[s.att] = (c[s.att] ?? 0) + 1;
    return c;
  }, [rows]);

  const exceptions = rows.filter((s) => s.att !== "present");
  const lates = rows.filter((s) => s.att === "late");

  function tap(id: string) {
    haptic("light");
    setPosted(null);
    setRows(rows.map((r) => (r.id === id ? cycleAtt(r) : r)));
  }

  function setReason(id: string, reason: string | undefined) {
    setPosted(null);
    setRows(rows.map((r) => (r.id === id ? { ...r, reason } : r)));
  }

  function post() {
    haptic("success");
    setPosted(
      `${counts.present ?? 0} in · ${counts.late ?? 0} late · ${counts.excused ?? 0} excused · ${counts.absent ?? 0} away — saved just now`,
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Attendance
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Everyone starts as in — touch a name only to change it
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEACHER_CLASSES.map((c) => (
            <Chip
              key={c}
              active={klass === c}
              onClick={() => {
                haptic("light");
                setKlass(c);
                setPosted(null);
                setWriting(null);
                setRows(freshRoster(c));
              }}
            >
              {c}
            </Chip>
          ))}
        </div>
      </header>

      <ul
        className="rise mt-5 rounded-xl border border-hairline bg-paper px-4 py-1 sm:px-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {rows.map((s, i) => (
          <li
            key={s.id}
            className={`py-2.5${i === 0 ? "" : " border-t border-hairline"}`}
          >
            <button
              type="button"
              onClick={() => tap(s.id)}
              className="pressable flex min-h-[48px] w-full items-center justify-between gap-3 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium leading-6">
                  {s.name}
                </span>
                <span className="block text-[13px] text-muted">
                  {s.att === "present"
                    ? "Tap to mark"
                    : s.reason
                      ? `${attLabel(s.att)} · ${s.reason}`
                      : attLabel(s.att)}
                </span>
              </span>
              <StateDot state={s.att} />
            </button>

            {s.att !== "present" && (
              <div className="space-y-2 pb-2 pl-0.5">
                <div className="flex flex-wrap gap-1.5">
                  {/* Recurring reasons first, from the term's history */}
                  {s.frequentReason &&
                    s.frequentReason !== s.reason &&
                    REASON_OPTIONS.includes(s.frequentReason) && (
                      <Chip
                        active={false}
                        onClick={() => setReason(s.id, s.frequentReason)}
                      >
                        {s.frequentReason} (again)
                      </Chip>
                    )}
                  {REASON_OPTIONS.filter((r) => r !== s.frequentReason).map(
                    (r) => (
                      <Chip
                        key={r}
                        active={s.reason === r}
                        onClick={() =>
                          setReason(s.id, s.reason === r ? undefined : r)
                        }
                      >
                        {r}
                      </Chip>
                    ),
                  )}
                  <Chip
                    active={Boolean(s.reason) && !REASON_OPTIONS.includes(s.reason ?? "")}
                    onClick={() => setWriting(writing === s.id ? null : s.id)}
                  >
                    Write a reason…
                  </Chip>
                </div>
                {writing === s.id && (
                  <input
                    value={
                      s.reason && !REASON_OPTIONS.includes(s.reason)
                        ? s.reason
                        : ""
                    }
                    onChange={(e) => setReason(s.id, e.target.value || undefined)}
                    placeholder="e.g. Doctor's appointment till 10am"
                    enterKeyHint="done"
                    className="w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-base outline-none focus:border-accent"
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="rise mt-5" style={{ "--i": 2 } as React.CSSProperties}>
        <p className="text-[13px] text-muted">
          {exceptions.length === 0
            ? "Full class present — nothing to change"
            : `${exceptions.length} marked away from class`}
        </p>
        <button
          type="button"
          onClick={post}
          className="pressable mt-3 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper"
        >
          Post attendance
        </button>
        {posted && (
          <p className="mt-2.5 rounded-lg bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent-strong">
            Saved — {posted}
          </p>
        )}
        <p className="mt-3 text-[13px] leading-5 text-muted">
          Reasons are optional. The real app saves a draft as you go, so
          attendance is never entered twice.
        </p>
      </div>

      {lates.length > 0 && (
        <section
          className="rise mt-8 rounded-xl border border-hairline bg-paper p-4"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <h2 className="font-display text-[17px] font-semibold">
            Lateness tracker
          </h2>
          <p className="mt-1 text-sm text-muted">
            Times late this term, and what keeps happening
          </p>
          <ul className="mt-3 space-y-2.5">
            {lates.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium">
                    {s.name}
                  </span>
                  <span className="block text-[13px] text-muted">
                    {s.reason
                      ? `today: ${s.reason}`
                      : s.frequentReason
                        ? `usually: ${s.frequentReason}`
                        : "no reason given"}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold ${
                    (s.latesThisTerm ?? 0) >= 5
                      ? "bg-danger-soft text-danger"
                      : "bg-accent-soft text-accent-strong"
                  }`}
                >
                  {(s.latesThisTerm ?? 0) + 1} lates
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-hairline pt-3 text-[13px] leading-5 text-muted">
            Five or more lates turns red — worth a word with the family before
            it becomes a habit. The full class history lives in each student's
            overview.
          </p>
        </section>
      )}
    </div>
  );
}

function StateDot({ state }: { state: RosterStudent["att"] }) {
  const map: Record<
    RosterStudent["att"],
    { bg: string; text: string; label: string }
  > = {
    present: { bg: "bg-accent-soft", text: "text-accent", label: "In" },
    late: { bg: "bg-amber-50", text: "text-amber-700", label: "Late" },
    excused: { bg: "bg-sky-50", text: "text-sky-700", label: "Excused" },
    absent: { bg: "bg-danger-soft", text: "text-danger", label: "Away" },
  };
  const v = map[state];
  return (
    <span
      className={`inline-flex h-8 min-w-[64px] items-center justify-center rounded-full px-2.5 text-[13px] font-semibold ${v.bg} ${v.text}`}
    >
      {v.label}
    </span>
  );
}
