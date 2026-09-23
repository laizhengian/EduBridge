// Teacher-side state for the preview. Everything lives in memory for the
// session (this is a design preview, not persistence) and every write lands
// in the same stores the family app reads — proving the one-vault
// architecture before the database exists.
import {
  homeworkSeed,
  roster,
  type Homework,
  type RosterStudent,
} from "@/lib/mock-data";

/** The signed-in teacher's classes. In the preview this stands in for the
    account: classes are ASSIGNED at the start of the year (by the office),
    never picked by the teacher at sign-in — the app is personalized to what
    they teach, and updates when the year rolls over. */
export const TEACHER_CLASSES = ["Class 7A", "Class 8B", "Class 9A"] as const;

/** Reason quick-picks. Optional by design — writing a custom reason is one
    tap away, and no mark ever waits on one. Custom-written reasons join this
    list as recurring picks once they repeat (the vault clusters them). */
export const REASON_OPTIONS: readonly string[] = [
  "Sick",
  "Medical certificate",
  "Family matter",
  "School duty",
  "Late transport",
  "Traffic",
];

export type AttState = "present" | "late" | "excused" | "absent";
export const ATT_STATES: AttState[] = ["present", "late", "excused", "absent"];

/** Roster of a class with all students present — the template that fills
    itself. A well-behaved class is "Post" with nothing to change. The demo
    rotates the sample names per class; the vault supplies the real roll. */
export function freshRoster(klass: string): RosterStudent[] {
  const shift = klass.length % roster.length;
  return roster
    .slice(shift)
    .concat(roster.slice(0, shift))
    .map((s) => ({ ...s, att: "present" as AttState }));
}

export function cycleAtt(s: RosterStudent): RosterStudent {
  const i = ATT_STATES.indexOf(s.att);
  const next = ATT_STATES[(i + 1) % ATT_STATES.length];
  return { ...s, att: next };
}

export function attLabel(s: AttState): string {
  return s === "present"
    ? "In"
    : s === "late"
      ? "Late"
      : s === "excused"
        ? "Excused"
        : "Away";
}

/** The teacher's homework post, written straight into the shared homework
    store's shape — the family app picks it up with zero changes. */
export function newHomework(input: {
  subject: string;
  title: string;
  note?: string;
  dueAt: Date;
}): Homework {
  return {
    id: `t-${Date.now()}`,
    subject: input.subject,
    title: input.title,
    note: input.note,
    dueAt: input.dueAt.toISOString(),
    postedBy: "Ms. Ravin", // the signed-in teacher, once accounts exist
    postedAt: new Date().toISOString(),
    done: false,
  };
}

export { homeworkSeed };
