"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronIcon,
  ExternalLinkIcon,
  PaperclipIcon,
} from "@/components/ui";
import { Sheet } from "@/components/Sheet";
import {
  getCirculars,
  subscribe as subscribeCirculars,
} from "@/lib/circulars-store";
import type { Circular } from "@/lib/mock-data";

/**
 * News. The list stays quiet — title, who sent it, when — because the row is
 * the preview and the whole row is the tap target (no tiny "Read" links to
 * hunt for on a phone). Tapping opens the full letter in a sheet: the poster,
 * the letter itself, and any forms or files gathered in one organized place.
 *
 * Grouped by how old it is — This week / Earlier this month — because that's
 * the question a family asks ("what's new since I last looked?"). Letters the
 * office sends from the admin console appear here immediately.
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

function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CircularsPage() {
  const [letters, setLetters] = useState<Circular[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setLetters(getCirculars());
    load();
    return subscribeCirculars(load);
  }, []);

  const now = Date.now();
  const fresh = letters.filter((c) => now - +new Date(c.postedAt) < WEEK_MS);
  const earlier = letters.filter((c) => now - +new Date(c.postedAt) >= WEEK_MS);
  const open = letters.find((c) => c.id === openId) ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          News
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {fresh.length} this week · {letters.length} this month
        </p>
      </header>

      {fresh.length > 0 && (
        <section className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
            This week
          </h2>
          <LetterList items={fresh} onOpen={setOpenId} />
        </section>
      )}

      {earlier.length > 0 && (
        <section className="rise mt-6" style={{ "--i": 2 } as React.CSSProperties}>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
            Earlier this month
          </h2>
          <LetterList items={earlier} onOpen={setOpenId} />
        </section>
      )}

      {open && (
        <LetterSheet letter={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}

function LetterList({
  items,
  onOpen,
}: {
  items: Circular[];
  onOpen: (id: string) => void;
}) {
  return (
    <ul className="mt-2.5 rounded-xl border border-hairline bg-paper px-4 py-1 sm:px-5">
      {items.map((c, i) => (
        <Letter key={c.id} c={c} first={i === 0} onOpen={onOpen} />
      ))}
    </ul>
  );
}

/** One collapsed letter: title, who posted it and when. The whole row is the
    button — no separate Read/Close control to aim for. */
function Letter({
  c,
  first,
  onOpen,
}: {
  c: Circular;
  first: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <li className={first ? "" : "border-t border-hairline"}>
      <button
        type="button"
        onClick={() => onOpen(c.id)}
        aria-haspopup="dialog"
        className="flex w-full items-center gap-3 py-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-6">
            {c.title}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {c.postedBy} · {postedDay(c.postedAt)}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {c.image && (
            <span
              aria-hidden
              className="relative hidden h-9 w-14 overflow-hidden rounded-md border border-hairline sm:block"
            >
              <Image
                src={c.image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
          )}
          <ChevronIcon aria-hidden className="h-4 w-4 shrink-0 text-muted/70" />
        </span>
      </button>
    </li>
  );
}

/** The full letter, presented like a sheet from the office: sender up top,
    then the poster (banner above the text — the backend-plan layout rule),
    the letter itself, and any links gathered in one organized place. */
function LetterSheet({
  letter,
  onClose,
}: {
  letter: Circular;
  onClose: () => void;
}) {
  return (
    <Sheet open onClose={onClose} title={letter.postedBy}>
      <div className="pb-2">
        <h3 className="font-display text-[19px] font-semibold leading-7">
          {letter.title}
        </h3>
        <p className="mt-1 text-xs text-muted">
          {letter.postedBy} · {fullDate(letter.postedAt)}
        </p>

        {letter.image && (
          <div className="relative mt-3 aspect-[3/2] overflow-hidden rounded-lg border border-hairline">
            <Image
              src={letter.image}
              alt=""
              fill
              sizes="(min-width: 672px) 608px, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-3 space-y-3">
          {letter.body.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="text-[15px] leading-7 text-foreground/80">
              {para}
            </p>
          ))}
        </div>

        {letter.links && letter.links.length > 0 && (
          <section className="mt-4">
            <h4 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
              <PaperclipIcon aria-hidden className="h-3.5 w-3.5" />
              Links & files
            </h4>
            <ul className="mt-2 rounded-xl border border-hairline bg-background px-4 py-1">
              {letter.links.map((l) => (
                <li
                  key={l.url}
                  className={l === letter.links![0] ? "" : "border-t border-hairline"}
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
          </section>
        )}
      </div>
    </Sheet>
  );
}
