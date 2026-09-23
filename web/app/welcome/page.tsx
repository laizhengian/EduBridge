"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { Chip } from "@/components/ui";
import { haptic } from "@/lib/haptics";
import { loadProfile, saveProfile, type Profile, type Role } from "@/lib/profile";

const CLASSES = [
  "Class 5A", "Class 5B",
  "Class 7A", "Class 7B",
  "Class 8A", "Class 8B",
  "Class 9A", "Class 9B",
  "Class 10A", "Class 10B",
];

type Step = "signin" | "username" | "role" | "class" | "done";

/** Stage changes animate like a native flow: the old stage slides up and
    fades, the new one slides in. Nothing jumps. Reduced motion = fade only. */
const stage = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function WelcomePage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("signin");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [klass, setKlass] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("student");
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
      haptic("warning");
      setError("Type both the username and the password from the school.");
      return;
    }
    setError("");
    haptic("success");
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

      <AnimatePresence mode="wait" initial={false}>
        {step === "signin" && (
          <motion.div
            key="signin"
            {...stage}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            className="mt-8 space-y-3"
          >
            {/* One decision: sign in. The alternative waits below, quiet, until wanted. */}
            <button
              type="button"
              onClick={() => {
                haptic("light");
                setStep("role");
              }}
              className="pressable flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-hairline bg-paper text-[15px] font-semibold shadow-sm"
            >
              <GIcon /> Sign in with school Google account
            </button>
            <button
              type="button"
              onClick={() => {
                haptic("light");
                setStep("username");
              }}
              className="pressable mx-auto flex min-h-[44px] items-center text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Use a username and password instead
            </button>
            <p className="pt-1 text-center text-xs text-muted">
              Only school Google accounts can sign in. In this preview both ways
              continue without checking.
            </p>
          </motion.div>
        )}

        {step === "username" && (
          <motion.form
            key="username"
            {...stage}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitUsername();
            }}
          >
            <div>
              <label htmlFor="u" className="text-sm font-semibold">Username</label>
              <input
                id="u"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ian.tan"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="username"
                enterKeyHint="next"
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
                autoComplete="current-password"
                enterKeyHint="go"
                className="mt-1.5 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              className="pressable min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper"
            >
              Sign in
            </button>
            <p className="text-center text-xs text-muted">
              In this preview any username and password will work.
            </p>
          </motion.form>
        )}

        {step === "role" && (
          <motion.div
            key="role"
            {...stage}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            className="mt-8 space-y-3"
          >
            <p className="text-center text-sm font-semibold">
              Which are you?
            </p>
            <p className="mx-auto mt-1 max-w-[34ch] text-center text-xs leading-5 text-muted">
              Parents pick “student” — you see everything about your child.
              The app shows the tools that match.
            </p>
            <button
              type="button"
              onClick={() => {
                haptic("light");
                setRole("student");
                setStep("class");
              }}
              className="pressable flex min-h-[64px] w-full flex-col items-start justify-center rounded-xl border border-hairline bg-paper px-4 text-left shadow-sm"
            >
              <span className="text-[15px] font-semibold">Student or parent</span>
              <span className="mt-0.5 text-[13px] text-muted">
                Homework, timetable, events and school announcements
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                haptic("light");
                setRole("teacher");
                setStep("class");
              }}
              className="pressable flex min-h-[64px] w-full flex-col items-start justify-center rounded-xl border border-hairline bg-paper px-4 text-left shadow-sm"
            >
              <span className="text-[15px] font-semibold">Teacher</span>
              <span className="mt-0.5 text-[13px] text-muted">
                Everything above, plus attendance and homework posting
              </span>
            </button>
          </motion.div>
        )}

        {step === "class" && (
          <motion.div
            key="class"
            {...stage}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            className="mt-8"
          >
            <p className="text-center text-sm font-semibold">
              {role === "teacher"
                ? "Which class do you teach?"
                : name
                  ? `${name}, which class are you in?`
                  : "Which class are you in?"}
            </p>
            <p className="mt-1 text-center text-xs text-muted">
              This sets {role === "teacher" ? "the class you take attendance for" : "your timetable and homework"} for the whole app.
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
              onClick={() => {
                haptic("success");
                finish({
                  name: name || (role === "teacher" ? "Teacher" : "Student"),
                  className: klass!,
                  role,
                });
              }}
              className="pressable mt-6 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper disabled:opacity-40"
            >
              Start using the app
            </button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            {...stage}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            className="mt-8 text-center"
          >
            <p className="text-[15px] text-muted">
              Signed in{name ? ` as ${name}` : ""}
              {klass ? ` · ${klass}` : ""}
            </p>
            <button
              type="button"
              onClick={() => {
                haptic("light");
                router.replace("/");
              }}
              className="pressable mt-4 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper"
            >
              Go to Today
            </button>
            <button
              type="button"
              onClick={() => {
                haptic("light");
                setStep("class");
              }}
              className="pressable mt-2 min-h-[44px] w-full rounded-xl text-sm font-semibold text-muted"
            >
              Change class
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
