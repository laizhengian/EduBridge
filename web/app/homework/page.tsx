"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { CheckGlyph, Chip, DotTag, SubjectChip } from "@/components/ui";
import { PageBackdrop } from "@/components/PageBackdrop";
import { Sheet } from "@/components/Sheet";
import { Toast, type ToastState } from "@/components/Toast";
import { haptic } from "@/lib/haptics";
import {
  dayGroupLabel,
  dueLabel,
  type Homework,
} from "@/lib/mock-data";
import { getHomework, subscribe, toggleDone as storeToggle } from "@/lib/store";

type Filter = "open" | "overdue" | "done" | "all";

export default function HomeworkPage() {
  const [items, setItems] = useState<Homework[]>([]);

  useEffect(() => {
    setItems(getHomework());
    return subscribe(() => setItems(getHomework()));
  }, []);
  const [filter, setFilter] = useState<Filter>("open");
  const [toast, setToast] = useState<ToastState>(null);
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

  function toggleDone(h: Homework) {
    storeToggle(h.id);
    if (!h.done) haptic("success");
    else haptic("light");
    setToast(
      h.done
        ? { message: "Moved back to to do", undo: () => toggleDone({ ...h, done: !h.done }) }
        : {
            message: `“${truncate(h.title)}” marked done`,
            undo: () => toggleDone({ ...h, done: !h.done }),
          },
    );
  }

  function truncate(s: string, n = 34): string {
    return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageBackdrop motif="homework" />
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Homework
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {open.length} to do · {overdue.length} overdue
        </p>
        <ProgressBar done={done.length} total={items.length} className="mt-3" />
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

      <div
        className="rise mt-3 rounded-xl border border-hairline bg-paper px-4 py-1 sm:px-5"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {visible.length === 0 ? (
          <p className="py-5 text-[15px] text-muted">
            {filter === "overdue"
              ? "Nothing overdue."
              : filter === "done"
                ? "Nothing finished yet."
                : "Nothing here yet."}
          </p>
        ) : (
          visible.map((h, i) => (
            <Row key={h.id} h={h} index={i} onToggle={() => toggleDone(h)} />
          ))
        )}
      </div>

      <Toast toast={toast} onDone={() => setToast(null)} />
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
  const [open, setOpen] = useState(false);

  function toggle() {
    haptic(h.done ? "light" : "success");
    onToggle();
  }

  return (
    <article
      className={`no-callout flex items-start gap-3.5 py-3.5${index > 0 ? " border-t border-hairline" : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={h.done}
        aria-label={h.done ? "Mark as not done" : "Mark as done"}
        className={`pressable relative mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all after:absolute after:-inset-2 after:rounded-full after:content-[''] ${
          h.done
            ? "border-accent bg-accent text-accent-contrast"
            : "border-hairline hover:border-accent"
        }`}
      >
        {h.done && <CheckGlyph className="h-4 w-4" />}
      </button>

      <div className="min-w-0 flex-1">
        {/* the title opens the detail sheet — the tick stays the one-tap toggle */}
        <button
          type="button"
          onClick={() => {
            haptic("light");
            setOpen(true);
          }}
          className={`strike block w-full text-left text-[15px] font-medium leading-6 ${
            h.done ? "struck text-muted" : ""
          }`}
        >
          {h.title}
        </button>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <SubjectChip>{h.subject}</SubjectChip>
          <span className="text-xs text-muted">due {dueLabel(h.dueAt)}</span>
          {isOverdue && <DotTag color="red" icon>overdue</DotTag>}
          <span className="text-xs text-muted">
            {h.postedBy} · {dayGroupLabel(h.postedAt)}
          </span>
        </div>
        {h.note && <p className="mt-0.5 text-xs text-muted">{h.note}</p>}
      </div>

      {/* detail sheet: the full item, plus the same toggle for when you want context */}
      <Sheet open={open} onClose={() => setOpen(false)} title={h.subject}>
        <div className="space-y-4 pt-2">
          <div>
            <p className="font-display text-lg font-semibold leading-7">{h.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <SubjectChip>{h.subject}</SubjectChip>
              <span className="text-xs text-muted">due {dueLabel(h.dueAt)}</span>
              {isOverdue && <DotTag color="red" icon>overdue</DotTag>}
            </div>
          </div>
          <div className="rounded-xl border border-hairline bg-background px-4 py-3 text-sm leading-6">
            <p>
              <span className="text-muted">Posted by</span> {h.postedBy}
            </p>
            <p className="text-muted">{dayGroupLabel(h.postedAt)}</p>
            {h.note && (
              <p className="mt-2 border-t border-hairline pt-2">{h.note}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              toggle();
              setOpen(false);
            }}
            className={`pressable min-h-[44px] w-full rounded-xl text-sm font-semibold ${
              h.done
                ? "border border-hairline bg-paper text-foreground"
                : "bg-accent text-accent-contrast"
            }`}
          >
            {h.done ? "Move back to to do" : "Mark as done"}
          </button>
        </div>
      </Sheet>
    </article>
  );
}
