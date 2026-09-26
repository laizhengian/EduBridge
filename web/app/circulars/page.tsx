import Image from "next/image";
import { circulars } from "@/lib/mock-data";

/**
 * News. Grouped by how old it is — This week / Earlier this month — because
 * that's the question a family asks ("what's new since I last looked?"), not
 * "what's the archive order?". Letters stay collapsed until tapped: the title
 * plus a two-line preview is enough to know if it's yours to read. The posted
 * day is written in plain words next to the sender — no timestamps to decode.
 *
 * Letters that carry a poster show it as a banner above the letter's text once
 * opened (the backend-plan layout rule) — never as a thumbnail floating in the
 * collapsed row. The Today screen stays text-only regardless.
 */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function postedDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const dayDiff = Math.round(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      86400000,
  );
  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function CircularsPage() {
  const now = Date.now();
  const sorted = [...circulars].sort(
    (a, b) => +new Date(b.postedAt) - +new Date(a.postedAt),
  );
  const fresh = sorted.filter((c) => now - +new Date(c.postedAt) < WEEK_MS);
  const earlier = sorted.filter((c) => now - +new Date(c.postedAt) >= WEEK_MS);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          News
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {fresh.length} this week · {sorted.length} this month
        </p>
      </header>

      {fresh.length > 0 && (
        <section className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
            This week
          </h2>
          <LetterList items={fresh} />
        </section>
      )}

      {earlier.length > 0 && (
        <section className="rise mt-6" style={{ "--i": 2 } as React.CSSProperties}>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
            Earlier this month
          </h2>
          <LetterList items={earlier} />
        </section>
      )}
    </div>
  );
}

function LetterList({ items }: { items: typeof circulars }) {
  return (
    <div className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1 sm:px-5">
      {items.map((c, i) => (
        <Letter key={c.id} c={c} first={i === 0} />
      ))}
    </div>
  );
}

/** One collapsed letter: title, who posted it and when, a two-line preview.
    Tapping opens the full letter in place — no page jump, nothing to go back
    from. Tapping again closes it. */
function Letter({ c, first }: { c: (typeof circulars)[number]; first: boolean }) {
  return (
    <details className={`group py-3.5${first ? "" : " border-t border-hairline"}`}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold leading-6">
            {c.title}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {c.postedBy} · {postedDay(c.postedAt)}
          </span>
          <span className="mt-1.5 block text-[15px] leading-7 text-foreground/80 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden group-open:hidden">
            {c.snippet}
          </span>
        </span>
        <span className="mt-1 shrink-0 text-xs font-semibold text-accent group-open:hidden">
          Read
        </span>
        <span className="mt-1 hidden shrink-0 text-xs font-semibold text-muted group-open:inline">
          Close
        </span>
      </summary>
      {c.image && <Poster src={c.image} alt="" />}
      <p className="mt-3 text-[15px] leading-7 text-foreground/80">
        {c.body}
      </p>
    </details>
  );
}

/** The letter's poster, when it has one: a fixed-ratio banner above the
    letter's text, rounded to the card like a photo pinned on top. */
function Poster({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div className="relative mt-2 aspect-[3/2] overflow-hidden rounded-lg border border-hairline">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 672px) 608px, calc(100vw - 32px)"
        className="object-cover"
      />
    </div>
  );
}
