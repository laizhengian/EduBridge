import {
  attendanceDays,
  dayGroupLabel,
  ecaSessions,
  type EcaSession,
} from "@/lib/mock-data";
import { DotTag, SectionTitle } from "@/components/ui";

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function AttendancePage() {
  const present = attendanceDays.filter((a) => a.status === "present").length;
  const late = attendanceDays.filter((a) => a.status === "late").length;
  const excused = attendanceDays.filter(
    (a) => a.status === "absent" && a.excused,
  ).length;
  const unexcused = attendanceDays.filter(
    (a) => a.status === "absent" && !a.excused,
  ).length;
  const today = attendanceDays[0];

  // Group ECA roll-calls per activity — not per date.
  const activities: { name: string; weekday: string; sessions: EcaSession[] }[] =
    [];
  for (const s of ecaSessions) {
    const found = activities.find((a) => a.name === s.activity);
    if (found) found.sessions.push(s);
    else activities.push({ name: s.activity, weekday: s.weekday, sessions: [s] });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Attendance
        </h1>
        <p className="mt-1 text-[15px] text-muted">This term so far · Class 8B</p>
      </header>

      {/* today, first — the #1 question gets the #1 position */}
      <section
        className="rise mt-6 flex items-center gap-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
            today.status === "present"
              ? "bg-accent text-paper"
              : today.status === "late"
                ? "bg-amber-500 text-paper"
                : "bg-danger text-paper"
          }`}
          aria-hidden
        >
          {today.status === "present" ? "✓" : today.status === "late" ? "!" : "—"}
        </span>
        <div>
          <p className="font-display text-lg font-semibold">
            {today.status === "present"
              ? "Present today"
              : today.status === "late"
                ? "Late today"
                : "Away today"}
          </p>
          <p className="text-sm text-muted">
            {today.excused
              ? `Excused — ${today.reason}`
              : (today.reason ?? `Marked in by the class teacher`)}
          </p>
        </div>
      </section>

      {/* the summary that counts excused and unexcused separately */}
      <section
        className="rise mt-4 grid grid-cols-3 gap-3.5"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <Stat value={present} label="Days present" />
        <Stat value={late} label="Late" />
        <Stat value={excused + unexcused} label="Days away" />
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <p className="text-[15px] leading-7">
          Of the {excused + unexcused} days away,{" "}
          <strong className="font-semibold">{excused} had a proper reason</strong>{" "}
          on file — a medical certificate or a school letter.{" "}
          {unexcused === 0
            ? "None are unexplained."
            : `${unexcused} ${unexcused === 1 ? "is" : "are"} still missing a reason.`}
        </p>
      </section>

      <section className="rise mt-6" style={{ "--i": 4 } as React.CSSProperties}>
        <SectionTitle>Recent school days</SectionTitle>
        <div className="mt-3 rounded-xl border border-hairline bg-paper px-4 py-1">
          {attendanceDays.map((a, i) => (
            <div
              key={a.date}
              className={`py-3.5 ${i > 0 ? "border-t border-hairline" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15px] font-medium">
                  {dayGroupLabel(a.date)}
                </span>
                {a.status === "present" ? (
                  <DotTag color="green">Present</DotTag>
                ) : a.status === "late" ? (
                  <DotTag color="amber">Late</DotTag>
                ) : a.excused ? (
                  <DotTag color="gray">Absent · excused</DotTag>
                ) : (
                  <DotTag color="red">Absent</DotTag>
                )}
              </div>
              {(a.reason || a.excused) && (
                <p className="mt-0.5 text-xs leading-5 text-muted">
                  {a.reason ?? "Reason on file with the office"}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rise mt-6 pb-2" style={{ "--i": 5 } as React.CSSProperties}>
        <SectionTitle>Activity attendance</SectionTitle>
        <p className="mt-1 text-[13px] text-muted">
          Each activity keeps its own roll — no picking exact dates.
        </p>
        <div className="mt-3 space-y-3.5">
          {activities.map((act) => {
            const attended = act.sessions.filter((s) => s.attended).length;
            return (
              <div
                key={act.name}
                className="rounded-xl border border-hairline bg-paper p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="font-display text-[15px] font-semibold">
                      {act.name}
                    </p>
                    <p className="text-xs text-muted">{act.weekday}</p>
                  </div>
                  <DotTag color={attended === act.sessions.length ? "green" : "gray"}>
                    {attended} of {act.sessions.length} attended
                  </DotTag>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {act.sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2.5 text-[13px]"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          s.attended
                            ? "bg-accent-soft text-accent-strong"
                            : "bg-danger-soft text-danger"
                        }`}
                        aria-hidden
                      >
                        {s.attended ? "✓" : "✗"}
                      </span>
                      <span className="text-muted">{shortDate(s.date)}</span>
                      {s.note && (
                        <span className="min-w-0 truncate text-xs text-muted">
                          · {s.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-5 pb-2 text-xs text-muted">
        Sample data for the design preview.
      </p>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-paper p-4 text-center">
      <p className="font-display text-2xl font-semibold text-accent-strong">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}
