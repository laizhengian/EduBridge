"use client";

import { useState } from "react";
import { timetable } from "@/lib/mock-data";

type Day = keyof typeof timetable;
const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_NAMES: Record<Day, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

function todayDay(): Day {
  const js = new Date().getDay();
  if (js >= 1 && js <= 5) return DAYS[js - 1];
  return "Mon";
}

function SlotList({ day, compact = false }: { day: Day; compact?: boolean }) {
  return (
    <ol className="divide-y divide-hairline">
      {timetable[day].map((slot, i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          <span className="w-11 shrink-0 text-[13px] font-semibold tabular-nums text-muted">
            {slot.start}
          </span>
          <span
            aria-hidden
            className={`h-8 w-1 shrink-0 rounded-full ${
              slot.subject === "PE" || slot.subject === "Assembly"
                ? "bg-emerald-500"
                : "bg-accent"
            }`}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium leading-5">{slot.subject}</p>
            {!compact && (
              <p className="mt-0.5 text-xs text-muted">
                {slot.room} · {slot.teacher}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function TimetablePage() {
  const [day, setDay] = useState<Day>(todayDay());

  return (
    <div>
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Timetable
        </h1>
        <p className="mt-1 text-[15px] text-muted">Class 8B</p>
      </header>

      {/* mobile: one day at a time */}
      <div className="md:hidden">
        <div className="rise mt-5 grid grid-cols-5 gap-1.5" style={{ "--i": 1 } as React.CSSProperties}>
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              aria-pressed={day === d}
              className={`min-h-[44px] rounded-lg text-[13px] font-semibold transition-transform active:scale-95 ${
                day === d
                  ? "bg-accent text-accent-contrast"
                  : "border border-hairline bg-paper text-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <section className="rise mt-6" style={{ "--i": 2 } as React.CSSProperties}>
          <h2 className="font-display text-base font-semibold text-foreground">
            {DAY_NAMES[day]}
          </h2>
          <div className="mt-1">
            <SlotList day={day} />
          </div>
        </section>
      </div>

      {/* desktop: the full week board at once */}
      <div className="mt-8 hidden gap-4 md:grid md:grid-cols-5">
        {DAYS.map((d, i) => (
          <section
            key={d}
            className="rise rounded-xl border border-hairline bg-paper p-4"
            style={{ "--i": i } as React.CSSProperties}
          >
            <h2
              className={`font-display text-base font-semibold ${
                d === todayDay() ? "text-accent" : "text-foreground"
              }`}
            >
              {DAY_NAMES[d]}
              {d === todayDay() && <span className="ml-1.5 text-xs">· today</span>}
            </h2>
            <div className="mt-1">
              <SlotList day={d} compact />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
