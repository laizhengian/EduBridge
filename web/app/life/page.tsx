"use client";

import { useState } from "react";
import Image from "next/image";
import {
  campusInfo,
  competitions,
  galleryAlbums,
  schoolVideos,
  type GalleryAlbum,
} from "@/lib/mock-data";
import { Sheet } from "@/components/Sheet";
import { CheckGlyph, MapPinIcon, ClockIcon, PlayIcon } from "@/components/ui";
import { haptic } from "@/lib/haptics";

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function LifePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          School life
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Photo galleries, competitions and events worth remembering
        </p>
      </header>

      <section className="rise mt-6" style={{ "--i": 1 } as React.CSSProperties}>
        <h2 className="font-display text-[17px] font-semibold">Photo galleries</h2>
        <div className="mt-3 grid gap-3.5 md:grid-cols-3">
          {galleryAlbums.map((album, i) => (
            <AlbumCard key={album.id} album={album} first={i === 0} />
          ))}
        </div>
      </section>

      <section className="rise mt-8 pb-2" style={{ "--i": 2 } as React.CSSProperties}>
        <h2 className="font-display text-[17px] font-semibold">
          Competitions &amp; big events
        </h2>
        <div className="mt-3 space-y-3.5">
          {competitions.map((c) => (
            <article
              key={c.id}
              className="flex gap-4 rounded-xl border border-hairline bg-paper p-4"
            >
              <Image
                src={c.image}
                alt={c.title}
                width={256}
                height={192}
                sizes="128px"
                className="hidden h-24 w-32 shrink-0 rounded-lg object-cover sm:block"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h3 className="font-display text-[15px] font-semibold">
                    {c.title}
                  </h3>
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-strong">
                    {c.result}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted">{monthYear(c.date)}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  {c.description}
                </p>
                {c.videoUrl ? (
                  <a
                    href={c.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pressable mt-2 inline-flex min-h-[36px] items-center gap-1.5 text-sm font-semibold text-accent"
                  >
                    <PlayIcon className="h-4 w-4" /> Watch highlights
                  </a>
                ) : (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                    <PlayIcon className="h-4 w-4" aria-hidden /> Highlights video
                    — slot ready for the school&apos;s link
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rise mt-8" style={{ "--i": 3 } as React.CSSProperties}>
        <h2 className="font-display text-[17px] font-semibold">School videos</h2>
        <p className="mt-1 text-sm text-muted">
          Assemblies, concerts and match replays, straight from the school&apos;s
          YouTube channel
        </p>
        <div className="mt-3 space-y-3">
          {schoolVideos.map((v) => (
            <article
              key={v.id}
              className="flex items-center gap-3.5 rounded-xl border border-hairline bg-paper p-4"
            >
              <PlayIcon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold leading-6">
                  {v.title}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {monthYear(v.date)} · {v.duration}
                </p>
              </div>
              {v.url ? (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="pressable shrink-0 text-sm font-semibold text-accent"
                >
                  Watch
                </a>
              ) : (
                <span className="shrink-0 text-right text-xs font-medium text-muted">
                  Link slot ready —
                  <br className="hidden sm:block" /> the school pastes its
                  YouTube URL
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rise mt-8 pb-2" style={{ "--i": 4 } as React.CSSProperties}>
        <h2 className="font-display text-[17px] font-semibold">The campus</h2>
        <div className="mt-3 grid gap-3.5 md:grid-cols-3">
          <div className="rounded-xl border border-hairline bg-paper p-4">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-semibold">
              <MapPinIcon className="h-4 w-4 text-accent" aria-hidden />
              Find us
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted">{campusInfo.address}</p>
            <a
              href={campusInfo.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="pressable mt-2 inline-flex min-h-[36px] items-center text-sm font-semibold text-accent"
            >
              Open in Maps
            </a>
          </div>
          <div className="rounded-xl border border-hairline bg-paper p-4">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-semibold">
              <ClockIcon className="h-4 w-4 text-accent" aria-hidden />
              A school day
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted">{campusInfo.gates}</p>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              Office: {campusInfo.officeHours}
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-paper p-4">
            <h3 className="font-display text-[15px] font-semibold">Around campus</h3>
            <ul className="mt-2 space-y-2">
              {campusInfo.facilities.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <CheckGlyph className="h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <p className="mt-5 pb-2 text-xs text-muted">
        Sample photos are stock images for the preview — real school photos
        replace them, and videos are linked by the school when ready.
      </p>
    </div>
  );
}

/** The album cover taps open a bottom sheet — like Photos on a phone —
    which drags down to close. No page jump, no expanding layout. */
function AlbumCard({ album, first }: { album: GalleryAlbum; first: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          haptic("light");
          setOpen(true);
        }}
        className="pressable block overflow-hidden rounded-xl border border-hairline bg-paper text-left"
        aria-haspopup="dialog"
      >
        <Image
          src={album.cover}
          alt={album.photos[0]?.alt ?? album.title}
          width={640}
          height={320}
          sizes="(min-width: 896px) 340px, calc(100vw - 40px)"
          priority={first}
          className="h-40 w-full object-cover"
        />
        <span className="block p-3.5">
          <span className="font-display text-[15px] font-semibold">
            {album.title}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {monthYear(album.date)} · {album.photos.length}{" "}
            {album.photos.length === 1 ? "photo" : "photos"} — tap to open
          </span>
        </span>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={album.title}>
        <p className="pb-2 text-xs text-muted">
          {monthYear(album.date)} · {album.photos.length}{" "}
          {album.photos.length === 1 ? "photo" : "photos"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {album.photos.map((p) => (
            <Image
              key={p.src}
              src={p.src}
              alt={p.alt}
              width={320}
              height={224}
              sizes="(min-width: 896px) 340px, 42vw"
              className="h-32 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      </Sheet>
    </>
  );
}
