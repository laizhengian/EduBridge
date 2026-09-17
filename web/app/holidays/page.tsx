import { DotTag } from "@/components/ui";
import { AddToCalendar } from "@/components/AddToCalendar";
import { dayGroupLabel, type SchoolEvent } from "@/lib/mock-data";

export default function HolidaysPage() {
  const now = new Date();
  const holidays: SchoolEvent[] = [
    {
      id: "hol1",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 8).toISOString(),
      title: "Public holiday (replacement)",
      type: "holiday",
    },
    {
      id: "hol2",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 33, 8).toISOString(),
      title: "Mid-term break — school closed",
      type: "holiday",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Holidays
        </h1>
        <p className="mt-1 text-[15px] text-muted">Days the school is closed</p>
      </header>

      <ul className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
        {holidays.map((h) => (
          <li
            key={h.id}
            className="flex items-center gap-3 border-b border-hairline py-3.5 first:border-t"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium leading-6">{h.title}</p>
              <p className="text-xs text-muted">{dayGroupLabel(h.date)}</p>
            </div>
            <AddToCalendar ev={h} />
            <DotTag color="green">holiday</DotTag>
          </li>
        ))}
      </ul>
    </div>
  );
}
