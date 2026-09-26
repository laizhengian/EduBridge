"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarCheckIcon,
  ChevronIcon,
  DotTag,
  EventsIcon,
  ExternalLinkIcon,
  PenLineIcon,
  TrophyIcon,
} from "@/components/ui";
import { AddToCalendar } from "@/components/AddToCalendar";
import { events, type SchoolEvent } from "@/lib/mock-data";

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

export default function EventsPage() {
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
          <Row key={e.id} e={e} first={i === 0} />
        ))}
      </ul>
    </div>
  );
}

function Row({ e, first }: { e: SchoolEvent; first: boolean }) {
  const [open, setOpen] = useState(false);
  const hasMore = Boolean(e.details?.trim());

  return (
    <li className={`py-3.5${first ? "" : " border-t border-hairline"}`}>
      <div className="flex items-center gap-3">
        <TypeMark type={e.type} />

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-6">{e.title}</p>
          <p className="text-xs text-muted">
            {new Date(e.date).toLocaleDateString("en-MY", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {e.location?.trim() ? ` · ${e.location.trim()}` : ""}
          </p>
        </div>

        <AddToCalendar ev={e} />
      </div>

      {hasMore && (
        <div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="mt-1 inline-flex min-h-[36px] items-center gap-1 text-sm font-medium text-accent"
          >
            {open ? "Less" : "More"}
            <ChevronIcon
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
            />
          </button>
          {open && (
            <div className="mt-1 space-y-2.5">
              {/* Poster letters lead with the picture — banner above the text,
              never a thumbnail in the row (backend-plan layout rule). */}
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
                <p key={i} className="text-sm leading-6 text-foreground/80">
                  {para}
                </p>
              ))}
              {e.links?.length ? (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {e.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pressable inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-hairline bg-background px-3 text-sm font-medium text-accent"
                    >
                      {l.label}
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
