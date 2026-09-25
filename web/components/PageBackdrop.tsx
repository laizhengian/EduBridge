import {
  FlaskGlyph,
  NewspaperGlyph,
  PenLineIcon,
  PencilGlyph,
  PlayIcon,
  RulerGlyph,
  TrophyIcon,
} from "@/components/ui";

/**
 * The school-notebook wallpaper: faint graph lines under a loose row of
 * stationery glyphs (pens, ruler, flask, newspaper…). Decorative only —
 * aria-hidden, no pointer events, sits behind the content (z-index -10) —
 * and it fades out after the first screenful so it never fights the lists.
 * Colour comes entirely from the theme tokens (globals.css), so every accent
 * palette and dark mode tint it automatically; nothing here is hard-coded.
 *
 * Each page names its motif — the props choose the glyph row, so News reads
 * as paper and ink, Study Center as pencil-and-flask, Events as calendar-adjacent.
 */

const MOTIFS = {
  /** pencils + ruler — Study Center, practice and worksheets */
  study: [PencilGlyph, RulerGlyph, FlaskGlyph, PenLineIcon, PencilGlyph],
  /** megaphone + newspaper — News/circulars from the office */
  news: [PenLineIcon, NewspaperGlyph, PenLineIcon, NewspaperGlyph, PenLineIcon],
  /** clipboard + pencil — homework, the nightly worksheet */
  homework: [PenLineIcon, PencilGlyph, RulerGlyph, PenLineIcon, PencilGlyph],
  /** calendar-square + sun — Events and Holidays */
  events: [PenLineIcon, RulerGlyph, PenLineIcon, RulerGlyph, PenLineIcon],
  /** trophy + pencil — Exam results */
  results: [PencilGlyph, TrophyIcon, PencilGlyph, TrophyIcon, PencilGlyph],
  /** checkmarks + pencil — attendance */
  attendance: [PenLineIcon, PencilGlyph, PenLineIcon, PencilGlyph, PenLineIcon],
} as const;

export type BackdropMotif = keyof typeof MOTIFS;

export function PageBackdrop({ motif }: { motif: BackdropMotif }) {
  const icons = MOTIFS[motif];
  return (
    <div aria-hidden className="page-backdrop">
      <div className="page-backdrop-lines" />
      {icons.map((Icon, i) => (
        <span
          key={i}
          className="page-backdrop-doodle"
          style={{
            left: `${8 + i * 21}%`,
            top: `${18 + (i % 3) * 26}%`,
          }}
        >
          <Icon className="h-7 w-7" />
        </span>
      )      )}
    </div>
  );
}
