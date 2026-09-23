// Teacher-side state for the preview. Everything lives in memory for the
// session (this is a design preview, not persistence) and every write lands
// in the same stores the family app reads — proving the "one vault, every
// surface" architecture before the database exists.
import {
  homeworkSeed,
  roster,
  type Homework,
  type RosterStudent,
} from "@/lib/mock-data";

export type AttState = "present" | "late" | "excused" | "absent";
export const ATT_STATES: AttState[] = ["present", "late", "excused", "absent"];

/** Roster of this class with all students present — the template that fills
    itself. A well-behaved class needs two taps: "Everyone in?" → "Post". */
export function freshRoster(): RosterStudent[] {
  return roster.map((s) => ({ ...s, att: "present" as AttState }));
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
