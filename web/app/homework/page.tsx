"use client";

import { useMemo, useState } from "react";
import {
  Chip,
  CloseIcon,
  DotTag,
  PlusIcon,
  SectionTitle,
  SubjectChip,
} from "@/components/ui";
import {
  dayGroupLabel,
  dueLabel,
  homeworkSeed,
  type Homework,
} from "@/lib/mock-data";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Bahasa Malaysia",
  "History",
  "Mandarin",
  "ICT",
  "PE",
];

type Filter = "open" | "overdue" | "done" | "all";

export default function HomeworkPage() {
  const [items, setItems] = useState<Homework[]>(homeworkSeed);
  const [filter, setFilter] = useState<Filter>("open");
  const [posting, setPosting] = useState(false);
  const now = new Date();

  const { open, done } = useMemo(() => {
    const open = items
      .filter((h) => !h.done)
      .sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
    const done = items
      .filter((h) => h.done)
      .sort((a, b) => +new Date(b.dueAt) - +new Date(a.dueAt));
    return { open, done };
  }, [items]);

  const overdue = open.filter((h) => new Date(h.dueAt) < now);
  const upcoming = open.filter((h) => new Date(h.dueAt) >= now);
  const visible =
    filter === "overdue"
      ? overdue
      : filter === "done"
        ? done
        : filter === "all"
          ? [...open, ...done]
          : upcoming;

  function toggleDone(id: string) {
    setItems((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)),
    );
  }

  function addPost(p: Omit<Homework, "id" | "done">) {
    setItems((prev) => [{ ...p, id: crypto.randomUUID(), done: false }, ...prev]);
    setPosting(false);
  }

  return (
    <div className="md:grid md:grid-cols-[1fr_280px] md:gap-12">
      <main>
        <header className="rise">
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Homework
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {open.length} to do · {overdue.length} overdue
          </p>
        </header>

        <div className="rise mt-5 flex gap-2 overflow-x-auto pb-1" style={{ "--i": 1 } as React.CSSProperties}>
          <Chip active={filter === "open"} onClick={() => setFilter("open")}>
            To do ({open.length})
          </Chip>
          <Chip active={filter === "overdue"} onClick={() => setFilter("overdue")}>
            Overdue ({overdue.length})
          </Chip>
          <Chip active={filter === "done"} onClick={() => setFilter("done")}>
            Done ({done.length})
          </Chip>
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
        </div>

        <div className="mt-2">
          {visible.length === 0 ? (
            <p className="py-4 text-[15px] text-muted">
              {filter === "overdue"
                ? "Nothing overdue."
                : filter === "done"
                  ? "Nothing finished yet."
                  : "Nothing here yet."}
            </p>
          ) : (
            visible.map((h, i) => (
              <Row
                key={h.id}
                h={h}
                index={i}
                onToggle={() => toggleDone(h.id)}
              />
            ))
          )}
        </div>
      </main>

      <aside className="mt-10 space-y-10 md:mt-12">
        <section className="rise" style={{ "--i": 2 } as React.CSSProperties}>
          <SectionTitle>Finished today</SectionTitle>
          <p className="mt-2 font-display text-3xl font-semibold text-accent">
            {done.filter((h) => new Date(h.dueAt) >= new Date(now.getTime() - 86400000)).length}
          </p>
        </section>

        <section className="rise hidden md:block" style={{ "--i": 3 } as React.CSSProperties}>
          <SectionTitle>Add</SectionTitle>
          <button
            type="button"
            onClick={() => setPosting(true)}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-paper shadow-md transition-transform active:scale-95"
          >
            <PlusIcon className="h-4 w-4" /> Post homework
          </button>
        </section>
      </aside>

      {posting && <PostSheet onClose={() => setPosting(false)} onPost={addPost} />}
    </div>
  );
}

function Row({
  h,
  index,
  onToggle,
}: {
  h: Homework;
  index: number;
  onToggle: () => void;
}) {
  const isOverdue = !h.done && new Date(h.dueAt) < new Date();
  return (
    <article
      className={`rise flex items-start gap-3.5 border-b border-hairline py-3.5 first:border-t ${
        isOverdue ? "border-l-2 border-l-danger pl-3" : ""
      }`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={h.done}
        aria-label={h.done ? "Mark as not done" : "Mark as done"}
        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-base transition-all active:scale-90 ${
          h.done
            ? "border-accent bg-accent text-paper"
            : "border-stone-300 text-transparent hover:border-accent"
        }`}
      >
        ✓
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`strike text-[15px] font-medium leading-6 ${
            h.done ? "struck text-muted" : ""
          }`}
        >
          {h.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <SubjectChip>{h.subject}</SubjectChip>
          <span className="text-xs text-muted">due {dueLabel(h.dueAt)}</span>
          {isOverdue && <DotTag color="red">overdue</DotTag>}
          <span className="text-xs text-muted">
            {h.postedBy} · {dayGroupLabel(h.postedAt)}
          </span>
        </div>
        {h.note && <p className="mt-0.5 text-xs text-muted">{h.note}</p>}
      </div>
    </article>
  );
}

function PostSheet({
  onClose,
  onPost,
}: {
  onClose: () => void;
  onPost: (p: Omit<Homework, "id" | "done">) => void;
}) {
  const [subject, setSubject] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [dueMode, setDueMode] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState("");
  const [note, setNote] = useState("");

  const valid = subject !== null && title.trim().length > 2;
  const now = new Date();

  function submit() {
    if (!valid || subject === null) return;
    let dueAt: string;
    if (dueMode === "today") {
      dueAt = endOfDay(now);
    } else if (dueMode === "tomorrow") {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      dueAt = endOfDay(t);
    } else {
      dueAt = customDate ? endOfDay(new Date(customDate)) : endOfDay(now);
    }
    onPost({
      subject,
      title: title.trim(),
      note: note.trim() || undefined,
      dueAt,
      postedBy: "Ian (you)",
      postedAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#211d19]/40 md:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-paper p-6 pb-10 shadow-2xl md:rounded-2xl md:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-display text-xl font-semibold">Post homework</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-[#f0ebe2]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <SectionTitle>Subject</SectionTitle>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>What is it</SectionTitle>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Workbook exercise 4.2"
              className="mt-2 w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-base outline-none focus:border-accent"
            />
          </div>

          <div>
            <SectionTitle>Due</SectionTitle>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Chip active={dueMode === "today"} onClick={() => setDueMode("today")}>
                Today
              </Chip>
              <Chip active={dueMode === "tomorrow"} onClick={() => setDueMode("tomorrow")}>
                Tomorrow
              </Chip>
              <Chip active={dueMode === "custom"} onClick={() => setDueMode("custom")}>
                Pick date
              </Chip>
              {dueMode === "custom" && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="rounded-lg border border-hairline bg-background px-3 py-2 text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <SectionTitle>Note, optional</SectionTitle>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Page numbers, instructions"
              className="mt-2 w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-base outline-none focus:border-accent"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!valid}
            className="min-h-[48px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper transition-transform active:scale-[0.99] disabled:opacity-40"
          >
            Post to class
          </button>
        </div>
      </div>
    </div>
  );
}

function endOfDay(d: Date): string {
  const t = new Date(d);
  t.setHours(23, 59, 0, 0);
  return t.toISOString();
}
