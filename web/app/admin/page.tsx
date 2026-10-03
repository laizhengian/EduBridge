"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheckIcon,
  ChartIcon,
  ChevronIcon,
  DotTag,
  EventsIcon,
  MegaphoneIcon,
  NoteIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui";
import { Sheet } from "@/components/Sheet";
import { AdminShell } from "@/components/AdminShell";
import {
  addCircular,
  getCirculars,
  subscribe as subscribeCirculars,
} from "@/lib/circulars-store";
import {
  addEvent,
  getEvents,
  removeEvent,
  subscribe as subscribeEvents,
} from "@/lib/events-store";
import {
  roster,
  school,
  studentSummaries,
  type Circular,
  type SchoolEvent,
  type StudentSummary,
} from "@/lib/mock-data";

/**
 * The office console. Everything the admin does in a day — memos, the
 * calendar, results monitoring, students — lives in one place with five
 * tabs, because "all over the place" was the interview's main complaint.
 * Writes land in the same stores the family app reads, so a memo shows up
 * in News and a calendar entry in Events the moment they're sent.
 */

type Tab = "overview" | "memos" | "calendar" | "results" | "students";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "memos", label: "Memos" },
  { id: "calendar", label: "Calendar" },
  { id: "results", label: "Results" },
  { id: "students", label: "Students" },
];

const PASS_MARK = 50;
const WATCH_MARK = 60;

function postedDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const dayDiff = Math.round(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      86400000,
  );
  if (dayDiff <= 0) return "today";
  if (dayDiff === 1) return "yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      setCirculars(getCirculars());
      setEvents(getEvents());
    };
    load();
    const unsubs = [subscribeCirculars(load), subscribeEvents(load)];
    return () => unsubs.forEach((u) => u());
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 2800);
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl">
        <header className="rise">
          <p className="text-sm text-muted">{school.name}</p>
          <h1 className="mt-0.5 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Admin console
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Memos, calendar, results and students — in one place
          </p>
        </header>

        <nav
          role="tablist"
          aria-label="Admin sections"
          className="rise mt-5 grid grid-cols-5 gap-1 rounded-xl border border-hairline bg-paper p-1"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`pressable min-h-[40px] rounded-lg text-xs font-semibold ${
                tab === t.id
                  ? "bg-indigo-700 text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-5">
          {tab === "overview" && (
            <Overview
              circulars={circulars}
              events={events}
              goTab={setTab}
            />
          )}
          {tab === "memos" && (
            <Memos
              circulars={circulars}
              onSent={(msg) => {
                showToast(msg);
              }}
            />
          )}
          {tab === "calendar" && (
            <Calendar
              events={events}
              onAdded={(msg) => showToast(msg)}
            />
          )}
          {tab === "results" && (
            <Results onOpenStudent={() => setTab("students")} />
          )}
          {tab === "students" && <Students />}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md rounded-xl bg-[#2a2d31] px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </AdminShell>
  );
}

/* ---- Overview ---------------------------------------------------------- */

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-paper p-4">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight">{value}</p>
      {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
    </div>
  );
}

function Overview({
  circulars,
  events,
  goTab,
}: {
  circulars: Circular[];
  events: SchoolEvent[];
  goTab: (t: Tab) => void;
}) {
  const now = new Date();
  const week = 7 * 24 * 60 * 60 * 1000;
  const memosThisWeek = circulars.filter(
    (c) => now.getTime() - +new Date(c.postedAt) < week,
  ).length;
  const classAvg = Math.round(
    studentSummaries.reduce((sum, s) => sum + s.average, 0) / studentSummaries.length,
  );
  const belowPass = studentSummaries.filter((s) => s.average < PASS_MARK).length;
  const inToday = roster.filter((r) => r.att === "present" || r.att === "late").length;

  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 3);

  // The morning-glance list: who needs a phone call, and why. One row per
  // student — every reason joined, worst tone wins.
  type Flag = { name: string; reasons: string[]; tone: "red" | "amber" };
  const flagged: Flag[] = [];
  for (const s of studentSummaries) {
    const name = roster.find((r) => r.id === s.id)?.name ?? s.id;
    const r = roster.find((x) => x.id === s.id);
    const reasons: string[] = [];
    let tone: "red" | "amber" = "amber";
    if (s.average < PASS_MARK) {
      reasons.push(`Average ${s.average}/100 — below the pass mark of ${PASS_MARK}`);
      tone = "red";
    }
    if (r?.latesThisTerm && r.latesThisTerm >= 4) {
      reasons.push(`Late ${r.latesThisTerm}× this term`);
    }
    if (s.attendancePct < 90) {
      reasons.push(`Attendance ${s.attendancePct}%`);
    }
    if (reasons.length > 0) {
      const existing = flagged.find((f) => f.name === name);
      if (existing) {
        existing.reasons.push(...reasons);
        if (tone === "red") existing.tone = "red";
      } else {
        flagged.push({ name, reasons, tone });
      }
    }
  }

  return (
    <div className="rise">
      <div className="grid grid-cols-2 gap-3.5">
        <StatCard
          label="Students"
          value={String(roster.length)}
          note={`Class ${studentSummaries[0]?.klass ?? "8B"}`}
        />
        <StatCard label="In today" value={`${inToday} of ${roster.length}`} note="Marked present or late" />
        <StatCard
          label="Class average"
          value={`${classAvg}/100`}
          note={`Mid-term · ${belowPass} below pass`}
        />
        <StatCard label="Memos this week" value={String(memosThisWeek)} note="Sent to all families" />
      </div>

      <section className="mt-7">
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
          <ChartIcon aria-hidden className="h-4 w-4" />
          Needs attention
        </h2>
        {flagged.length === 0 ? (
          <p className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-4 text-[15px] text-muted">
            Nobody needs a call today.
          </p>
        ) : (
          <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
            {flagged.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className={i === 0 ? "" : "border-t border-hairline"}
              >
                <button
                  type="button"
                  onClick={() => goTab("students")}
                  className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium">{f.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {f.reasons.join(" · ")}
                    </span>
                  </span>
                  <DotTag color={f.tone === "red" ? "red" : "amber"}>
                    {f.tone === "red" ? "Below pass" : "Watch"}
                  </DotTag>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-7 pb-2">
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
          <EventsIcon aria-hidden className="h-4 w-4" />
          Coming up
        </h2>
        <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
          {upcoming.map((e, i) => (
            <li
              key={e.id}
              className={`flex items-center justify-between gap-3 py-3.5${i === 0 ? "" : " border-t border-hairline"}`}
            >
              <span className="min-w-0 truncate text-[15px] font-medium">{e.title}</span>
              <span className="shrink-0 text-xs text-muted">
                {new Date(e.date).toLocaleDateString("en-MY", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </li>
          ))}
          {upcoming.length === 0 && (
            <li className="py-3.5 text-[15px] text-muted">Nothing on the calendar yet.</li>
          )}
        </ul>
        <button
          type="button"
          onClick={() => goTab("calendar")}
          className="pressable mt-2.5 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-indigo-700"
        >
          Manage the calendar
          <ChevronIcon aria-hidden className="h-3.5 w-3.5" />
        </button>
      </section>
    </div>
  );
}

/* ---- Memos --------------------------------------------------------------- */

const inputCls =
  "mt-1 w-full rounded-xl border border-hairline bg-background px-4 py-3 text-[15px] outline-none focus:border-indigo-500";

function Memos({
  circulars,
  onSent,
}: {
  circulars: Circular[];
  onSent: (msg: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const canSend = title.trim().length > 0 && body.trim().length > 0;

  function send() {
    if (!canSend) return;
    addCircular({
      id: `m-${Date.now()}`,
      title: title.trim(),
      snippet: `${body.trim().slice(0, 110)}${body.trim().length > 110 ? "…" : ""}`,
      body: body.trim(),
      links:
        linkUrl.trim() && linkLabel.trim()
          ? [{ label: linkLabel.trim(), url: linkUrl.trim() }]
          : undefined,
      postedBy: "School Office",
      postedAt: new Date().toISOString(),
    });
    setTitle("");
    setBody("");
    setLinkLabel("");
    setLinkUrl("");
    onSent("Memo sent — it's in family News now.");
  }

  return (
    <div className="rise">
      <section>
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
          <MegaphoneIcon aria-hidden className="h-4 w-4" />
          Send a memo
        </h2>
        <div className="mt-2.5 rounded-xl border border-hairline bg-paper p-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-foreground/80">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="e.g. Sports Day postponed to 3 October"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-[13px] font-semibold text-foreground/80">Message</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className={`${inputCls} resize-none leading-6`}
              placeholder="What families need to know. Keep it short — details can go in the linked letter."
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Link label</span>
              <input
                type="text"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className={inputCls}
                placeholder="Optional — e.g. Sign-up form"
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Link URL</span>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className={inputCls}
                placeholder="https://…"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className="pressable mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-indigo-700 px-5 text-[15px] font-semibold text-white disabled:opacity-40"
          >
            <NoteIcon aria-hidden className="h-4.5 w-4.5" />
            Send to all families
          </button>
          <p className="mt-2 text-xs leading-5 text-muted">
            Appears in the family app's News and Today screens immediately.
          </p>
        </div>
      </section>

      <section className="mt-7 pb-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Sent
        </h2>
        <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
          {circulars.slice(0, 8).map((c, i) => (
            <li
              key={c.id}
              className={`py-3.5${i === 0 ? "" : " border-t border-hairline"}`}
            >
              <p className="truncate text-[15px] font-medium leading-6">{c.title}</p>
              <p className="mt-0.5 text-xs text-muted">
                {c.postedBy} · sent {postedDay(c.postedAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ---- Calendar ------------------------------------------------------------ */

function typeDot(type: SchoolEvent["type"]) {
  return type === "exam" ? "bg-warn" : type === "holiday" ? "bg-accent" : "bg-muted/60";
}

function Calendar({
  events,
  onAdded,
}: {
  events: SchoolEvent[];
  onAdded: (msg: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00");
  const [type, setType] = useState<SchoolEvent["type"]>("event");
  const [location, setLocation] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  function add() {
    if (!title.trim() || !date) return;
    addEvent({
      id: `ev-${Date.now()}`,
      title: title.trim(),
      date: new Date(`${date}T${time || "08:00"}`).toISOString(),
      type,
      location: location.trim() || undefined,
    });
    setTitle("");
    setDate("");
    setTime("08:00");
    setType("event");
    setLocation("");
    onAdded("Added — it's in family Events now.");
  }

  return (
    <div className="rise">
      <section>
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
          <PlusIcon aria-hidden className="h-4 w-4" />
          Add to the school calendar
        </h2>
        <div className="mt-2.5 rounded-xl border border-hairline bg-paper p-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-foreground/80">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="e.g. Science Fair"
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls}
              />
            </label>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SchoolEvent["type"])}
                className={inputCls}
              >
                <option value="event">School event</option>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-foreground/80">Location</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputCls}
                placeholder="Optional"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={add}
            disabled={!title.trim() || !date}
            className="pressable mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-indigo-700 px-5 text-[15px] font-semibold text-white disabled:opacity-40"
          >
            <PlusIcon aria-hidden className="h-4.5 w-4.5" />
            Add event
          </button>
        </div>
      </section>

      <section className="mt-7 pb-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Upcoming ({upcoming.length})
        </h2>
        <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
          {upcoming.map((e, i) => (
            <li
              key={e.id}
              className={`flex items-center gap-3 py-3.5${i === 0 ? "" : " border-t border-hairline"}`}
            >
              <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${typeDot(e.type)}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium leading-6">
                  {e.title}
                </span>
                <span className="block text-xs text-muted">
                  {new Date(e.date).toLocaleDateString("en-MY", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                  {e.location?.trim() ? ` · ${e.location.trim()}` : ""}
                </span>
              </span>
              {confirmId === e.id ? (
                <span className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      removeEvent(e.id);
                      setConfirmId(null);
                      onAdded("Removed from the calendar.");
                    }}
                    className="pressable min-h-[36px] rounded-lg bg-danger/10 px-3 text-[13px] font-semibold text-danger"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="pressable min-h-[36px] rounded-lg px-2 text-[13px] font-semibold text-muted"
                  >
                    Keep
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(e.id)}
                  aria-label={`Remove ${e.title}`}
                  className="pressable flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted/70 hover:bg-background hover:text-danger"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
          {upcoming.length === 0 && (
            <li className="py-3.5 text-[15px] text-muted">
              Nothing upcoming — add the next event above.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

/* ---- Results --------------------------------------------------------------- */

function trend(s: StudentSummary): { label: string; cls: string } {
  const diff = s.average - s.previousAverage;
  if (diff > 0) return { label: `Up ${diff} since Assessment 1`, cls: "text-accent-strong" };
  if (diff < 0) return { label: `Down ${-diff} since Assessment 1`, cls: "text-danger" };
  return { label: "Same as Assessment 1", cls: "text-muted" };
}

function Results({ onOpenStudent }: { onOpenStudent: () => void }) {
  const sorted = useMemo(
    () => [...studentSummaries].sort((a, b) => a.average - b.average),
    [],
  );
  const classAvg = Math.round(
    sorted.reduce((sum, s) => sum + s.average, 0) / sorted.length,
  );
  const belowPass = sorted.filter((s) => s.average < PASS_MARK).length;

  return (
    <div className="rise pb-2">
      <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
        <TrophyIcon aria-hidden className="h-4 w-4" />
        Mid-term monitoring · Class 8B
      </h2>
      <p className="mt-1 text-[15px] text-muted">
        Class average {classAvg}/100 · {belowPass} {belowPass === 1 ? "student" : "students"} below
        pass · lowest first
      </p>

      <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
        {sorted.map((s, i) => {
          const t = trend(s);
          const name = roster.find((r) => r.id === s.id)?.name ?? s.id;
          return (
            <li
              key={s.id}
              className={i === 0 ? "" : "border-t border-hairline"}
            >
              <button
                type="button"
                onClick={onOpenStudent}
                className="flex w-full items-center gap-3 py-3.5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-medium">{name}</span>
                    {s.average < PASS_MARK && <DotTag color="red">Below pass</DotTag>}
                    {s.average >= PASS_MARK && s.average < WATCH_MARK && (
                      <DotTag color="amber">Watch</DotTag>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    Weakest: {s.weakestSubject} · {t.label}
                  </span>
                </span>
                <span className="shrink-0 font-display text-lg font-semibold">
                  {s.average}
                  <span className="text-xs font-medium text-muted">/100</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs leading-5 text-muted">
        Tap a student for their full record in the Students tab.
      </p>
    </div>
  );
}

/* ---- Students --------------------------------------------------------------- */

function Students() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = roster.filter((r) =>
    r.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const open = openId
    ? { student: roster.find((r) => r.id === openId), summary: studentSummaries.find((s) => s.id === openId) }
    : null;

  return (
    <div className="rise pb-2">
      <h2 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
        <UsersIcon aria-hidden className="h-4 w-4" />
        Student records
      </h2>
      <label className="mt-2.5 block">
        <span className="sr-only">Search students</span>
        <span className="relative block">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/70"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="min-h-[48px] w-full rounded-xl border border-hairline bg-paper pl-10 pr-4 text-[15px] outline-none focus:border-indigo-500"
          />
        </span>
      </label>

      <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1">
        {filtered.map((r, i) => {
          const s = studentSummaries.find((x) => x.id === r.id);
          return (
            <li key={r.id} className={i === 0 ? "" : "border-t border-hairline"}>
              <button
                type="button"
                onClick={() => setOpenId(r.id)}
                aria-haspopup="dialog"
                className="flex w-full items-center gap-3 py-3.5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{r.name}</span>
                  <span className="block text-xs text-muted">
                    Class {s?.klass ?? "8B"} · {s?.attendancePct ?? "—"}% attendance
                  </span>
                </span>
                <span className="shrink-0 font-display text-base font-semibold">
                  {s?.average ?? "—"}
                  <span className="text-xs font-medium text-muted">/100</span>
                </span>
                <ChevronIcon aria-hidden className="h-4 w-4 shrink-0 text-muted/70" />
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-3.5 text-[15px] text-muted">No students match “{query}”.</li>
        )}
      </ul>

      {open?.student && open.summary && (
        <StudentSheet
          student={open.student}
          summary={open.summary}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function StudentSheet({
  student,
  summary,
  onClose,
}: {
  student: (typeof roster)[number];
  summary: StudentSummary;
  onClose: () => void;
}) {
  const t = trend(summary);
  return (
    <Sheet open onClose={onClose} title="Student record">
      <div className="pb-2">
        <h3 className="font-display text-[19px] font-semibold leading-7">{student.name}</h3>
        <p className="mt-0.5 text-xs text-muted">Class {summary.klass}</p>

        <dl className="mt-4 space-y-2.5 text-[15px]">
          <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5">
            <dt className="text-muted">Guardian</dt>
            <dd className="font-medium">{summary.guardian}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5">
            <dt className="text-muted">Phone</dt>
            <dd className="font-medium">
              <a href={`tel:${summary.guardianPhone.replace(/[^+\d]/g, "")}`} className="text-indigo-700">
                {summary.guardianPhone}
              </a>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5">
            <dt className="text-muted">Attendance this term</dt>
            <dd className="font-medium">{summary.attendancePct}%</dd>
          </div>
          {student.latesThisTerm ? (
            <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5">
              <dt className="text-muted">Late arrivals</dt>
              <dd className="font-medium">
                {student.latesThisTerm}× · {student.frequentReason}
              </dd>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5">
            <dt className="text-muted">Mid-term average</dt>
            <dd className="font-medium">
              {summary.average}/100 <span className={`text-xs font-medium ${t.cls}`}>{t.label}</span>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">Weakest subject</dt>
            <dd className="font-medium">{summary.weakestSubject}</dd>
          </div>
        </dl>

        {summary.average < PASS_MARK && (
          <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-[13px] font-medium leading-5 text-danger">
            Below the pass mark of {PASS_MARK} — a guardian conversation is the next step.
          </p>
        )}
      </div>
    </Sheet>
  );
}
