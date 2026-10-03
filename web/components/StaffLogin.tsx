"use client";

import { useState } from "react";
import { ShieldIcon } from "@/components/ui";
import { staffSignIn, type StaffRole } from "@/lib/staff-auth";

/**
 * Staff sign-in for the preview build. One shared card for both staff apps —
 * the role sets the wording. Fixed preview accounts for now; the card is
 * written so the swap to real Supabase auth touches nothing but the check.
 */
export function StaffLogin({
  role,
  onSignedIn,
}: {
  role: StaffRole;
  onSignedIn: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);

  const isAdmin = role === "admin";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (staffSignIn(role, username.trim(), password)) {
      onSignedIn();
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-hairline bg-paper p-6 shadow-[0_16px_48px_-24px_rgba(33,29,25,0.25)]">
          <span
            aria-hidden
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isAdmin ? "bg-indigo-600/10 text-indigo-700" : "bg-accent-soft text-accent"
            }`}
          >
            <ShieldIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold tracking-tight">
            {isAdmin ? "Admin sign-in" : "Teacher sign-in"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            EduBridge staff tools · {isAdmin ? "the office console" : "your classes"}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setWrong(false);
                }}
                autoCapitalize="none"
                autoComplete="username"
                autoFocus
                className="mt-1 w-full rounded-xl border border-hairline bg-background px-4 py-3 text-[15px] outline-none focus:border-accent"
                placeholder={isAdmin ? "admin" : "teacher"}
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setWrong(false);
                }}
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-hairline bg-background px-4 py-3 text-[15px] outline-none focus:border-accent"
                placeholder="••••••"
              />
            </label>

            {wrong && (
              <p role="alert" className="text-[13px] font-medium text-danger">
                Wrong username or password.
              </p>
            )}

            <button
              type="submit"
              className={`pressable min-h-[52px] w-full rounded-xl text-[15px] font-semibold text-white ${
                isAdmin ? "bg-indigo-700 hover:bg-indigo-800" : "bg-accent hover:bg-accent-strong"
              }`}
            >
              Sign in
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs leading-5 text-muted">
          Preview sign-in — moves to proper school accounts when the database arrives.
        </p>
      </div>
    </div>
  );
}
