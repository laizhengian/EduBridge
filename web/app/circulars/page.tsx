import { circulars, timeAgo } from "@/lib/mock-data";

export default function CircularsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">          Circulars
          </h1>
          <p className="mt-1 text-[15px] text-muted">Announcements from the school office</p>
      </header>

      <div className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
        {circulars.map((c) => (
          <article key={c.id} className="border-b border-hairline py-5 first:border-t">
            <h2 className="text-base font-semibold leading-6">{c.title}</h2>
            <p className="mt-0.5 text-xs text-muted">
              {c.postedBy} · {timeAgo(c.postedAt)}
            </p>
            <p className="mt-2.5 text-[15px] leading-7 text-foreground/80">
              {c.snippet}
            </p>
            <button
              type="button"
              className="mt-2.5 inline-flex min-h-[44px] items-center text-sm font-semibold text-accent underline underline-offset-4"
            >
              Read the full letter
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
