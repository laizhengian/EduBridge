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

export default function TodayPage() {
  const now = new Date();
  const openCount = homeworkSeed.filter((h) => !h.done).length;
  const overdue = homeworkSeed.filter((h) => !h.done && new Date(h.dueAt) < now);
  const dueToday = homeworkSeed.filter((h) => !h.done && isSameDay(h.dueAt, now));
  const upcomingEvents = events
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 2);

  return (
    <div>
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {now.toLocaleDateString("en-MY", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
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
          <ul className="mt-1 divide-y divide-hairline">
            {overdue.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-3">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-danger">
                  {h.title}
                </span>
                <span className="shrink-0 text-xs text-muted">{dueLabel(h.dueAt)}</span>
              </li>
            ))}
          </ul>
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
          <p className="py-3 text-[15px] text-muted">Nothing due today.</p>
        ) : (
          <ul className="mt-1 divide-y divide-hairline">
            {dueToday.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-3">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium leading-6">{h.title}</p>
                  <p className="text-xs text-muted">
                    {h.subject} · due {dueLabel(h.dueAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
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
          From the office
        </SectionTitle>
        <ul className="mt-1 divide-y divide-hairline">
          {circulars.map((c) => (
            <li key={c.id} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-[15px] font-medium leading-6">
                  {c.title}
                </p>
                <span className="shrink-0 text-xs font-medium text-accent-strong">
                  New
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {c.postedBy} · {timeAgo(c.postedAt)}
              </p>
            </li>
          ))}
        </ul>
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
        <ul className="mt-1 divide-y divide-hairline">
          {upcomingEvents.map((e) => (
            <li key={e.id} className="flex items-center gap-3 py-3">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  e.type === "exam"
                    ? "bg-amber-500"
                    : e.type === "holiday"
                      ? "bg-accent"
                      : "bg-stone-400"
                }`}
              />
              <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
                {e.title}
              </span>
              <span className="shrink-0 text-xs text-muted">{dueLabel(e.date)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
