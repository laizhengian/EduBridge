"use client";

import { useState } from "react";
import { DotTag, ChevronIcon } from "@/components/ui";
import { AddToCalendar } from "@/components/AddToCalendar";
import { events, type SchoolEvent } from "@/lib/mock-data";

function tagColor(type: SchoolEvent["type"]): "amber" | "green" | "gray" {
  return type === "exam" ? "amber" : type === "holiday" ? "green" : "gray";
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
        <div className="w-14 shrink-0">
          <p className="text-[13px] font-semibold leading-4">
            {new Date(e.date).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
          </p>
          <p className="text-xs text-muted">
            {new Date(e.date).toLocaleDateString("en-MY", { weekday: "short" })}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-6">{e.title}</p>
          {e.location?.trim() && (
            <p className="text-xs text-muted">{e.location.trim()}</p>
          )}
        </div>

        <AddToCalendar ev={e} />
        <span className="w-[64px] shrink-0 text-right">
          <DotTag color={tagColor(e.type)}>{e.type}</DotTag>
        </span>
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
            <p className="mt-1 text-sm leading-6 text-foreground/80">{e.details}</p>
          )}
        </div>
      )}
    </li>
  );
}
