"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronIcon, Chip } from "@/components/ui";
import { addHomework } from "@/lib/store";
import { newHomework, TEACHER_CLASSES } from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

const SUBJECTS = ["Mathematics", "English", "Science", "History", "Art"];

type DueChoice =
  | { kind: "tomorrow" }
  | { kind: "week" }
  | { kind: "date"; value: string };

/** The date the chip resolves to, as YYYY-MM-DD for the date input and a
    Date at 17:00 local for the post. */
function resolveDue(due: DueChoice): { label: string; at: Date } {
  const d = new Date();
  d.setHours(17, 0, 0, 0);
  if (due.kind === "tomorrow") {
    d.setDate(d.getDate() + 1);
    return { label: "tomorrow", at: d };
  }
  if (due.kind === "week") {
    // "End of this week": Saturday. If today IS Saturday, a week from now.
    const days = (6 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + days);
    return { label: "end of this week", at: d };
  }
  const [y, m, day] = due.value.split("-").map(Number);
  const picked = new Date(y, m - 1, day, 17, 0, 0, 0);
  return { label: picked.toLocaleDateString("en-MY", { day: "numeric", month: "short" }), at: picked };
}

/**
 * The post screen. Classes come from the teacher's account (assigned at year
 * start — nothing to pick at sign-in); due dates are Tomorrow / End of this
 * week / any date. The post lands in the same store the family app reads.
 */
export default function TeacherPostPage() {
  const [klass, setKlass] = useState<string>(TEACHER_CLASSES[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [due, setDue] = useState<DueChoice>({ kind: "tomorrow" });
  const [title, setTitle] = useState("");
  const [posted, setPosted] = useState<string | null>(null);

  const duePreview = useMemo(() => resolveDue(due), [due]);

  function send() {
    if (!title.trim()) {
      haptic("warning");
      return;
    }
    const { label, at } = resolveDue(due);
    addHomework(newHomework({ subject, title: title.trim(), dueAt: at }));
    haptic("success");
    setPosted(
      `${title.trim()} — ${subject}, ${klass}, due ${label}. The class can see it now.`,
    );
    setTitle("");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Post homework
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Pick a class and a subject, write the task, choose when it's due
        </p>
      </header>

      <div className="rise mt-5 space-y-5" style={{ "--i": 1 } as React.CSSProperties}>
        <section>
          <p className="text-sm font-semibold">Class</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TEACHER_CLASSES.map((c) => (
              <Chip key={c} active={klass === c} onClick={() => setKlass(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <p className="text-sm font-semibold">Subject</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <label htmlFor="t" className="text-sm font-semibold">
            What must they do?
          </label>
          <input
            id="t"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Workbook exercise 5.1, questions 1–8"
            enterKeyHint="done"
            className="mt-2 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
          />
        </section>

        <section>
          <p className="text-sm font-semibold">Due</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip
              active={due.kind === "tomorrow"}
              onClick={() => setDue({ kind: "tomorrow" })}
            >
              Tomorrow
            </Chip>
            <Chip
              active={due.kind === "week"}
              onClick={() => setDue({ kind: "week" })}
            >
              End of this week
            </Chip>
            <Chip
              active={due.kind === "date"}
              onClick={() => {
                if (due.kind !== "date") {
                  const d = new Date();
                  d.setDate(d.getDate() + 2);
                  setDue({ kind: "date", value: d.toISOString().slice(0, 10) });
                }
              }}
            >
              Pick a date
            </Chip>
          </div>
          {due.kind === "date" && (
            <input
              type="date"
              aria-label="Due date"
              value={due.value}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDue({ kind: "date", value: e.target.value })}
              className="mt-2.5 rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
            />
          )}
          <p className="mt-2 text-[13px] text-muted">
            Due {duePreview.label}, 5:00 pm
          </p>
        </section>

        <button
          type="button"
          onClick={send}
          className="pressable min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper"
        >
          Post to {klass}
        </button>

        {posted && (
          <div className="rounded-xl border border-hairline bg-paper p-4">
            <p className="text-sm font-semibold text-accent">Posted ✓</p>
            <p className="mt-1 text-sm text-muted">{posted}</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              See it on the{" "}
              <Link
                href="/homework"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                family app's homework board
              </Link>
              .
            </p>
          </div>
        )}

        <p className="text-[13px] leading-5 text-muted">
          Design preview — nothing is stored beyond this device yet.
        </p>
      </div>
    </div>
  );
}
