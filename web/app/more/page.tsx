"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdjustIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  CalendarPlusIcon,
  Chip,
  EventsIcon,
  ImagesIcon,
  MegaphoneIcon,
  MessageIcon,
  PenLineIcon,
  PhoneIcon,
  PlayIcon,
  QuestionIcon,
  ScrollTextIcon,
  ShieldIcon,
  SunIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/ui";
import {
  attendanceDays,
  circulars,
  events,
  examResults,
  type SchoolEvent,
} from "@/lib/mock-data";
import {
  getEvents,
  subscribe as subscribeEvents,
} from "@/lib/events-store";
import { buildIcsAll, downloadIcsFile } from "@/lib/ics";
import { getStudy } from "@/lib/study-store";
import { loadProfile, type Role } from "@/lib/profile";

/** Live counts and one-line facts for the tiles — the Hub shows the school
    as it is right now (latest letter, next event, the term's average), not
    as a static menu. Reads the shared stores so admin posts count too. */
function useNewCounts(): {
  news: number;
  events: number;
  study: number;
  nextEvent: SchoolEvent | null;
} {
  const [counts, setCounts] = useState<{ news: number; events: number; study: number; nextEvent: SchoolEvent | null }>({
    news: 0,
    events: 0,
    study: 0,
    nextEvent: null,
  });
  useEffect(() => {
    const load = () => {
      const now = Date.now();
      const week = 7 * 24 * 60 * 60 * 1000;
      const upcoming = getEvents()
        .filter((e) => +new Date(e.date) > now)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date));
      setCounts({
        news: circulars.filter((c) => now - +new Date(c.postedAt) < week).length,
        events: upcoming.filter((e) => +new Date(e.date) - now < week).length,
        study: getStudy().filter((r) => now - +new Date(r.sharedAt) < week).length,
        nextEvent: upcoming[0] ?? null,
      });
    };
    load();
    return subscribeEvents(load);
  }, []);
  return counts;
}

