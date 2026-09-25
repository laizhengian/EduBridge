"use client";

import { useState } from "react";
import { CalendarPlusIcon } from "@/components/ui";
import { downloadIcs, type IcsEvent } from "@/lib/ics";

/** Quiet per-row action: downloads a pre-filled .ics for the event. */
export function AddToCalendar({
  ev,
  className,
}: {
  ev: IcsEvent;
  className?: string;
}) {
  const [added, setAdded] = useState(false);

  const event: IcsEvent = {
    id: ev.id,
    title: ev.title,
    date: ev.date,
    durationHours: ev.durationHours ?? 1,
    location: ev.location,
    description: "Added from EduBridge",
  };

  function handleClick() {
    downloadIcs(event);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-md border border-hairline bg-paper px-3 text-sm font-medium transition-transform active:scale-[0.97] ${
        added ? "text-accent-strong" : "text-muted hover:border-hairline hover:text-foreground"
      } ${className ?? ""}`}
      aria-label={`Add ${ev.title} to calendar`}
    >
      <CalendarPlusIcon className="h-4 w-4" />
      <span>{added ? "Added" : "Add"}</span>
    </button>
  );
}
