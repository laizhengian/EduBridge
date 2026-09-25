"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheckIcon,
  ChevronIcon,
  ClipboardListIcon,
  PenLineIcon,
  PlayIcon,
  TrophyIcon,
} from "@/components/ui";
import { getHomework } from "@/lib/store";
import { getStudy } from "@/lib/study-store";
import { timeAgo, type Homework, type StudyResource } from "@/lib/mock-data";
import { TEACHER_CLASSES } from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

/**
 * The teacher's home: your classes (each opens the class overview), one
 * actions hub, and your recent posts. Nothing repeats — the actions live
 * here once, and the class cards are about the *students*, not shortcuts.
 */
type RecentPost =
  | { at: string; kind: "homework"; item: Homework }
  | { at: string; kind: "study"; item: StudyResource };

export default function TeacherHomePage() {
  const [recent, setRecent] = useState<RecentPost[]>([]);
  useEffect(() => {
    const merged: RecentPost[] = [
      ...getHomework()
        .slice(0, 4)
        .map((item) => ({ at: item.postedAt, kind: "homework" as const, item })),
      ...getStudy()
        .slice(0, 3)
        .map((item) => ({ at: item.sharedAt, kind: "study" as const, item })),
    ];
    merged.sort((a, b) => +new Date(b.at) - +new Date(a.at));
    setRecent(merged.slice(0, 4));
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
              href={`/teacher/class?name=${encodeURIComponent(c)}`}
              onClick={() => haptic("light")}
              className="pressable rounded-xl border border-hairline bg-paper p-4"
            >
              <p className="font-display text-lg font-semibold">{c}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                Roll, lateness & attendance history
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rise mt-8" style={{ "--i": 2 } as React.CSSProperties}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Quick actions
        </h2>
        <div className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
          <Link
            href="/teacher/attendance"
            onClick={() => haptic("light")}
            className="pressable flex min-h-[56px] items-center justify-between gap-3"
          >
            <span className="flex items-center gap-3">
              <CalendarCheckIcon className="h-5.5 w-5.5 text-accent" />
              <span className="text-[15px] font-semibold">Take attendance</span>
            </span>
            <ChevronIcon className="h-4 w-4 text-muted/70" />
          </Link>
          <Link
            href="/teacher/post"
            onClick={() => haptic("light")}
            className="pressable flex min-h-[56px] items-center justify-between gap-3 border-t border-hairline"
          >
            <span className="flex items-center gap-3">
              <PenLineIcon className="h-5.5 w-5.5 text-accent" />
              <span className="text-[15px] font-semibold">Post homework</span>
            </span>
            <ChevronIcon className="h-4 w-4 text-muted/70" />
          </Link>
          <Link
            href="/teacher/study"
            onClick={() => haptic("light")}
            className="pressable flex min-h-[56px] items-center justify-between gap-3 border-t border-hairline"
          >
            <span className="flex items-center gap-3">
              <PlayIcon className="h-5.5 w-5.5 text-accent" />
              <span className="text-[15px] font-semibold">Share a study video or quiz</span>
            </span>
            <ChevronIcon className="h-4 w-4 text-muted/70" />
          </Link>
          <div
            aria-disabled
            className="flex min-h-[56px] items-center justify-between gap-3 border-t border-hairline opacity-60"
          >
            <span className="flex items-center gap-3">
              <TrophyIcon className="h-5.5 w-5.5 text-muted/70" />
              <span className="text-[15px] font-semibold text-muted">
                Enter marks{" "}
                <span className="text-xs font-semibold text-muted">
                  — coming soon
                </span>
              </span>
            </span>
          </div>
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
            {recent.map((p, i) => (
              <li
                key={p.kind === "homework" ? p.item.id : `st-${p.item.id}`}
                className={`flex items-center gap-3 py-3${i === 0 ? "" : " border-t border-hairline"}`}
              >
                {p.kind === "homework" ? (
                  <ClipboardListIcon className="h-5 w-5 shrink-0 text-muted/70" />
                ) : (
                  <PlayIcon className="h-5 w-5 shrink-0 text-muted/70" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium leading-6">
                    {p.item.title}
                  </span>
                  <span className="block text-xs text-muted">
                    {p.kind === "homework"
                      ? `${p.item.subject} · due ${new Date(p.item.dueAt).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}`
                      : `Study · ${p.item.kind} · ${p.item.subject} · ${timeAgo(p.item.sharedAt)}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
