"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip, PlayIcon, BookOpenIcon } from "@/components/ui";
import { getStudy, subscribe } from "@/lib/study-store";
import { timeAgo, type StudyResource } from "@/lib/mock-data";
import { haptic } from "@/lib/haptics";

/**
 * The Study Center. Every card is something a teacher shared — a video to
 * watch, a quiz to play, a worksheet — and every card opens its destination
 * in a new tab. Nothing is embedded, so a third party changing their site
 * can never break this page: the worst case is a stale link, which shows an
 * honest "link hasn't been shared yet" state instead.
 */

const SUBJECTS = [
  "All",
  "Mathematics",
  "Science",
  "English",
  "History",
  "Bahasa Malaysia",
] as const;

const KIND_MARK: Record<StudyResource["kind"], string> = {
  Video: "▶",
  Quiz: "?" ,
  Practice: "✎",
  Reading: "📖",
};

export default function StudyPage() {
  const [items, setItems] = useState<StudyResource[] | null>(null);
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("All");

  useEffect(() => {
    setItems(getStudy());
    return subscribe(() => setItems(getStudy()));
  }, []);

  const shown = useMemo(() => {
    if (!items) return [];
    return subject === "All"
      ? items
      : items.filter((r) => r.subject === subject);
  }, [items, subject]);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Study Center
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Videos, quizzes and practice your teachers share — one tap, straight
          to the source
        </p>
      </header>

      <div className="rise mt-4 -mx-5 overflow-x-auto px-5 pb-1" style={{ "--i": 1 } as React.CSSProperties}>
        <div className="flex w-max gap-2">
          {SUBJECTS.map((s) => (
            <Chip
              key={s}
              active={subject === s}
              onClick={() => {
                haptic("light");
                setSubject(s);
              }}
            >
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {items === null ? (
        <p className="mt-6 text-[15px] text-muted">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="rise mt-6 rounded-xl border border-hairline bg-paper px-4 py-5 text-[15px] text-muted" style={{ "--i": 2 } as React.CSSProperties}>
          Nothing shared for {subject} yet.
        </p>
      ) : (
        <ul className="rise mt-4 space-y-3 pb-4" style={{ "--i": 2 } as React.CSSProperties}>
          {shown.map((r) => (
            <li key={r.id}>
              <StudyCard resource={r} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-[13px] leading-5 text-muted">
        Suggestions and Kahoots stay live on their own sites (YouTube, Kahoot) —
        the app takes you there in one tap and never re-hosts them, so nothing
        breaks when those sites change.
      </p>
    </div>
  );
}

function StudyCard({ resource: r }: { resource: StudyResource }) {
  const body = (
    <>
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-lg text-accent-strong"
      >
        {KIND_MARK[r.kind]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-stone-600">
            {r.kind}
          </span>
          <span className="text-[12px] text-muted">{r.subject}</span>
        </span>
        <span className="mt-1 block text-[15px] font-semibold leading-6">
          {r.title}
        </span>
        {r.note && (
          <span className="mt-0.5 block text-[13px] leading-5 text-muted">
            {r.note}
          </span>
        )}
        <span className="mt-1 block text-[12px] text-muted">
          {r.sharedBy} · {timeAgo(r.sharedAt)}
        </span>
      </span>
    </>
  );

  if (r.url) {
    return (
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => haptic("light")}
        className="pressable flex items-start gap-3.5 rounded-xl border border-hairline bg-paper p-4"
      >
        {body}
        <span className="mt-1 flex shrink-0 items-center gap-1 text-[12px] font-semibold text-accent">
          Open ↗
        </span>
      </a>
    );
  }

  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-dashed border-hairline bg-paper p-4 opacity-90">
      {body}
      <span className="mt-1 shrink-0 text-[12px] font-medium text-muted">
        Link coming
      </span>
    </div>
  );
}
