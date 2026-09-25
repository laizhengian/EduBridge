"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Chip, ClipboardListIcon } from "@/components/ui";
import { addStudy, getStudy } from "@/lib/study-store";
import { timeAgo, type StudyKind, type StudyResource } from "@/lib/mock-data";
import { haptic } from "@/lib/haptics";

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Bahasa Malaysia"];
const KINDS: StudyKind[] = ["Video", "Quiz", "Practice", "Reading"];
const KIND_HINT: Record<StudyKind, string> = {
  Video: "A YouTube link that explains something",
  Quiz: "A Kahoot challenge code link, or another quiz",
  Practice: "A worksheet, drill site or exercise set",
  Reading: "An article or reading list",
};

/** Accepts "youtube.com/…" as well as full https:// links; answers whether
    the paste is usable and what domain it will open. No API, no fetching —
    just parsing, so the compose screen can never hang. */
function parseUrl(raw: string): { ok: boolean; url: string; host: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, url: "", host: "" };
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(candidate);
    if (!u.hostname.includes(".")) return { ok: false, url: trimmed, host: "" };
    return { ok: true, url: u.toString(), host: u.hostname.replace(/^www\./, "") };
  } catch {
    return { ok: false, url: trimmed, host: "" };
  }
}

/**
 * Share to the Study Center. Three chips and a paste — the family app shows
 * it without any change on their side. The link is optional: teachers can
 * share a recommendation now and the office can attach the link later, so
 * an unfinished link never blocks a good suggestion.
 */
export default function TeacherStudyPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [kind, setKind] = useState<StudyKind>("Video");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const [recent, setRecent] = useState<StudyResource[]>([]);

  useEffect(() => {
    setRecent(getStudy().slice(0, 4));
  }, []);

  const parsed = useMemo(() => parseUrl(url), [url]);

  function send() {
    if (!title.trim()) {
      haptic("warning");
      return;
    }
    if (!parsed.ok) {
      haptic("warning");
      return;
    }
    addStudy({
      id: `ts-${Date.now()}`,
      kind,
      subject,
      title: title.trim(),
      note: note.trim() || undefined,
      url: parsed.url || null,
      sharedBy: "Ms. Ravin", // the signed-in teacher, once accounts exist
      sharedAt: new Date().toISOString(),
    });
    haptic("success");
    setPosted(
      `${title.trim()} — ${kind.toLowerCase()} for ${subject}.${
        parsed.url ? ` Opens ${parsed.host}.` : " Families see it while the link is being attached."
      }`,
    );
    setTitle("");
    setNote("");
    setUrl("");
    setRecent(getStudy().slice(0, 4));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Share to Study Center
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          A video, quiz or practice your class can open in one tap
        </p>
      </header>

      <div className="rise mt-5 space-y-5" style={{ "--i": 1 } as React.CSSProperties}>
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
          <p className="text-sm font-semibold">What is it?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
                {k}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-muted">{KIND_HINT[kind]}</p>
        </section>

        <section>
          <label htmlFor="st" className="text-sm font-semibold">
            Title
          </label>
          <input
            id="st"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quadratic equations — the visual way"
            enterKeyHint="done"
            className="mt-2 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
          />
        </section>

        <section>
          <label htmlFor="sn" className="text-sm font-semibold">
            One line for the class{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="sn"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Pause at 6:10 and try the example yourself"
            enterKeyHint="next"
            className="mt-2 w-full rounded-xl border border-hairline bg-background px-3.5 py-3 text-base outline-none focus:border-accent"
          />
        </section>

        <section>
          <label htmlFor="su" className="text-sm font-semibold">
            Link{" "}
            <span className="font-normal text-muted">(optional — attach it later if you don't have it yet)</span>
          </label>
          <input
            id="su"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            inputMode="url"
            placeholder="Paste a YouTube or Kahoot link"
            enterKeyHint="done"
            className={`mt-2 w-full rounded-xl border bg-background px-3.5 py-3 text-base outline-none ${
              parsed.ok ? "border-hairline focus:border-accent" : "border-danger focus:border-danger"
            }`}
          />
          {url.trim() !== "" && parsed.ok && (
            <p className="mt-1.5 text-[13px] text-muted">
              Opens <span className="font-semibold text-accent">{parsed.host}</span> in a new tab
            </p>
          )}
          {!parsed.ok && (
            <p className="mt-1.5 text-[13px] text-danger">
              That link doesn't look complete — paste the whole address, like
              https://youtube.com/…
            </p>
          )}
        </section>

        <button
          type="button"
          onClick={send}
          disabled={!parsed.ok}
          className="pressable min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-accent-contrast disabled:opacity-50"
        >
          Share with your classes
        </button>

        {posted && (
          <div className="rounded-xl border border-hairline bg-paper p-4">
            <p className="text-sm font-semibold text-accent">Shared ✓</p>
            <p className="mt-1 text-sm text-muted">{posted}</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              See it in the{" "}
              <Link
                href="/study"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                family app's Study Center
              </Link>
              .
            </p>
          </div>
        )}

        {recent.length > 0 && (
          <section className="pt-1">
            <p className="text-sm font-semibold">Recently shared</p>
            <ul className="mt-2 rounded-xl border border-hairline bg-paper px-4 py-1">
              {recent.map((r, i) => (
                <li
                  key={r.id}
                  className={`flex items-center gap-3 py-3${i === 0 ? "" : " border-t border-hairline"}`}
                >
                  <ClipboardListIcon className="h-5 w-5 shrink-0 text-muted/70" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium leading-6">
                      {r.title}
                    </span>
                    <span className="block text-xs text-muted">
                      {r.kind} · {r.subject} · {timeAgo(r.sharedAt)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-[13px] leading-5 text-muted">
          Design preview — nothing is stored beyond this device yet.
        </p>
      </div>
    </div>
  );
}
