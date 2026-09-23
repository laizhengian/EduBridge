"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui";
import { type RosterStudent } from "@/lib/mock-data";
import {
  attLabel,
  cycleAtt,
  freshRoster,
  TEACHER_CLASSES,
} from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

const REASONS = [
  "Sick",
  "Medical certificate",
  "Family matter",
  "School duty",
  "Late transport",
] as const;

/**
 * Tap-the-row attendance (features.md §14). The roster opens all-present —
 * the template fills itself. A tap moves a child through present → late →
 * excused → absent. Reason chips instead of typing. The post confirms
 * explicitly, because the old portal's habit of losing entered marks is the
 * trust-killer we are reversing (Nisha, friction log §20).
 */
export default function TeacherAttendancePage() {
  const [klass, setKlass] = useState<string>(TEACHER_CLASSES[1]);
  const [rows, setRows] = useState<RosterStudent[]>(() => freshRoster(TEACHER_CLASSES[1]));
  const [posted, setPosted] = useState<string | null>(null);

  function switchClass(c: string) {
    haptic("light");
    setKlass(c);
    setPosted(null);
    setRows(freshRoster(c));
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of rows) c[s.att] = (c[s.att] ?? 0) + 1;
    return c;
  }, [rows]);

  const exceptions = rows.filter((s) => s.att !== "present");
  const readyToPost =
    exceptions.length === 0 || exceptions.every((s) => Boolean(s.reason));

  function tap(id: string) {
    haptic("light");
    setPosted(null);
    setRows(rows.map((r) => (r.id === id ? cycleAtt(r) : r)));
  }

  function chooseReason(id: string, reason: string) {
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
            <Chip key={c} active={klass === c} onClick={() => switchClass(c)}>
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

            {(s.att === "excused" || s.att === "absent") && (
              <div className="flex flex-wrap gap-1.5 pb-2 pl-0.5">
                {REASONS.map((r) => (
                  <Chip
                    key={r}
                    active={s.reason === r}
                    onClick={() => chooseReason(s.id, r)}
                  >
                    {r}
                  </Chip>
                ))}
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
          disabled={!readyToPost}
          onClick={post}
          className="pressable mt-3 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper disabled:opacity-40"
        >
          {exceptions.length === 0
            ? "Post — everyone is in"
            : exceptions.every((s) => Boolean(s.reason))
              ? "Post attendance"
              : "Pick a reason for everyone marked away"}
        </button>
        {posted && (
          <p className="mt-2.5 rounded-lg bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent-strong">
            Saved — {posted}
          </p>
        )}
        <p className="mt-3 text-[13px] leading-5 text-muted">
          Design preview — nothing is stored yet. The real app keeps a draft if
          the connection drops, so attendance is never entered twice.
        </p>
      </div>
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
