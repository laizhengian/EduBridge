"use client";

import { useEffect, useState } from "react";
import { ShieldIcon } from "@/components/ui";
import { StaffLogin } from "@/components/StaffLogin";
import { isStaffSignedIn, staffSignOut } from "@/lib/staff-auth";

/**
 * The admin console's own chrome — indigo, so at a glance nobody confuses
 * the office console with the family app (green teacher bar, paper family
 * app). Everything sits behind the admin sign-in. The tools themselves live
 * in the page below; the shell only decides who gets to see them.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setAuthed(isStaffSignedIn("admin"));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (authed === null) {
    return <div className="min-h-dvh bg-background" />;
  }
  if (!authed) {
    return <StaffLogin role="admin" onSignedIn={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-dvh bg-background">
      <header
        className={`fixed inset-x-0 top-0 z-40 bg-indigo-700 text-white transition-shadow ${
          scrolled ? "shadow-[0_12px_24px_-18px_rgba(49,46,129,0.8)]" : ""
        }`}
      >
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ShieldIcon className="h-4.5 w-4.5" />
            EduBridge · Admin
          </p>
          <button
            type="button"
            onClick={() => {
              staffSignOut("admin");
              setAuthed(false);
            }}
            className="pressable rounded-lg px-2 py-1 text-xs font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 pb-32 pt-20">{children}</div>
    </div>
  );
}
