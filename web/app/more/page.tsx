import Link from "next/link";
import {
  BookOpenIcon,
  CalendarCheckIcon,
  CalendarPlusIcon,
  EnvelopeIcon,
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

// Hub = grouped by need, not one flat grid. A student looking for "what about
// me?" sees four tiles; the school-reference stuff lives in its own corner
// where it can't compete for attention (goals.md → principle 11).
export default function MorePage() {
  return (
    <div>
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Hub
        </h1>
        <p className="mt-1 text-[15px] text-muted">Everything else in the app</p>
      </header>

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

      <Group
        icon={<MegaphoneIcon className="h-4.5 w-4.5" />}
        title="From the school"
      >
        <Tile
          href="/circulars"
          title="Circulars"
          desc="Announcements from the school office"
          Icon={ScrollTextIcon}
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

      <Group icon={<ImagesIcon className="h-4.5 w-4.5" />} title="School life">
        <Tile
          href="/life"
          title="Photos, videos & campus"
          desc="Galleries, competitions and campus info"
          Icon={ImagesIcon}
        />
      </Group>

      <Group icon={<BookOpenIcon className="h-4.5 w-4.5" />} title="Reference" last>
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

      <ContactCard />
    </div>
  );
}

/** Quiet, out of the way — the app's builder, reachable if something's wrong. */
function ContactCard() {
  return (
    <section className="rise mt-8 pb-2">
      <div className="rounded-xl border border-hairline bg-paper p-4">
        <p className="text-[13px] font-semibold text-foreground">
          Any issues with the app?
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Message Ian — bugs, ideas, or anything confusing.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="mailto:zhengianlai@gmail.com"
            className="pressable inline-flex min-h-[40px] items-center gap-2 rounded-full border border-hairline bg-background px-3.5 text-xs font-semibold text-accent"
          >
            <EnvelopeIcon className="h-4 w-4" />
            Email
          </a>
          <a
            href="tel:+601154043298"
            className="pressable inline-flex min-h-[40px] items-center gap-2 rounded-full border border-hairline bg-background px-3.5 text-xs font-semibold text-accent"
          >
            <PhoneIcon className="h-4 w-4" />
            Call or WhatsApp
          </a>
        </div>
      </div>
    </section>
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
}: {
  href: string;
  title: string;
  desc: string;
  Icon: (p: { className?: string }) => React.ReactNode;
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
    </Link>
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
