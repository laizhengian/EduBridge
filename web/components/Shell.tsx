"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EventsIcon,
  HomeIcon,
  HomeworkIcon,
  TimetableIcon,
  MoreIcon,
} from "./ui";

const tabs = [
  { href: "/", label: "Today", Icon: HomeIcon, exact: true },
  { href: "/homework", label: "Homework", Icon: HomeworkIcon, exact: false },
  { href: "/more", label: "Hub", Icon: MoreIcon, exact: false, center: true },
  { href: "/timetable", label: "Timetable", Icon: TimetableIcon, exact: false },
  { href: "/events", label: "Events", Icon: EventsIcon, exact: false },
];

// Desktop gets every destination — the center treatment is mobile-only.
const desktopLinks = tabs;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* desktop header — sticky masthead: wordmark, today's date, pill navigation */}
      <header className="sticky top-0 z-30 hidden border-b border-hairline bg-paper md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Edu<span className="text-accent">Bridge</span>
            </Link>
            <span className="hidden text-[13px] text-muted lg:inline">{today}</span>
          </div>
          <nav className="flex items-center gap-1 text-[15px]">
            {desktopLinks.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-9 items-center rounded-full px-4 transition-colors ${
                    active
                      ? "bg-accent-soft font-semibold text-accent-strong"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md px-5 pb-32 pt-8 md:max-w-6xl md:px-8 md:pb-20 md:pt-14">
        {children}
      </div>

      {/* mobile bottom tabs — 5 slots, the tree hub in the middle */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {tabs.map(({ href, label, Icon, exact, center }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            if (center) {
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={`${label} — everything else in the app`}
                  className={`-mt-4 flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-medium transition-transform active:scale-95 ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-colors ${
                      active ? "border-accent bg-accent text-paper" : "border-hairline bg-paper"
                    }`}
                  >
                    <MoreIcon className="h-6 w-6" />
                  </span>
                  {label}
                </Link>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-medium transition-transform active:scale-[0.96] ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <Icon className={active ? "text-accent" : "text-stone-400"} />
                {label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-5 border-t border-hairline py-2.5 text-[11px] text-muted">
          <Link href="/privacy" className="underline-offset-2 hover:text-foreground">
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <Link href="/privacy#terms" className="underline-offset-2 hover:text-foreground">
            Terms
          </Link>
        </div>
      </nav>
    </div>
  );
}
