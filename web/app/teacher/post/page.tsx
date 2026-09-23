"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronIcon, Chip } from "@/components/ui";
import { addHomework } from "@/lib/store";
import { newHomework } from "@/lib/teacher-store";
import { haptic } from "@/lib/haptics";

const CLASSES = ["Class 7A", "Class 8B", "Class 9A"];
const SUBJECTS = ["Mathematics", "English", "Science", "History", "Art"];
const DUE_CHIPS: { label: string; days: number; hour: number }[] = [
  { label: "Today", days: 0, hour: 17 },
  { label: "Tomorrow", days: 1, hour: 17 },
  { label: "In 3 days", days: 3, hour: 17 },
  { label: "Next week", days: 7, hour: 17 },
];

/**
 * The 30-second post (features.md §4). Three tappable choices and one typed
 * line — every dropdown is a chip, every default is pre-chosen. The post
 * writes into the same store the family app reads, so it appears on
 * students' boards immediately: one vault, every surface.
 */
export default function TeacherPostPage() {
  const [klass, setKlass] = useState(CLASSES[1]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [due, setDue] = useState(DUE_CHIPS[1]);
  const [title, setTitle] = useState("");
  const [posted, setPosted] = useState<string | null>(null);

  function send() {
    if (!title.trim()) {
      haptic("warning");
      setPosted(null);
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + due.days);
    d.setHours(due.hour, 0, 0, 0);
    addHomework(newHomework({ subject, title: title.trim(), dueAt: d }));
    haptic("success");
    setPosted(
      `${title.trim()} · ${subject} · due ${due.label.toLowerCase()} — visible to the class now`,
    );
    setTitle("");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Teacher · Homework
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Post homework
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Three taps and one line — no forms to fight
        </p>
      </header>

      <div className="rise mt-5 space-y-5" style={{ "--i": 1 } as React.CSSProperties}>
        <section>
          <p className="text-sm font-semibold">Which class?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CLASSES.map((c) => (
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
            What must they do? (the one thing to type)
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
            {DUE_CHIPS.map((d) => (
              <Chip key={d.label} active={due.label === d.label} onClick={() => setDue(d)}>
                {d.label}
              </Chip>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={send}
          className="pressable min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper"
        >
          Post to the class
        </button>

        {posted && (
          <div className="rounded-xl border border-hairline bg-paper p-4">
            <p className="text-sm font-semibold text-accent">Posted ✓</p>
            <p className="mt-1 text-sm text-muted">{posted}</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              Open the{" "}
              <Link
                href="/homework"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                Homework tab
              </Link>{" "}
              — the class's board already shows it. Same vault, every surface.
            </p>
          </div>
        )}

        <p className="text-[13px] leading-5 text-muted">
          Design preview — nothing is stored beyond this device. Details,
          attachments and “repeat last week” come with the real vault.
        </p>

        <p className="text-[13px]">
          <Link
            href="/teacher/attendance"
            className="pressable inline-flex min-h-[44px] items-center font-semibold text-accent underline-offset-4 hover:underline"
          >
            Back to attendance
            <ChevronIcon className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
}
