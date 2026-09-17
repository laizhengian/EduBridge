// Mock data for the design preview. The shapes intentionally mirror the
// future Supabase tables so real data can replace this file later.

export type Homework = {
  id: string;
  subject: string;
  title: string;
  note?: string;
  dueAt: string; // ISO
  postedBy: string;
  postedAt: string; // ISO
  done: boolean;
};

export type TimetableSlot = {
  start: string; // "08:00"
  end: string; // "09:00"
  subject: string;
  room: string;
  teacher: string;
};

export type SchoolEvent = {
  id: string;
  date: string; // ISO
  title: string;
  type: "event" | "holiday" | "exam";
  location?: string;
  /** Longer description, shown when the reader taps "More". */
  details?: string;
};

export type Circular = {
  id: string;
  title: string;
  snippet: string;
  postedBy: string;
  postedAt: string; // ISO
};

function at(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function hhmm(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** "Today 15:00" / "Tomorrow 17:00" / "Fri 19 Sep 17:00" / "Yesterday 09:00" */
export function dueLabel(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const dayDiff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000,
  );
  const time = hhmm(iso);
  if (dayDiff === 0) return `Today ${time}`;
  if (dayDiff === 1) return `Tomorrow ${time}`;
  if (dayDiff === -1) return `Yesterday ${time}`;
  const label = d.toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${label} ${time}`;
}

/** Group heading without time: "Today", "Tomorrow", "Friday, 19 Sep" */
export function dayGroupLabel(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const dayDiff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000,
  );
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  if (dayDiff === -1) return "Yesterday";
  return d.toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export const homeworkSeed: Homework[] = [
  {
    id: "h1",
    subject: "Mathematics",
    title: "Workbook exercise 4.2 (quadratic equations)",
    dueAt: at(-1, 17, 0),
    postedBy: "Mr. Tan",
    postedAt: at(-2, 9, 15),
    done: false,
  },
  {
    id: "h2",
    subject: "English",
    title: "Argumentative essay — first draft",
    note: "350–400 words, print or hand in during class.",
    dueAt: at(0, 23, 59),
    postedBy: "Ms. Wong",
    postedAt: at(-1, 14, 40),
    done: false,
  },
  {
    id: "h3",
    subject: "Chemistry",
    title: "Lab report: neutralisation experiment",
    dueAt: at(0, 15, 0),
    postedBy: "Mr. Raj",
    postedAt: at(-1, 8, 5),
    done: false,
  },
  {
    id: "h4",
    subject: "Physics",
    title: "Worksheet: forces and motion",
    dueAt: at(1, 9, 0),
    postedBy: "Mr. Raj",
    postedAt: at(-1, 10, 30),
    done: false,
  },
  {
    id: "h5",
    subject: "Bahasa Malaysia",
    title: "Komsas notes: bab 3",
    dueAt: at(1, 17, 0),
    postedBy: "Pn. Aida",
    postedAt: at(-2, 12, 0),
    done: false,
  },
  {
    id: "h6",
    subject: "History",
    title: "Source analysis: Malayan Union",
    dueAt: at(4, 12, 0),
    postedBy: "Mr. Lim",
    postedAt: at(-3, 9, 0),
    done: false,
  },
  {
    id: "h7",
    subject: "ICT",
    title: "Poster: digital safety",
    dueAt: at(-2, 12, 0),
    postedBy: "Ms. Lee",
    postedAt: at(-5, 9, 0),
    done: true,
  },
  {
    id: "h8",
    subject: "Mandarin",
    title: "Vocabulary list chapter 5",
    dueAt: at(-1, 8, 0),
    postedBy: "Ms. Chen",
    postedAt: at(-4, 15, 20),
    done: true,
  },
];

export const circulars: Circular[] = [
  {
    id: "c1",
    title: "Change of school holiday dates — September",
    snippet:
      "The holiday originally scheduled for 14–15 September is now moved to 21 September (Monday), following the postponement of National Sports Day…",
    postedBy: "School Office",
    postedAt: at(-1, 9, 0),
  },
  {
    id: "c2",
    title: "Sports Day track events — final list and schedule",
    snippet:
      "Please find attached the final list of student participants and the track event schedule for this Friday…",
    postedBy: "Sports Department",
    postedAt: at(-2, 12, 30),
  },
];

export const events: SchoolEvent[] = [
  {
    id: "e1",
    date: at(3, 8, 0),
    title: "Sports Day",
    type: "event",
    location: " Stadium",
    details:
      "Gates open 7:30am. Students arrive in house shirts. Track events run from 8:00am to 1:00pm; the parent relay is at 12:15pm. Food stalls accept cashless vouchers only.",
  },
  {
    id: "e2",
    date: at(5, 8, 0),
    title: "Public holiday (replacement)",
    type: "holiday",
  },
  {
    id: "e3",
    date: at(9, 9, 0),
    title: "Junior Kitchen Workshop — Grades 3, 4 & 5",
    type: "event",
    details:
      "Sign-up closes the Friday before. Aprons and ingredients are provided; students only need a water bottle and a container to bring their bakes home.",
  },
  {
    id: "e4",
    date: at(16, 8, 0),
    title: "Mid-term examinations begin",
    type: "exam",
  },
  {
    id: "e5",
    date: at(24, 14, 0),
    title: "Parent–Teacher Conference",
    type: "event",
  },
];

export const timetable: Record<"Mon" | "Tue" | "Wed" | "Thu" | "Fri", TimetableSlot[]> = {
  Mon: [
    { start: "08:00", end: "09:00", subject: "Mathematics", room: "A-204", teacher: "Mr. Tan" },
    { start: "09:00", end: "10:00", subject: "English", room: "B-101", teacher: "Ms. Wong" },
    { start: "10:30", end: "11:30", subject: "Physics", room: "Lab 2", teacher: "Mr. Raj" },
    { start: "11:30", end: "12:30", subject: "Bahasa Malaysia", room: "C-105", teacher: "Pn. Aida" },
    { start: "13:30", end: "14:30", subject: "History", room: "B-102", teacher: "Mr. Lim" },
  ],
  Tue: [
    { start: "08:00", end: "09:00", subject: "Chemistry", room: "Lab 1", teacher: "Mr. Raj" },
    { start: "09:00", end: "10:00", subject: "Mathematics", room: "A-204", teacher: "Mr. Tan" },
    { start: "10:30", end: "11:30", subject: "English", room: "B-101", teacher: "Ms. Wong" },
    { start: "11:30", end: "12:30", subject: "ICT", room: "Lab 3", teacher: "Ms. Lee" },
    { start: "13:30", end: "14:30", subject: "Mandarin", room: "C-110", teacher: "Ms. Chen" },
  ],
  Wed: [
    { start: "08:00", end: "09:00", subject: "English", room: "B-101", teacher: "Ms. Wong" },
    { start: "09:00", end: "10:00", subject: "Biology", room: "Lab 2", teacher: "Ms. Goh" },
    { start: "10:30", end: "11:30", subject: "Mathematics", room: "A-204", teacher: "Mr. Tan" },
    { start: "11:30", end: "12:30", subject: "History", room: "B-102", teacher: "Mr. Lim" },
    { start: "13:30", end: "15:00", subject: "PE", room: "Field", teacher: "Coach Dan" },
  ],
  Thu: [
    { start: "08:00", end: "09:00", subject: "Bahasa Malaysia", room: "C-105", teacher: "Pn. Aida" },
    { start: "09:00", end: "10:00", subject: "Physics", room: "Lab 2", teacher: "Mr. Raj" },
    { start: "10:30", end: "11:30", subject: "Chemistry", room: "Lab 1", teacher: "Mr. Raj" },
    { start: "11:30", end: "12:30", subject: "Mathematics", room: "A-204", teacher: "Mr. Tan" },
    { start: "13:30", end: "14:30", subject: "English", room: "B-101", teacher: "Ms. Wong" },
  ],
  Fri: [
    { start: "08:00", end: "09:00", subject: "Mandarin", room: "C-110", teacher: "Ms. Chen" },
    { start: "09:00", end: "10:00", subject: "Mathematics", room: "A-204", teacher: "Mr. Tan" },
    { start: "10:30", end: "11:30", subject: "Biology", room: "Lab 2", teacher: "Ms. Goh" },
    { start: "11:30", end: "12:30", subject: "ICT", room: "Lab 3", teacher: "Ms. Lee" },
    { start: "13:30", end: "14:30", subject: "Assembly", room: "Hall", teacher: "—" },
  ],
};
