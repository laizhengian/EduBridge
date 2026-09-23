"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheckIcon,
  GraduationCapIcon,
  HomeIcon,
  PenLineIcon,
} from "@/components/ui";

/**
 * The teacher app's own chrome — deliberately NOT the family app's. Four
 * destinations a teacher actually uses (Home, Attendance, Post homework, and
 * a door back to the family app for what students see), no Hub tiles, and a
 * teacher-green top bar so you always know which app you're in.
 */
const tabs = [
  { href: "/teacher", label: "Home", Icon: HomeIcon, exact: true },
  { href: "/teacher/attendance", label: "Attendance", Icon: CalendarCheckIcon, exact: false },
  { href: "/teacher/post", label: "Post", Icon: PenLineIcon, exact: false },
  { href: "/", label: "Family app", Icon: GraduationCapIcon, exact: true },
];

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-accent/20 bg-accent text-paper transition-shadow ${
          scrolled ? "shadow-[0_12px_24px_-20px_rgba(20,86,62,0.7)]" : ""
        }`}
      >
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <GraduationCapIcon className="h-4.5 w-4.5" />
            EduBridge · Teacher
          </p>
          <Link
            href="/more"
            className="pressable rounded-lg px-2 py-1 text-xs font-semibold text-paper/80 underline-offset-4 hover:text-paper hover:underline"
          >
            Settings & profile
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 pb-32 pt-20">
        {children}
      </div>

      <nav
        aria-label="Teacher"
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-accent/30 bg-accent pb-[env(safe-area-inset-bottom)] transition-shadow md:hidden ${
          scrolled ? "shadow-[0_-12px_24px_-20px_rgba(20,86,62,0.8)]" : ""
        }`}
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map(({ href, label, Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && href !== "/";
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`pressable flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-medium ${
                  active ? "text-paper" : "text-paper/60"
                }`}
              >
                <Icon className="h-5.5 w-5.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
