"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheckIcon,
  ChevronIcon,
  ClipboardListIcon,
  PenLineIcon,
} from "@/components/ui";
import { getHomework } from "@/lib/store";
import { TEACHER_CLASSES } from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

/**
 * The teacher's home. It looks nothing like the student Today screen because
 * the job is different: your classes and the two things teachers do all day.
 * Classes come from the account (assigned at year start) — nothing to pick.
 */
export default function TeacherHomePage() {
  const [recent, setRecent] = useState<ReturnType<typeof getHomework>>([]);
  useEffect(() => {
    setRecent(getHomework().slice(0, 4));
  }, []);

  const now = useMemo(() => new Date(), []);
  const today = useMemo(
    () =>
      now.toLocaleDateString("en-MY", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    [now],
  );
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          {today}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {greeting}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          You teach {TEACHER_CLASSES.join(", ")}
        </p>
      </header>

      <section className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Your classes
        </h2>
        <div className="mt-2.5 grid gap-3.5 sm:grid-cols-3">
          {TEACHER_CLASSES.map((c) => (
            <Link
              key={c}
              href="/teacher/attendance"
              onClick={() => haptic("light")}
              className="pressable rounded-xl border border-hairline bg-paper p-4"
            >
              <p className="font-display text-lg font-semibold">{c}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <CalendarCheckIcon className="h-4 w-4 text-accent" />
                Take attendance
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rise mt-8" style={{ "--i": 2 } as React.CSSProperties}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Do now
        </h2>
        <div className="mt-2.5 grid gap-3.5 sm:grid-cols-2">
          <Link
            href="/teacher/attendance"
            onClick={() => haptic("light")}
            className="pressable flex min-h-[64px] items-center justify-between gap-3 rounded-xl border border-hairline bg-paper px-4"
          >
            <span className="flex items-center gap-3">
              <CalendarCheckIcon className="h-5.5 w-5.5 text-accent" />
              <span className="text-[15px] font-semibold">Take attendance</span>
            </span>
            <ChevronIcon className="h-4 w-4 text-stone-400" />
          </Link>
          <Link
            href="/teacher/post"
            onClick={() => haptic("light")}
            className="pressable flex min-h-[64px] items-center justify-between gap-3 rounded-xl border border-hairline bg-paper px-4"
          >
            <span className="flex items-center gap-3">
              <PenLineIcon className="h-5.5 w-5.5 text-accent" />
              <span className="text-[15px] font-semibold">Post homework</span>
            </span>
            <ChevronIcon className="h-4 w-4 text-stone-400" />
          </Link>
        </div>
      </section>

      <section className="rise mt-8 pb-4" style={{ "--i": 3 } as React.CSSProperties}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Recently posted
        </h2>
        {recent.length === 0 ? (
          <p className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-5 text-[15px] text-muted">
            Nothing yet — your posts will show up here.
          </p>
        ) : (
          <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
            {recent.map((h, i) => (
              <li
                key={h.id}
                className={`flex items-center gap-3 py-3${i === 0 ? "" : " border-t border-hairline"}`}
              >
                <ClipboardListIcon className="h-5 w-5 shrink-0 text-stone-400" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium leading-6">
                    {h.title}
                  </span>
                  <span className="block text-xs text-muted">
                    {h.subject} · due{" "}
                    {new Date(h.dueAt).toLocaleDateString("en-MY", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[13px] leading-5 text-muted">
          Marks entry, read receipts and the admin tools arrive with the real
          accounts — the plan is in the docs.
        </p>
      </section>
    </div>
  );
}
