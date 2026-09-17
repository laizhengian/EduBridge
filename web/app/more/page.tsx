import Link from "next/link";
import { ChevronIcon, EnvelopeIcon, NoteIcon, SunIcon } from "@/components/ui";

const soon = "border-dashed";

export default function MorePage() {
  return (
    <div>
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Hub
        </h1>
        <p className="mt-1 text-[15px] text-muted">Everything else in the app</p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3.5 rise" style={{ "--i": 1 } as React.CSSProperties}>
        <Tile
          href="/absence"
          title="Tell the school I'm away"
          desc="Send a quick absence note to your teacher"
          Icon={EnvelopeIcon}
        />
        <Tile
          href="/holidays"
          title="Holidays"
          desc="Days the school is closed this term"
          Icon={SunIcon}
        />
        <Tile
          href="/circulars"
          title="Circulars"
          desc="Announcements from the school office"
          Icon={NoteIcon}
        />
        <div
          className={`rounded-xl border ${soon} border-hairline bg-paper p-4 opacity-70`}
        >
          <p className="font-display text-[15px] font-semibold text-foreground/70">
            More coming
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            New parts of the school app will appear here
          </p>
        </div>
      </div>
    </div>
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
