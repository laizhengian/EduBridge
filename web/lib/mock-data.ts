// Mock data for the design preview. The shapes intentionally mirror the
// future Supabase tables so real data can replace this file later.
//
// School identity lives in ONE place (below) so the app can be handed to any
// school without hunting through screens for someone else's name.

/** The single source of school identity for the whole app. Every screen reads
    this — no school name, address, or domain is ever hardcoded elsewhere. */
export const school = {
  name: "Hillcrest School", // placeholder — set per deployment (env/config)
  domain: "school.edu.my", // the only domain school sign-ins accept
  address: "12 Hillcrest Road, 46150 Petaling Jaya",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hillcrest+School",
} as const;

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
  /** Longer description, shown when the reader taps "More". Real school
      letters run long — the renderer splits on blank lines into paragraphs. */
  details?: string;
  /** Links inside the event letter (forms, maps, full schedules). Each opens
      in a new tab; the vault will store these as a links column (backend plan). */
  links?: { label: string; url: string }[];
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
  {
    id: "h9",
    subject: "Art",
    title: "Lantern sketch for Raya decor",
    dueAt: at(2, 12, 0),
    postedBy: "Mr. Ravi",
    postedAt: at(-1, 10, 0),
    done: false,
  },
  {
    id: "h10",
    subject: "PE",
    title: "Track try-outs permission slip",
    dueAt: at(1, 12, 0),
    postedBy: "Ms. Nadia",
    postedAt: at(0, 9, 0),
    done: false,
  },
  {
    id: "h11",
    subject: "Geography",
    title: "River processes: diagrams 3–4",
    dueAt: at(6, 12, 0),
    postedBy: "Mr. Wood",
    postedAt: at(-2, 14, 0),
    done: false,
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
  {
    id: "c4",
    title: "Road closure in front of the school on Friday",
    snippet:
      "Jalan Kenari will be closed 6:30–8:30am for utility works. Please use the Southgate drop-off…",
    postedBy: "School Office",
    postedAt: at(0, 7, 45),
  },
  {
    id: "c5",
    title: "Canteen: new cashless top-up kiosk opens Monday",
    snippet:
      "Students can top up meal cards at the new kiosk beside the canteen entrance, before school and during both breaks…",
    postedBy: "Operations",
    postedAt: at(0, 8, 30),
  },
  {
    id: "c6",
    title: "Chess Open: register your class by Friday",
    snippet:
      "The annual Chess Open runs next Saturday. Register through your class teacher; open to all grades…",
    postedBy: "Co-Curricular Office",
    postedAt: at(-1, 14, 0),
  },
  {
    id: "c7",
    title: "Library hours extended during exam weeks",
    snippet:
      "From Monday the library stays open until 5:30pm on weekdays, with quiet study in the reading room…",
    postedBy: "Library",
    postedAt: at(-2, 10, 0),
  },
  {
    id: "c8",
    title: "Bus route 4: revised pickup times from next week",
    snippet:
      "Pickup moves 10 minutes earlier along Jalan Batu Tiga. Drivers will confirm at tomorrow's drop-off…",
    postedBy: "Transport Desk",
    postedAt: at(-3, 9, 0),
  },
  {
    id: "c9",
    title: "Flu season advisory — keep sick children home",
    snippet:
      "A gentle reminder that children with fever should rest at home until 24 hours after it passes…",
    postedBy: "Health Room",
    postedAt: at(-4, 11, 0),
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
      "Gates open at 7:30am. Students arrive in house shirts and go straight to their house tents.\n\nTrack events run from 8:00am to 1:00pm. The parent relay is at 12:15pm — sign up at the PA table near the gate.\n\nFood stalls accept cashless vouchers only. Vouchers are sold at the office all week and at the gate until 9:00am.",
    links: [
      { label: "Full track schedule (PDF)", url: "https://example.com/sports-day-schedule" },
      { label: "Stadium map & parking", url: "https://maps.example.com/sports-day" },
    ],
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
      "Sign-up closes the Friday before. Aprons and ingredients are provided; students only need a water bottle and a container to bring their bakes home.\n\nPickup is at the canteen at 12:30pm sharp.",
    links: [
      { label: "Sign-up form", url: "https://forms.example.com/junior-kitchen" },
    ],
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
  {
    id: "e6",
    date: at(6, 8, 0),
    title: "School closure — staff training day",
    type: "holiday",
  },
  {
    id: "e7",
    date: at(12, 8, 0),
    title: "Inter-house football finals",
    type: "event",
    location: "Main field",
    details:
      "The finals kick off at 8:30am. House captains must submit final squad lists to Mr. Ravi by Wednesday.\n\nSpectators bring house colours; the canteen runs a special stall all morning.",
    links: [
      { label: "House points standing", url: "https://example.com/house-points" },
    ],
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

/* ---- Attendance ------------------------------------------------------- */

export type AttendanceDay = {
  date: string; // ISO
  status: "present" | "absent" | "late";
  /** An absence with a proper reason (medical certificate, school letter). */
  excused?: boolean;
  reason?: string;
};

function day(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(8, 0, 0, 0);
  return d.toISOString();
}

/** Sample attendance: recent school days only (weekends skipped). */
export const attendanceDays: AttendanceDay[] = [
  { date: day(0), status: "present" },
  { date: day(-1), status: "present" },
  { date: day(-2), status: "absent", excused: true, reason: "Medical certificate — fever" },
  { date: day(-3), status: "present" },
  { date: day(-4), status: "late", reason: "Traffic — arrived 08:20" },
  { date: day(-7), status: "present" },
  { date: day(-8), status: "present" },
  { date: day(-9), status: "present" },
  { date: day(-10), status: "absent", excused: true, reason: "School letter — interstate family matter" },
  { date: day(-11), status: "present" },
];

export type EcaSession = {
  id: string;
  activity: string;
  weekday: string;
  date: string; // ISO
  attended: boolean;
  note?: string;
};

/** Sample ECA roll: grouped per activity, one row per session. */
export const ecaSessions: EcaSession[] = [
  { id: "ec1", activity: "Robotics Club", weekday: "Mondays", date: at(-3, 15, 30), attended: true },
  { id: "ec2", activity: "Robotics Club", weekday: "Mondays", date: at(-10, 15, 30), attended: false, note: "Away fixture — excused by coach" },
  { id: "ec3", activity: "Robotics Club", weekday: "Mondays", date: at(-17, 15, 30), attended: true },
  { id: "ec4", activity: "Choir", weekday: "Thursdays", date: at(-6, 15, 30), attended: true },
  { id: "ec5", activity: "Choir", weekday: "Thursdays", date: at(-13, 15, 30), attended: true },
];

/* ---- Exam results ------------------------------------------------------ */

export type SubjectResult = {
  subject: string;
  score: number;
  max: number;
  grade: string;
  passMark: number; // minimum score (out of max) considered a pass
  teacherComment?: string;
};

export type TermResult = {
  term: string;
  issuedAt: string; // ISO
  results: SubjectResult[];
  classTeacherComment: string;
};

export const examResults: TermResult[] = [
  {
    term: "Mid-term, September 2026",
    issuedAt: at(-4, 9, 0),
    results: [
      { subject: "Mathematics", score: 88, max: 100, grade: "A", passMark: 40, teacherComment: "Strong algebra work — attempt the extension sets." },
      { subject: "English", score: 76, max: 100, grade: "A−", passMark: 40 },
      { subject: "Science", score: 93, max: 100, grade: "A", passMark: 40, teacherComment: "Excellent lab technique." },
      { subject: "Bahasa Malaysia", score: 81, max: 100, grade: "A−", passMark: 40 },
      { subject: "History", score: 34, max: 100, grade: "F", passMark: 40, teacherComment: "Essay structure needs work — see me Thursdays." },
    ],
    classTeacherComment:
      "A solid term. The History result is the one to focus on — the Thursday support session is the fastest fix.",
  },
  {
    term: "Assessment 1, June 2026",
    issuedAt: at(-90, 9, 0),
    results: [
      { subject: "Mathematics", score: 84, max: 100, grade: "A", passMark: 40 },
      { subject: "English", score: 71, max: 100, grade: "B+", passMark: 40 },
      { subject: "Science", score: 90, max: 100, grade: "A", passMark: 40 },
      { subject: "Bahasa Malaysia", score: 78, max: 100, grade: "B+", passMark: 40 },
      { subject: "History", score: 45, max: 100, grade: "C+", passMark: 40 },
    ],
    classTeacherComment: "Steady across the board. Keep the reading habit going.",
  },
];

/* ---- School life: gallery + competitions ------------------------------- */

export type GalleryAlbum = {
  id: string;
  title: string;
  date: string; // ISO
  cover: string; // URL
  photos: { src: string; alt: string }[];
};

/** Sample albums with stock photos — swapped for real school photos later. */
export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "g1",
    title: "Sports Day 2026",
    date: at(-9, 9, 0),
    cover: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80&auto=format&fit=crop",
    photos: [
      { src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80&auto=format&fit=crop", alt: "Sprinters at the start line" },
      { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80&auto=format&fit=crop", alt: "Runner mid-stride on the track" },
      { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80&auto=format&fit=crop", alt: "Football match on the field" },
    ],
  },
  {
    id: "g2",
    title: "Science Fair",
    date: at(-21, 10, 0),
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80&auto=format&fit=crop",
    photos: [
      { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80&auto=format&fit=crop", alt: "Flask in the lab" },
      { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop", alt: "Study desk with books" },
    ],
  },
  {
    id: "g3",
    title: "Art Week",
    date: at(-35, 10, 0),
    cover: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80&auto=format&fit=crop",
    photos: [
      { src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80&auto=format&fit=crop", alt: "Paint brushes and colours" },
      { src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80&auto=format&fit=crop", alt: "Library reading corner" },
    ],
  },
  {
    id: "g4",
    title: "Kitchen Workshop",
    date: at(-49, 10, 0),
    cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop",
    photos: [
      { src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop", alt: "Preparing food in the kitchen" },
      { src: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80&auto=format&fit=crop", alt: "Robotics build table" },
    ],
  },
  {
    id: "g5",
    title: "Raya Celebration",
    date: at(-70, 9, 0),
    cover: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=1200&q=80&auto=format&fit=crop",
    photos: [
      { src: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=1200&q=80&auto=format&fit=crop", alt: "Ketupat decorations" },
      { src: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=1200&q=80&auto=format&fit=crop", alt: "Concert on the school stage" },
      { src: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=1200&q=80&auto=format&fit=crop", alt: "Festive class decorations" },
    ],
  },
];

export type Competition = {
  id: string;
  title: string;
  result: string;
  date: string; // ISO
  description: string;
  image: string; // URL
  /** Highlight video gets linked here when the school provides one. */
  videoUrl?: string;
};

export const competitions: Competition[] = [
  {
    id: "comp1",
    title: "National Robotics Championship",
    result: "Champions, Division B",
    date: at(-60, 9, 0),
    description:
      "Our team took the top prize against 32 schools with a line-following robot that sorted recyclables on the fly.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "comp2",
    title: "Inter-school Debate Finals",
    result: "Runner-up",
    date: at(-75, 9, 0),
    description:
      "Second place after six rounds, arguing the affirmative on renewable energy for island grids.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "comp3",
    title: "State Swim Meet",
    result: "4 gold, 2 silver",
    date: at(-120, 9, 0),
    description:
      "The under-15 relay team set a new state record in the 4×50m freestyle.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "comp4",
    title: "Young Chef Challenge",
    result: "Top 10 nationally",
    date: at(-160, 9, 0),
    description:
      "A three-course menu built around local seasonal fruit earned a national top-10 place.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "comp5",
    title: "Mathematics Olympiad",
    result: "3 students in the top 1%",
    date: at(-200, 9, 0),
    description:
      "Three of our students scored in the top percentile nationwide in the intermediate division.",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "comp6",
    title: "National Chess Open",
    result: "2nd, team standings",
    date: at(-30, 9, 0),
    description:
      "A last-round draw sealed second place overall, with two students finishing on the individual podium.",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&q=80&auto=format&fit=crop",
  },
];

/* ---- Hotlines ----------------------------------------------------------- */

export type Hotline = {
  name: string;
  role: string;
  phone: string;
  hours: string;
};

export const hotlines: Hotline[] = [
  { name: "School office", role: "General enquiries, absence messages", phone: "03-5550 0100", hours: "Mon–Fri 7:30–16:30" },
  { name: "Health room", role: "Sick bay, medication drop-off", phone: "03-5550 0114", hours: "Mon–Fri 8:00–15:30" },
  { name: "Security gate", role: "Late arrival, early pickup", phone: "03-5550 0199", hours: "Daily 6:30–18:30" },
  { name: "Bus coordinator", role: "Routes, delays, lost items", phone: "03-5550 0152", hours: "Mon–Fri 6:30–17:00" },
];

/* ---- Student feedback ---------------------------------------------------- */

export type FeedbackKind = "Suggestion" | "Praise" | "Concern";

export type FeedbackEntry = {
  id: string;
  kind: FeedbackKind;
  message: string;
  sentAt: string;
  status: "received" | "replied";
  reply?: { text: string; by: string; at: string };
};

export const feedbackKinds: FeedbackKind[] = ["Suggestion", "Praise", "Concern"];

export const feedbackSeed: FeedbackEntry[] = [
  {
    id: "fb1",
    kind: "Suggestion",
    message:
      "Could the canteen add a halal-friendly vegetarian line? The queue at the main counter is very long by 11am.",
    sentAt: at(-21, 10, 0),
    status: "replied",
    reply: {
      text:
        "Thank you — the canteen committee reviewed this and a second vegetarian counter opens next term.",
      by: "Student Affairs Office",
      at: at(-14, 12, 0),
    },
  },
  {
    id: "fb2",
    kind: "Concern",
    message:
      "The Year 7 corridor water fountain has been leaking for two weeks.",
    sentAt: at(-5, 9, 0),
    status: "received",
  },
];

/* ---- Campus info ---------------------------------------------------------- */

export const campusInfo = {
  address: school.address,
  mapsUrl: school.mapsUrl,
  officeHours: "Mon–Fri 7:30–16:30 · Sat 8:00–12:30 (activity days only)",
  gates: "Gates open 6:45 · Classes start 7:55 · Dismissal 15:15 (15:00 Wed)",
  facilities: [
    "Library & learning hub",
    "Science & robotics labs",
    "Field, pool & indoor hall",
    "Canteen & coffee cart",
  ],
};

/* ---- School videos (YouTube) ---------------------------------------------- */

export type SchoolVideo = {
  id: string;
  title: string;
  date: string;
  duration: string;
  /** The school pastes its YouTube link here — until then the card is honest. */
  url: string | null;
};

export const schoolVideos: SchoolVideo[] = [
  {
    id: "v1",
    title: "Sports Day 2026 — full assembly replay",
    date: at(-60, 9, 0),
    duration: "1:12:40",
    url: null,
  },
  {
    id: "v2",
    title: "Raya concert — choir & gamelan",
    date: at(-95, 9, 0),
    duration: "48:15",
    url: null,
  },
  {
    id: "v3",
    title: "Robotics club: regional finals highlights",
    date: at(-120, 9, 0),
    duration: "6:02",
    url: null,
  },
];

/* ---- Study Center ---------------------------------------------------------- */

export type StudyKind = "Video" | "Quiz" | "Practice" | "Reading";

export type StudyResource = {
  id: string;
  kind: StudyKind;
  subject: string;
  title: string;
  note?: string;
  /** Where it points — a YouTube link, a Kahoot, a worksheet. The app opens
      it in a new tab and never hosts or embeds it, so nothing here can break
      when a third party changes their site. Empty while the school is still
      collecting links; the card then says so honestly. */
  url: string | null;
  sharedBy: string;
  sharedAt: string; // ISO
};

export const studySeed: StudyResource[] = [
  {
    id: "st1",
    kind: "Video",
    subject: "Mathematics",
    title: "Quadratic equations — the visual way",
    note: "Watch before attempting exercise 4.2. Pause at 6:10 and try the example yourself.",
    url: "https://youtube.com/watch?v=IlNAJl36-10",
    sharedBy: "Mr. Tan",
    sharedAt: at(-1, 16, 0),
  },
  {
    id: "st2",
    kind: "Quiz",
    subject: "Science",
    title: "Kahoot: neutralisation reactions",
    note: "Live in class on Thursday — play once at home so the scoring makes sense.",
    url: "https://kahoot.it/challenge/08123456",
    sharedBy: "Mr. Raj",
    sharedAt: at(-2, 10, 30),
  },
  {
    id: "st3",
    kind: "Practice",
    subject: "English",
    title: "Essay structure: PEEL paragraphs",
    note: "The handout method we use in class — same four sentences, every paragraph.",
    url: "https://example.com/peel-paragraphs",
    sharedBy: "Ms. Wong",
    sharedAt: at(-3, 9, 0),
  },
  {
    id: "st4",
    kind: "Video",
    subject: "History",
    title: "The Malayan Union in ten minutes",
    url: null,
    sharedBy: "Mr. Lim",
    sharedAt: at(-4, 14, 0),
  },
  {
    id: "st5",
    kind: "Practice",
    subject: "Mathematics",
    title: "Timed drills: factorising",
    note: "Ten questions a night beats fifty on Sunday.",
    url: "https://example.com/factorise-drills",
    sharedBy: "Mr. Tan",
    sharedAt: at(-5, 8, 45),
  },
  {
    id: "st6",
    kind: "Reading",
    subject: "English",
    title: "Reading list: term break picks",
    note: "Five books the library has ten copies of — no waiting list.",
    url: "https://example.com/term-break-reading",
    sharedBy: "Ms. Wong",
    sharedAt: at(-6, 12, 0),
  },
  {
    id: "st7",
    kind: "Quiz",
    subject: "Bahasa Malaysia",
    title: "Kahoot: komsas bab 3",
    url: "https://kahoot.it/challenge/07654321",
    sharedBy: "Pn. Aida",
    sharedAt: at(-7, 15, 0),
  },
  {
    id: "st8",
    kind: "Video",
    subject: "Science",
    title: "Titration technique — close-up walkthrough",
    note: "For the lab report: this is exactly what your write-up should describe.",
    url: "https://youtube.com/watch?v=sFpCPjS2jzo",
    sharedBy: "Mr. Raj",
    sharedAt: at(-8, 9, 30),
  },
];

/* ---- Class roster (teacher mode) ----------------------------------------- */

export type RosterStudent = {
  id: string;
  name: string;
  /** attendance state for today — set by the teacher app, read by /attendance */
  att: "present" | "late" | "excused" | "absent";
  /** why, when not present — chips, never typing */
  reason?: string;
  /** lateness tracker: times late this term, and the reason that keeps
      coming up — powers the tracker card and recurring quick-picks */
  latesThisTerm?: number;
  frequentReason?: string;
};

/** Class 8B's roll. Generic names; the real roster comes from the vault. */
export const roster: RosterStudent[] = [
  { id: "s1", name: "Aisyah Rahman", att: "present" },
  { id: "s2", name: "Benjamin Lee", att: "present" },
  { id: "s3", name: "Chong Wei Jian", att: "present" },
  { id: "s4", name: "Farah Danisha", att: "present", latesThisTerm: 6, frequentReason: "Late transport" },
  { id: "s5", name: "Harith Imran", att: "present" },
  { id: "s6", name: "Mei Ling Chan", att: "present" },
  { id: "s7", name: "Nurul Hidayah", att: "present", latesThisTerm: 3, frequentReason: "Traffic" },
  { id: "s8", name: "Ryan Pillay", att: "present" },
  { id: "s9", name: "Sofia Ahmed", att: "present", latesThisTerm: 4, frequentReason: "Late transport" },
  { id: "s10", name: "Tan Jun Kai", att: "present" },
];
