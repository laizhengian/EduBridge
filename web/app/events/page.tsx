"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarCheckIcon,
  ChevronIcon,
  DotTag,
  EventsIcon,
  ExternalLinkIcon,
  PenLineIcon,
} from "@/components/ui";
import { AddToCalendar } from "@/components/AddToCalendar";
import {
  getEvents,
  subscribe as subscribeEvents,
} from "@/lib/events-store";
import type { SchoolEvent } from "@/lib/mock-data";

/** One quiet icon that says what kind of day it is — colour plus shape,
    so it never rests on colour alone. */
function TypeMark({ type }: { type: SchoolEvent["type"] }) {
  const cls =
    type === "exam"
      ? "bg-warn-soft text-warn"
      : type === "holiday"
        ? "bg-accent-soft text-accent-strong"
        : "bg-muted/10 text-muted";
  const Icon = type === "exam" ? PenLineIcon : type === "holiday" ? EventsIcon : CalendarCheckIcon;
  return (
    <span
      aria-hidden
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cls}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </span>
  );
}

/** Plain-words distance: "today", "tomorrow", "in 6 days". */
function inDays(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000,
  );
  if (diff <= 0) return "today";
  if (diff === 1) return "tomorrow";
  return `in ${diff} days`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);

  useEffect(() => {
    const load = () => setEvents(getEvents());
    load();
    return subscribeEvents(load);
  }, []);

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="mx-auto max-w-3xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Events
        </h1>
        <p className="mt-1 text-[15px] text-muted">{upcoming.length} coming up</p>
      </header>

      <ul
        className="rise mt-6 rounded-xl border border-hairline bg-paper px-4 py-1 sm:px-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {upcoming.map((e, i) => (
          <Row key={e.id} e={e} first={i === 0} upNext={i === 0} />
        ))}
      </ul>
    </div>
  );
}

/** The whole row opens the event — details, links and the calendar file live
    inside, so the row itself stays one quiet line. */
function Row({ e, first, upNext }: { e: SchoolEvent; first: boolean; upNext: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <li className={`py-1${first ? "" : " border-t border-hairline"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-2.5 text-left"
      >
        <TypeMark type={e.type} />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium leading-6">
            {e.title}
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            {new Date(e.date).toLocaleDateString("en-MY", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {e.location?.trim() ? ` · ${e.location.trim()}` : ""} · {inDays(e.date)}
          </span>
        </span>

        {upNext && (
          <span className="shrink-0">
            <DotTag color="green">Up next</DotTag>
          </span>
        )}
        <ChevronIcon
          aria-hidden
          className={`h-4 w-4 shrink-0 text-muted/70 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-4 pt-1">
          {e.image && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-hairline">
              <Image
                src={e.image}
                alt=""
                fill
                sizes="(min-width: 672px) 608px, calc(100vw - 32px)"
                className="object-cover"
              />
            </div>
          )}

          {e.details?.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="mt-2.5 text-sm leading-6 text-foreground/80">
              {para}
            </p>
          ))}

          {e.links?.length ? (
            <ul className="mt-3 rounded-xl border border-hairline bg-background px-4 py-1">
              {e.links.map((l) => (
                <li
                  key={l.url}
                  className={l === e.links![0] ? "" : "border-t border-hairline"}
                >
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[48px] items-center justify-between gap-3 text-[15px] font-medium text-accent"
                  >
                    {l.label}
                    <ExternalLinkIcon aria-hidden className="h-4 w-4 shrink-0 text-muted/70" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-3 flex items-start justify-between gap-3">
            <AddToCalendar ev={e} />
            <p className="max-w-[24ch] pt-1 text-right text-xs leading-5 text-muted">
              Downloads a calendar file your phone's calendar app can open.
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
