"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DotTag, SectionTitle, ArrowRightIcon } from "@/components/ui";
import {
  circulars,
  dueLabel,
  events,
  homeworkSeed,
  isSameDay,
  timeAgo,
} from "@/lib/mock-data";
import { loadProfile, type Profile } from "@/lib/profile";

function Box({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-hairline bg-paper ${className}`}>
      {children}
    </div>
  );
}

export default function TodayPage() {
  // Signing in is optional in the preview: without a profile the page still
  // shows everything, just without the personal class line. The welcome flow
  // is there when you want it — never a locked door.
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setChecked(true);
  }, []);

  const now = new Date();
  const openCount = homeworkSeed.filter((h) => !h.done).length;
  const overdue = homeworkSeed.filter((h) => !h.done && new Date(h.dueAt) < now);
  const dueToday = homeworkSeed.filter((h) => !h.done && isSameDay(h.dueAt, now));
  const upcomingEvents = events
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 2);

  // Teachers land on their own app at /teacher — Today stays the family view.
  if (profile?.role === "teacher") {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
        <p className="text-[15px] text-muted">You're signed in as a teacher.</p>
        <Link
          href="/teacher"
          className="pressable mt-4 min-h-[52px] rounded-xl bg-accent px-8 text-[15px] font-semibold leading-[52px] text-paper"
        >
          Open the teacher app
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="rise">
        <p className="text-sm text-muted">
          {now.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long" })}
          {profile ? ` · ${profile.className}` : ""}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {now.getHours() < 12
            ? "Good morning"
            : now.getHours() < 17
              ? "Good afternoon"
              : "Good evening"}
        </h1>
        <p className="mt-1.5 text-[17px] text-foreground/80">
          {openCount > 0
            ? `${openCount} items to do · ${overdue.length} overdue`
            : "No homework to do right now."}
        </p>
      </header>

      {overdue.length > 0 && (
        <section className="rise mt-8" style={{ "--i": 1 } as React.CSSProperties}>
          <SectionTitle
            right={
              <Link href="/homework" className="text-sm font-medium text-accent">
                Open
              </Link>
            }
          >
            Overdue
          </SectionTitle>
          <Box className="mt-2 divide-y divide-hairline">
            {overdue.map((h) => (
              <Link
                key={h.id}
                href="/homework"
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-danger" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-danger">
                  {h.title}
                  <span className="sr-only"> (overdue)</span>
                </span>
                <span className="shrink-0 text-xs text-muted">{dueLabel(h.dueAt)}</span>
              </Link>
            ))}
          </Box>
        </section>
      )}

      <section className="rise mt-8" style={{ "--i": 2 } as React.CSSProperties}>
        <SectionTitle
          right={
            <Link
              href="/homework"
              className="inline-flex min-h-[32px] items-center gap-1 text-sm font-medium text-accent"
            >
              All <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          }
        >
          Due today
        </SectionTitle>
        {dueToday.length === 0 ? (
          <Box className="mt-2 px-4 py-4">
            <p className="text-[15px] text-muted">Nothing due today.</p>
          </Box>
        ) : (
          <Box className="mt-2 divide-y divide-hairline">
            {dueToday.map((h) => (
              <Link
                key={h.id}
                href="/homework"
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium leading-6">{h.title}</p>
                  <p className="text-xs text-muted">
                    {h.subject} · due {dueLabel(h.dueAt)}
                  </p>
                </div>
              </Link>
            ))}
          </Box>
        )}
      </section>

      <section className="rise mt-8" style={{ "--i": 3 } as React.CSSProperties}>
        <SectionTitle
          right={
            <Link href="/circulars" className="text-sm font-medium text-accent">
              All
            </Link>
          }
        >
          Latest news
        </SectionTitle>
        <Box className="mt-2 divide-y divide-hairline">
          {circulars.map((c) => (
            <Link key={c.id} href="/circulars" className="block px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-[15px] font-medium leading-6">
                  {c.title}
                </p>
                <span className="shrink-0 text-xs font-semibold text-accent-strong">
                  New
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {c.postedBy} · {timeAgo(c.postedAt)}
              </p>
            </Link>
          ))}
        </Box>
      </section>

      <section className="rise mt-8" style={{ "--i": 4 } as React.CSSProperties}>
        <SectionTitle
          right={
            <Link href="/events" className="text-sm font-medium text-accent">
              Calendar
            </Link>
          }
        >
          Coming up
        </SectionTitle>
        <Box className="mt-2 divide-y divide-hairline">
          {upcomingEvents.map((e) => (
            <Link key={e.id} href="/events" className="flex items-center gap-3 px-4 py-3.5">
              <span
                aria-hidden
                className={`h-2 w-2 shrink-0 rounded-full ${
                  e.type === "exam" ? "bg-amber-500" : e.type === "holiday" ? "bg-accent" : "bg-stone-400"
                }`}
              />
              <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
                {e.title}
              </span>
              <span className="shrink-0 text-xs text-muted">{dueLabel(e.date)}</span>
            </Link>
          ))}
        </Box>
      </section>
    </div>
  );
}
