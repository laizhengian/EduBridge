"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@/components/ui";
import { loadProfile, saveProfile, type Profile } from "@/lib/profile";

const CLASSES = [
  "Class 5A", "Class 5B",
  "Class 7A", "Class 7B",
  "Class 8A", "Class 8B",
  "Class 9A", "Class 9B",
  "Class 10A", "Class 10B",
];

type Step = "signin" | "username" | "class" | "done";

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("signin");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [klass, setKlass] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const p = loadProfile();
    if (p) {
      setName(p.name);
      setKlass(p.className);
      setStep("done");
    }
  }, []);

  function finish(p: Profile) {
    saveProfile(p);
    router.replace("/");
  }

  function submitUsername() {
    if (!username.trim() || !password.trim()) {
      setError("Type both the username and the password from the school.");
      return;
    }
    setError("");
    setName(username.trim());
    setStep("class");
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
      <div className="rise text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          EduBridge
        </h1>
        <p className="mt-1.5 text-[15px] leading-6 text-muted">
          Homework, timetable, events and school announcements — for students and
          parents.
        </p>
      </div>

      {step === "signin" && (
        <div className="rise mt-8 space-y-3" style={{ "--i": 1 } as React.CSSProperties}>
          <button
            type="button"
            onClick={() => setStep("class")}
            className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-hairline bg-paper text-[15px] font-semibold shadow-sm transition-transform active:scale-[0.99]"
          >
            <GIcon /> Sign in with school Google account
          </button>
          <button
            type="button"
            onClick={() => setStep("username")}
            className="min-h-[52px] w-full rounded-xl border border-hairline bg-paper text-[15px] font-semibold text-muted transition-transform active:scale-[0.99]"
          >
            I have a username and password
          </button>
          <p className="pt-1 text-center text-xs text-muted">
            Only @oakbridge.edu.my accounts can sign in. In this preview both buttons
            continue without checking.
          </p>
        </div>
      )}

      {step === "username" && (
        <div className="rise mt-8 space-y-4" style={{ "--i": 1 } as React.CSSProperties}>
          <div>
            <label htmlFor="u" className="text-sm font-semibold">Username</label>
            <input
              id="u"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ian.tan"
              autoCapitalize="none"
              className="mt-1.5 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="p" className="text-sm font-semibold">Password</label>
            <input
              id="p"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="From the school office"
              className="mt-1.5 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="button"
            onClick={submitUsername}
            className="min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper transition-transform active:scale-[0.99]"
          >
            Sign in
          </button>
          <p className="text-center text-xs text-muted">
            In this preview any username and password will work.
          </p>
        </div>
      )}

      {step === "class" && (
        <div className="rise mt-8" style={{ "--i": 1 } as React.CSSProperties}>
          <p className="text-center text-sm font-semibold">
            {name ? `${name}, which class are you in?` : "Which class are you in?"}
          </p>
          <p className="mt-1 text-center text-xs text-muted">
            This sets your timetable and homework for the whole app.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CLASSES.map((c) => (
              <Chip key={c} active={klass === c} onClick={() => setKlass(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <button
            type="button"
            disabled={!klass}
            onClick={() => finish({ name: name || "Student", className: klass! })}
            className="mt-6 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper transition-transform active:scale-[0.99] disabled:opacity-40"
          >
            Start using the app
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="rise mt-8 text-center" style={{ "--i": 1 } as React.CSSProperties}>
          <p className="text-[15px] text-muted">
            Signed in{name ? ` as ${name}` : ""}
            {klass ? ` · ${klass}` : ""}
          </p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-4 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper transition-transform active:scale-[0.99]"
          >
            Go to Today
          </button>
          <button
            type="button"
            onClick={() => setStep("class")}
            className="mt-2 min-h-[44px] w-full rounded-xl text-sm font-semibold text-muted"
          >
            Change class
          </button>
        </div>
      )}
    </div>
  );
}

function GIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.03c2.2-2.05 3.5-5.05 3.5-8.78Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.06 7.9-2.9l-3.75-2.9c-1 .7-2.35 1.2-4.15 1.2a7.2 7.2 0 0 1-6.8-4.95l-.14.01-3.1 2.4-.04.14C3.9 20.75 7.65 24 12 24Z" />
      <path fill="#FBBC05" d="M5.2 14.45A7.4 7.4 0 0 1 4.8 12c0-.85.15-1.7.4-2.45l-.01-.16-3.13-2.43-.1.05A11.9 11.9 0 0 0 .8 12c0 1.93.47 3.76 1.3 5.4l3.2-2.95Z" />
      <path fill="#EA4335" d="M12 4.6c2.2 0 3.65.94 4.5 1.73l3.3-3.2C17.9 1.24 15.2 0 12 0 7.65 0 3.9 3.24 1.95 6.6l3.23 2.95A7.25 7.25 0 0 1 12 4.6Z" />
    </svg>
  );
}
