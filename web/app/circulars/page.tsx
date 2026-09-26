import { circulars, timeAgo } from "@/lib/mock-data";
import { PageBackdrop } from "@/components/PageBackdrop";

export default function CircularsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageBackdrop motif="news" />
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">          News
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Announcements and latest news from the school office
        </p>
      </header>

      {/* Same boxed grouped-list language as Homework, Events and Results —
          one material across the app (decisions.md #19). */}
      <div
        className="rise mt-6 rounded-xl border border-hairline bg-paper px-4 py-1 sm:px-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {circulars.map((c, i) => (
          <article
            key={c.id}
            className={`py-4${i > 0 ? " border-t border-hairline" : ""}`}
          >
            <h2 className="text-[15px] font-semibold leading-6">{c.title}</h2>
            <p className="mt-0.5 text-xs text-muted">
              {c.postedBy} · {timeAgo(c.postedAt)}
            </p>
            <p className="mt-1.5 text-[15px] leading-7 text-foreground/80">
              {c.snippet}
            </p>
            <button
              type="button"
              className="pressable mt-1.5 inline-flex min-h-[40px] items-center text-sm font-semibold text-accent"
            >
              Read the full letter
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
