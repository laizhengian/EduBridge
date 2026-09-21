"use client";

import { useState } from "react";
import { Chip, CloseIcon, PaperclipIcon, SectionTitle } from "@/components/ui";
import { haptic } from "@/lib/haptics";
import { absenceNoteSchema, firstIssue } from "@/lib/validation";

const REASONS = ["Sick", "Family matter", "Appointment", "Other"];

export default function AbsencePage() {
  const [reason, setReason] = useState<string | null>(null);
  const [when, setWhen] = useState<"today" | "tomorrow">("today");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState<{ name: string; url: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = reason !== null;

  function attach(f: File | undefined) {
    if (!f) return;
    // Same 10 MB cap the server will enforce — fail here, not after upload.
    if (f.size > 10 * 1024 * 1024) {
      window.alert("Photos are capped at 10 MB — please choose a smaller one.");
      return;
    }
    setPhoto({ name: f.name, url: URL.createObjectURL(f) });
  }

  function send() {
    // Validate against the schema the server will also run — the rules users
    // see are the rules that will actually be enforced.
    const parsed = absenceNoteSchema.safeParse({
      reason,
      when,
      detail,
      photo: photo ? { name: photo.name, sizeBytes: 0 } : null,
    });
    if (!parsed.success) {
      haptic("warning");
      window.alert(firstIssue(parsed.error));
      return;
    }
    haptic("medium");
    setSending(true);
    // Design preview: pretend to upload, then confirm.
    window.setTimeout(() => {
      haptic("success");
      setSending(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Note sent
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          Your class teacher has your note
          {photo ? " and the photo you attached" : ""}. The school office will see it
          too. You do not need to do anything else.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setReason(null);
            setDetail("");
            setPhoto(null);
          }}
          className="pressable mt-6 min-h-[48px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper disabled:opacity-40"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Tell the school I'm away
        </h1>
        <p className="mt-1 text-[15px] text-muted">Class 8B · goes to your class teacher</p>
      </header>

      <div className="mt-6 space-y-6 rise" style={{ "--i": 1 } as React.CSSProperties}>
        <div>
          <SectionTitle>Why</SectionTitle>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <Chip key={r} active={reason === r} onClick={() => setReason(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Which day</SectionTitle>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Chip active={when === "today"} onClick={() => setWhen("today")}>
              Today
            </Chip>
            <Chip active={when === "tomorrow"} onClick={() => setWhen("tomorrow")}>
              Tomorrow
            </Chip>
          </div>
        </div>

        <div>
          <SectionTitle>Attach a photo, optional</SectionTitle>
          <p className="mt-1 text-xs leading-5 text-muted">
            For example, a medical certificate from the doctor.
          </p>
          {photo ? (
            <div className="mt-2.5 overflow-hidden rounded-xl border border-hairline bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="Attached document" className="max-h-56 w-full object-contain" />
              <div className="flex items-center justify-between gap-3 border-t border-hairline px-3.5 py-2.5">
                <span className="min-w-0 flex-1 truncate text-xs text-muted">{photo.name}</span>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-[#f0ebe2]"
                >
                  <CloseIcon className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ) : (
            <label className="pressable mt-2.5 flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-paper px-4 text-[15px] font-medium text-accent">
              <PaperclipIcon className="h-5 w-5" />
              Take or choose a photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => attach(e.target.files?.[0])}
              />
            </label>
          )}
        </div>

        <div>
          <SectionTitle>Anything to add, optional</SectionTitle>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
            placeholder="For example: doctor's appointment at 2pm, back after lunch"
            className="mt-2 w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-base outline-none focus:border-accent"
          />
        </div>

        <button
          type="button"
          disabled={!valid || sending}
          onClick={send}
          className="pressable min-h-[48px] w-full rounded-xl bg-accent text-[15px] font-semibold text-paper disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send note"}
        </button>
        <p className="text-center text-xs text-muted">
          Design preview — the note is not really sent yet.
        </p>
      </div>
    </div>
  );
}
