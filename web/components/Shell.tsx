"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EventsIcon, HomeIcon, HomeworkIcon, TimetableIcon } from "./ui";

const tabs = [
  { href: "/", label: "Today", Icon: HomeIcon, exact: true },
  { href: "/homework", label: "Homework", Icon: HomeworkIcon, exact: false },
  { href: "/timetable", label: "Timetable", Icon: TimetableIcon, exact: false },
  { href: "/events", label: "Events", Icon: EventsIcon, exact: false },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* desktop header — same destinations, arranged generously */}
      <header className="hidden border-b border-hairline bg-paper md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight"
          >
            OIS Hub
          </Link>
          <nav className="flex items-center gap-8 text-[15px]">
            {tabs.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-10 items-center transition-colors ${
                    active
                      ? "font-semibold text-accent"
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

      {/* mobile bottom tabs — large touch targets, no blur for old devices */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map(({ href, label, Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
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
      </nav>
    </div>
  );
}
