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
  QuestionIcon,
  ScrollTextIcon,
  ShieldIcon,
  SunIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/ui";
import { circulars, events } from "@/lib/mock-data";
import { loadProfile, type Role } from "@/lib/profile";
import {
  loadTextSize,
  saveTextSize,
  TEXT_SIZES,
  type TextSize,
} from "@/lib/text-size";

/** Live "new this week" counts — the Hub proves it's organized, not stale.
    Counts fill after mount so server and client render identically. */
function useNewCounts(): { news: number; events: number } {
  const [counts, setCounts] = useState({ news: 0, events: 0 });
  useEffect(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    setCounts({
      news: circulars.filter((c) => now - +new Date(c.postedAt) < week).length,
      events: events.filter((e) => +new Date(e.date) - now < week && +new Date(e.date) > now).length,
    });
  }, []);
  return counts;
}

// Hub = grouped by need, not one flat grid (goals.md → principle 11). News
// leads because the survey says announcements are the #1 use; teacher tools
// appear only for teacher profiles; Administration is an honest placeholder.
export default function MorePage() {
  const [size, setSize] = useState<TextSize>("standard");
  const [role, setRole] = useState<Role>("student");
  useEffect(() => {
    setSize(loadTextSize());
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
          badge={counts.events > 0 ? `${counts.events} this week` : undefined}
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
        />
        <Tile
          href="/results"
          title="Exam results"
          desc="Marks by exam, with the teacher's progress report"
          Icon={TrophyIcon}
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
        <Tile
          href="/privacy"
          title="Privacy & terms"
          desc="What the app stores, in plain words"
          Icon={ShieldIcon}
        />
        <CalendarTile />
      </Group>

      <Group icon={<UserIcon className="h-4.5 w-4.5" />} title="Administration" last>
        <SoonTile
          title="Office & admin tools"
          desc="Circulars with read receipts, absence overview, accounts — after the admin interviews"
        />
      </Group>

      <Group icon={<AdjustIcon className="h-4.5 w-4.5" />} title="Settings" last>
        <TextSizeSetting
          size={size}
          onChoose={(s) => {
            setSize(s);
            saveTextSize(s);
          }}
        />
      </Group>
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
}: {
  href: string;
  title: string;
  desc: string;
  Icon: (p: { className?: string }) => React.ReactNode;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-hairline bg-paper p-4 transition-transform active:scale-[0.98]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon className="h-5.5 w-5.5" />
      </span>
      <p className="mt-3 font-display text-[15px] font-semibold leading-5">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{desc}</p>
      {badge && (
        <p className="mt-2 text-xs font-semibold text-accent-strong">{badge}</p>
      )}
    </Link>
  );
}

/** An honest placeholder: says what will exist and why it isn't here yet. */
function SoonTile({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      aria-disabled
      className="col-span-2 rounded-xl border border-dashed border-hairline bg-paper/60 p-4 md:col-span-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-muted">
          <ShieldIcon className="h-5.5 w-5.5" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[15px] font-semibold leading-5">
            {title} <span className="text-xs font-semibold text-muted">— coming soon</span>
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">{desc}</p>
        </div>
      </div>
    </div>
  );
}

/** One tap, complete export — every event leaves with you as a calendar file. */
function CalendarTile() {
  return (
    <a
      href="/events.ics"
      download
      className="rounded-xl border border-hairline bg-paper p-4 transition-transform active:scale-[0.98]"
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
    </a>
  );
}

/** The accessibility setting. It scales the ROOT font size (see
    lib/text-size.ts), so every screen grows in proportion and nothing can
    clip — the layout is fluid, there is no zoom to break it. */
function TextSizeSetting({
  size,
  onChoose,
}: {
  size: TextSize;
  onChoose: (s: TextSize) => void;
}) {
  return (
    <div className="col-span-2 rounded-xl border border-hairline bg-paper p-4 md:col-span-4">
      <p className="font-display text-[15px] font-semibold">Text size</p>
      <p className="mt-1 text-xs leading-5 text-muted">
        Makes every word in the app bigger — nothing moves or gets cut off
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TEXT_SIZES.map((s) => (
          <Chip key={s} active={size === s} onClick={() => onChoose(s)}>
            {s === "standard" ? "Standard" : s === "large" ? "Large" : "Larger"}
          </Chip>
        ))}
      </div>
    </div>
  );
}