// Hub = grouped by need, not one flat grid (goals.md → principle 11). News
// leads because the survey says announcements are the #1 use; teacher tools
// appear only for teacher profiles; Administration is an honest placeholder.
export default function MorePage() {
  const [role, setRole] = useState<Role>("student");
  useEffect(() => {
    setRole(loadProfile()?.role ?? "student");
  }, []);
  const counts = useNewCounts();

  return (
    <div>
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Hub
        </h1>
        <p className="mt-1 text-[15px] text-muted">Everything else in the app</p>
      </header>

      <Group icon={<MegaphoneIcon className="h-4.5 w-4.5" />} title="From the school">
        <Tile
          href="/circulars"
          title="News"
          desc="Announcements and latest news from the office"
          Icon={MegaphoneIcon}
          badge={counts.news > 0 ? `${counts.news} new this week` : undefined}
        />
        <Tile
          href="/events"
          title="Events"
          desc="What's coming up, with add-to-calendar"
          Icon={EventsIcon}
          badge={
            counts.nextEvent
              ? `Next: ${counts.nextEvent.title} · ${new Date(counts.nextEvent.date).toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short" })}`
              : counts.events > 0
                ? `${counts.events} this week`
                : undefined
          }
 />
        <Tile
          href="/holidays"
          title="Holidays"
          desc="Days the school is closed this term"
          Icon={SunIcon}
        />
        <Tile
          href="/feedback"
          title="Student feedback"
          desc="Tell the school how it's going — read weekly"
          Icon={MessageIcon}
        />
      </Group>

      <Group icon={<UserIcon className="h-4.5 w-4.5" />} title="About me">
        <Tile
          href="/attendance"
          title="My attendance"
          desc="Days in, late, and away — excused counted separately"
          Icon={CalendarCheckIcon}
          badge={attendanceBadge()}
        />
        <Tile
          href="/results"
          title="Exam results"
          desc="Marks by exam, with the teacher's progress report"
          Icon={TrophyIcon}
          badge={`Mid-term average ${resultsAverage()}/100`}
        />
        <Tile
          href="/absence"
          title="Tell the school I'm away"
          desc="Send a quick absence note to your teacher"
          Icon={PenLineIcon}
        />
      </Group>

      <Group icon={<ImagesIcon className="h-4.5 w-4.5" />} title="School life">
        <Tile
          href="/life"
          title="Photos, videos & campus"
          desc="Galleries, competitions and campus info"
          Icon={ImagesIcon}
        />
      </Group>

      <Group icon={<PlayIcon className="h-4.5 w-4.5" />} title="Learn">
        <Tile
          href="/study"
          title="Study Center"
          desc="Videos, quizzes and practice your teachers share"
          Icon={PlayIcon}
          badge={counts.study > 0 ? `${counts.study} this week` : undefined}
          marks={["\u25b6", "?", "\u270e", "\u2630"]}
          wide
        />
      </Group>

      <Group icon={<BookOpenIcon className="h-4.5 w-4.5" />} title="Reference">
        <Tile
          href="/hotlines"
          title="Hotlines"
          desc="Who to call, when, and for what"
          Icon={PhoneIcon}
        />
        <Tile
          href="/faq"
          title="Common questions"
          desc="Short answers to what families ask most"
          Icon={QuestionIcon}
        />
        <CalendarTile />
      </Group>

      <Group icon={<UserIcon className="h-4.5 w-4.5" />} title="Administration" last>
        <Tile
          href="/admin"
          title="Office & admin tools"
          desc="Memos, calendar, results monitoring and student records — staff sign-in"
          Icon={ShieldIcon}
          wide
        />
      </Group>

      {/* Quiet legal + settings row — they answer questions, they don't
          compete for attention with the things families came for. All three
          links share one style (same height, same weight) so the row reads as
          one line and wraps as whole words, never as a lone raised link. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-2 text-[13px] text-muted">
        {[
          { href: "/settings", label: "Settings" },
          { href: "/privacy", label: "Privacy" },
          { href: "/privacy#terms", label: "Terms" },
        ].map((l, i) => (
          <span key={l.href} className="flex items-center gap-x-4">
            {i > 0 && (
              <span aria-hidden className="text-muted/60">
                ·
              </span>
            )}
            <Link
              href={l.href}
              className="pressable inline-flex min-h-[32px] items-center font-medium underline-offset-4 hover:text-foreground hover:underline"
            >
              {l.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}

function Group({
  icon,
  title,
  children,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={`rise mt-6${last ? " pb-2" : ""}`}>
      <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      <div className="mt-2.5 grid grid-cols-2 gap-3.5 md:grid-cols-4">{children}</div>
    </section>
  );
}

function Tile({
  href,
  title,
  desc,
  Icon,
  badge,
  marks,
  wide = false,
}: {
  href: string;
  title: string;
  desc: string;
  Icon: (p: { className?: string }) => React.ReactNode;
  badge?: string;
  /** Small kind-glyphs under the description (Study Center: what's inside). */
  marks?: string[];
  wide?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border border-hairline bg-paper p-4 transition-transform active:scale-[0.98]${wide ? " col-span-2 md:col-span-4" : ""}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon className="h-5.5 w-5.5" />
      </span>
      <p className="mt-3 font-display text-[15px] font-semibold leading-5">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{desc}</p>
      {marks && marks.length > 0 && (
        <p
          aria-hidden
          className="mt-2 flex gap-1.5 text-[13px] leading-none text-accent-strong"
        >
          {marks.map((m, i) => (
            <span
              key={i}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft"
            >
              {m}
            </span>
          ))}
        </p>
      )}
      {badge && (
        <p className="mt-2 truncate text-xs font-semibold text-accent-strong">{badge}</p>
      )}
    </Link>
  );
}

/** Mid-term average across subjects, from the same data the results page shows. */
function resultsAverage(): number {
  const r = examResults[0]?.results ?? [];
  if (r.length === 0) return 0;
  return Math.round(r.reduce((sum, s) => sum + (s.score / s.max) * 100, 0) / r.length);
}

/** Days in (present or late) out of recorded school days, in plain words. */
function attendanceBadge(): string {
  const inDays = attendanceDays.filter((d) => d.status !== "absent").length;
  return `In ${inDays} of ${attendanceDays.length} days`;
}

/** One tap, complete export — every upcoming event leaves with you as one
    calendar file, built in the browser from the live events store. */
function CalendarTile() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  useEffect(() => {
    const load = () => setEvents(getEvents());
    load();
    return subscribeEvents(load);
  }, []);

  function downloadAll() {
    const now = new Date();
    const upcoming = events.filter((e) => new Date(e.date) >= now);
    if (upcoming.length === 0) return;
    downloadIcsFile("school-events.ics", buildIcsAll(upcoming));
  }

  return (
    <button
      type="button"
      onClick={downloadAll}
      className="rounded-xl border border-hairline bg-paper p-4 text-left transition-transform active:scale-[0.98]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CalendarPlusIcon className="h-5.5 w-5.5" />
      </span>
      <p className="mt-3 font-display text-[15px] font-semibold leading-5">
        Dates for your calendar
      </p>
      <p className="mt-1 text-xs leading-5 text-muted">
        Add every school event to your calendar app
      </p>
    </button>
  );
}

