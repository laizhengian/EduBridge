import { DotTag } from "@/components/ui";
import { dayGroupLabel, events } from "@/lib/mock-data";

export default function EventsPage() {
  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="md:grid md:grid-cols-[1fr_260px] md:gap-12">
      <main>
        <header className="rise">
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Events
          </h1>
          <p className="mt-1 text-[15px] text-muted">This term</p>
        </header>

        <ul className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
          {upcoming.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 border-b border-hairline py-3.5 first:border-t"
            >
              <div className="w-16 shrink-0">
                <p className="text-[13px] font-semibold leading-4">
                  {new Date(e.date).toLocaleDateString("en-MY", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-xs text-muted">
                  {new Date(e.date).toLocaleDateString("en-MY", { weekday: "short" })}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium leading-6">{e.title}</p>
                <p className="text-xs text-muted">
                  {dayGroupLabel(e.date)}
                  {e.location?.trim() ? ` · ${e.location.trim()}` : ""}
                </p>
              </div>
              <DotTag
                color={
                  e.type === "exam" ? "amber" : e.type === "holiday" ? "green" : "gray"
                }
              >
                {e.type}
              </DotTag>
            </li>
          ))}
        </ul>
      </main>

      <aside className="mt-10 md:mt-12">
        <section className="rise" style={{ "--i": 2 } as React.CSSProperties}>
          <h2 className="text-sm font-semibold tracking-wide text-foreground">Tags</h2>
          <div className="mt-3 space-y-2.5">
            <DotTag color="gray">event — school event</DotTag>
            <br />
            <DotTag color="green">holiday — school closed</DotTag>
            <br />
            <DotTag color="amber">exam — exams scheduled</DotTag>
          </div>
        </section>
      </aside>
    </div>
  );
}
