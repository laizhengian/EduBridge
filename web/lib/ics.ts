// "Add to calendar" support: builds an RFC 5545 .ics file locally in the
// browser — no backend, no network. Works with Google Calendar, Apple
// Calendar, Outlook: the downloaded file opens a pre-filled event.

export type IcsEvent = {
  id: string;
  title: string;
  date: string; // ISO
  durationHours?: number;
  location?: string;
  description?: string;
};

function icsStamp(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  // Floating local time (no Z suffix): shows at the school's local time
  // regardless of where the calendar app's timezone is set.
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

/** Escape per RFC 5545 §3.3.11 TEXT. */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(ev: IcsEvent): string {
  const start = new Date(ev.date);
  const end = new Date(start.getTime() + (ev.durationHours ?? 1) * 3600_000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EduBridge//Events//EN",
    "BEGIN:VEVENT",
    `UID:${ev.id}@edubridge`,
    `DTSTAMP:${icsStamp(new Date().toISOString())}`,
    `DTSTART:${icsStamp(ev.date)}`,
    `DTEND:${icsStamp(end.toISOString())}`,
    `SUMMARY:${esc(ev.title)}`,
    ev.location?.trim() ? `LOCATION:${esc(ev.location.trim())}` : null,
    ev.description ? `DESCRIPTION:${esc(ev.description)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadIcs(ev: IcsEvent): void {
  const blob = new Blob([buildIcs(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.title.replace(/[^\w\s-]/g, "").trim().slice(0, 40) || "event"}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
