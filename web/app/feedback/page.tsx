"use client";

import { useEffect, useState } from "react";
import {
  feedbackKinds,
  feedbackSeed,
  timeAgo,
  type FeedbackEntry,
  type FeedbackKind,
} from "@/lib/mock-data";
import { Chip, DotTag, SectionTitle } from "@/components/ui";
import { Toast, type ToastState } from "@/components/Toast";
import { haptic } from "@/lib/haptics";
import { feedbackSchema, firstIssue } from "@/lib/validation";

const STORE_KEY = "edubridge:feedback";

export default function FeedbackPage() {
  const [kind, setKind] = useState<FeedbackKind>("Suggestion");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [mine, setMine] = useState<FeedbackEntry[]>([]);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setMine(JSON.parse(raw) as FeedbackEntry[]);
    } catch {
      /* fresh start */
    }
  }, []);

  function send() {
    // Same schema the server will enforce when the backend lands.
    const parsed = feedbackSchema.safeParse({ kind, message, name });
    if (!parsed.success) {
      haptic("warning");
      setToast({ message: firstIssue(parsed.error) });
      return;
    }
    const entry: FeedbackEntry = {
      id: `mine-${Date.now()}`,
      kind: parsed.data.kind,
      message: parsed.data.message,
      sentAt: new Date().toISOString(),
      status: "received",
    };
    const next = [entry, ...mine];
    setMine(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* private mode — the preview still works, it just won't persist */
    }
    haptic("success");
    setToast({
      message: "Recorded in this preview — the real app sends it to the office.",
    });
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Student feedback
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Tell the school how things are going — it is read by people, weekly
        </p>
      </header>

      <section className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
        <div className="rounded-xl border border-hairline bg-paper p-4 sm:p-5">
          {/* One decision on this screen: what you want to say. The kind is
              pre-chosen (most feedback is a suggestion) and your name is
              optional — both are quiet, tappable overrides. */}
          <label htmlFor="fb-message" className="text-sm font-semibold">
            What do you want to tell the school?
          </label>
          <textarea
            id="fb-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={600}
            placeholder="e.g. The Year 7 corridor fountain has been leaking for two weeks."
            enterKeyHint="done"
            className="mt-2 w-full resize-y rounded-xl border border-hairline bg-background px-3.5 py-3 text-base leading-6 outline-none focus:border-accent"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {feedbackKinds.map((k) => (
              <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
                {k}
              </Chip>
            ))}
          </div>

          <div className="mt-3">
            <label htmlFor="fb-name" className="text-xs font-medium text-muted">
              Your name — optional, anonymous is fine
            </label>
            <input
              id="fb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Anonymous"
              className="mt-1.5 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
            />
          </div>

          <button
            type="button"
            onClick={send}
            className="pressable mt-4 min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper"
          >
            Send to the office
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            Design preview — nothing leaves this device yet.
          </p>
        </div>
      </section>

      <section className="rise mt-8 pb-2" style={{ "--i": 2 } as React.CSSProperties}>
        <SectionTitle>Your feedback</SectionTitle>
        <div className="mt-2 space-y-3">
          {[...mine, ...feedbackSeed].map((f) => (
            <article key={f.id} className="rounded-xl border border-hairline bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted">{f.kind}</span>
                <DotTag color={f.status === "replied" ? "green" : "amber"}>
                  {f.status === "replied" ? "Replied by the school" : "Received — in review"}
                </DotTag>
              </div>
              <p className="mt-2 text-[15px] leading-6 text-foreground/90">
                {f.message}
              </p>
              <p className="mt-1 text-xs text-muted">
                Sent {timeAgo(f.sentAt)}
              </p>
              {f.reply && (
                <blockquote className="mt-3 rounded-lg bg-accent-soft px-3.5 py-3 text-sm leading-6 text-foreground/90">
                  {f.reply.text}
                  <footer className="mt-1 text-xs text-muted">
                    {f.reply.by} · {timeAgo(f.reply.at)}
                  </footer>
                </blockquote>
              )}
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Sample conversations for the design preview — real replies come from
          the Student Affairs Office.
        </p>
      </section>

      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}
