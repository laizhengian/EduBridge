"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chip } from "@/components/ui";
import { loadProfile, saveProfile, type Role } from "@/lib/profile";
import {
  loadTextSize,
  saveTextSize,
  TEXT_SIZES,
  type TextSize,
} from "@/lib/text-size";
import {
  ACCENTS,
  loadAccent,
  loadMode,
  saveAccent,
  saveMode,
  watchSystemMode,
  type Accent,
  type Mode,
} from "@/lib/appearance";

const ACCENT_SWATCH: Record<Accent, string> = {
  green: "#1d6b4f",
  blue: "#1e5a8a",
  maroon: "#8a2f2f",
  plum: "#6d3d78",
  amber: "#9a6a1f",
};

const MODE_LABEL: Record<Mode, string> = {
  light: "Light",
  dark: "Dark",
  system: "Automatic",
};

const SIZE_LABEL: Record<TextSize, string> = {
  standard: "Standard",
  large: "Large",
  larger: "Larger",
};

/**
 * Settings lives outside the Hub (which is for finding things) — appearance
 * and the signed-in account. Both apps read these preferences.
 */
export default function SettingsPage() {
  const [accent, setAccent] = useState<Accent>("green");
  const [mode, setMode] = useState<Mode>("system");
  const [size, setSize] = useState<TextSize>("standard");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<Role>("student");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAccent(loadAccent());
    setMode(loadMode());
    setSize(loadTextSize());
    const p = loadProfile();
    setName(p?.name ?? "");
    setRole(p?.role ?? "student");
    setReady(true);
    return watchSystemMode();
  }, []);

  function chooseAccent(a: Accent) {
    setAccent(a);
    saveAccent(a);
  }
  function chooseMode(m: Mode) {
    setMode(m);
    saveMode(m);
  }
  function chooseSize(s: TextSize) {
    setSize(s);
    saveTextSize(s);
  }
  function chooseRole(r: Role) {
    setRole(r);
    const p = loadProfile();
    saveProfile({
      name: p?.name || "Demo",
      className: r === "teacher" ? "" : p?.className || "Class 8B",
      role: r,
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <Link
          href="/more"
          className="pressable inline-flex min-h-[44px] items-center text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Hub
        </Link>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Make the app yours — colour, brightness, text size
        </p>
      </header>

      {ready && (
        <div className="rise mt-6 space-y-8" style={{ "--i": 1 } as React.CSSProperties}>
          <section>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
              Colour
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-label={`Use the ${a} colour`}
                  aria-pressed={accent === a}
                  onClick={() => {
                    chooseAccent(a);
                  }}
                  className={`pressable flex h-11 w-11 items-center justify-center rounded-full border-2 ${
                    accent === a ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: ACCENT_SWATCH[a] }}
                  >
                    {accent === a && (
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 rounded-full bg-white"
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Buttons, tabs and highlights follow.{" "}
              <span className="capitalize">{accent}</span> is on.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
              Brightness
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {(["light", "dark", "system"] as Mode[]).map((m) => (
                <Chip key={m} active={mode === m} onClick={() => chooseMode(m)}>
                  {MODE_LABEL[m]}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Automatic follows your device day and night.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
              Text size
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {TEXT_SIZES.map((s) => (
                <Chip key={s} active={size === s} onClick={() => chooseSize(s)}>
                  {SIZE_LABEL[s]}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
              Signed in as
            </h2>
            <div className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-3.5">
              <p className="text-[15px] font-semibold">
                {name || "Not signed in"}
              </p>
              <p className="mt-0.5 text-[13px] text-muted">
                {role === "teacher"
                  ? "Teacher · classes assigned by the school"
                  : role === "student"
                    ? "Student"
                    : "Parent"}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Real accounts arrive with the school sign-in.
              </p>
            </div>
            <p className="mt-3 text-[13px] font-medium text-muted">
              Preview the other app:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["student", "teacher"] as Role[]).map((r) => (
                <Chip key={r} active={role === r} onClick={() => chooseRole(r)}>
                  {r === "teacher" ? "Teacher" : "Student / Parent"}
                </Chip>
              ))}
            </div>
            {role === "teacher" ? (
              <div className="mt-3 flex flex-wrap gap-2.5">
                <Link
                  href="/teacher"
                  className="pressable rounded-xl bg-accent px-5 text-[15px] font-semibold leading-[48px] text-accent-contrast"
                >
                  Open the teacher app
                </Link>
                <button
                  type="button"
                  onClick={() => chooseRole("student")}
                  className="pressable rounded-xl border border-hairline bg-paper px-5 text-[15px] font-semibold leading-[46px]"
                >
                  Sign out of preview
                </button>
              </div>
            ) : (
              <p className="mt-3 text-[13px] leading-5 text-muted">
                Teacher tools stay hidden for students and parents — exactly how
                it works with real accounts.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
