/**
 * The school-notebook wallpaper: faint graph paper under a loose scatter of
 * big, friendly emoji (pencils, flasks, newspapers, trophies…). Decorative
 * only — aria-hidden, no pointer events, sits behind the content — and the
 * whole layer fades out after the first screenful so it never fights the
 * lists. Colour comes from the theme tokens (globals.css), so every accent
 * palette and dark mode tints the graph lines automatically.
 *
 * Each page names its motif — the props choose the emoji row, so News reads
 * as paper-and-ink, Study Center as pencil-and-flask, Events as confetti-and-
 * calendars. A hand-placed scatter (no two emojis on one row, each with its
 * own tilt and size) so it reads as doodled on, not stamped.
 */

const MOTIFS = {
  /** a bit of everything — Today, the morning dashboard */
  today: ["✏️", "📰", "📐", "🧪", "☀️"],
  /** the Hub's own destinations, as wallpaper */
  hub: ["📣", "🎉", "✏️", "📞", "📖"],
  /** pencils + ruler — Study Center, practice and worksheets */
  study: ["✏️", "📐", "🧪", "📚", "📓"],
  /** megaphone + newspaper — News/circulars from the office */
  news: ["📰", "📣", "✉️", "📰", "📣"],
  /** notebook + clock — homework, the nightly worksheet */
  homework: ["📝", "⏰", "✏️", "📅", "📝"],
  /** confetti + calendars — Events and Holidays */
  events: ["🎉", "📅", "🏖️", "🎉", "📆"],
  /** trophy + stars — Exam results */
  results: ["🏆", "⭐", "🏅", "🏆", "⭐"],
  /** checkmarks + clipboard — attendance */
  attendance: ["✅", "📋", "✅", "🗓️", "✅"],
} as const;

/** Hand-placed scatter positions — diagonal, no two on the same row. */
const SPOTS = [
  { left: "6%", top: "18%" },
  { left: "26%", top: "55%" },
  { left: "46%", top: "14%" },
  { left: "65%", top: "58%" },
  { left: "84%", top: "24%" },
] as const;

const TILTS = [-10, 8, -6, 12, -8] as const;
const SIZES = [36, 30, 40, 32, 36] as const;

export type BackdropMotif = keyof typeof MOTIFS;

/** Position + tilt + size for one emoji. The custom property rides in through
    an intersection type — the one clean way to pass --tilt past the checker. */
function emojiStyle(i: number): React.CSSProperties {
  const style: React.CSSProperties & Record<"--tilt", string> = {
    left: SPOTS[i].left,
    top: SPOTS[i].top,
    fontSize: SIZES[i],
    "--tilt": `${TILTS[i]}deg`,
  };
  return style;
}

export function PageBackdrop({ motif }: { motif: BackdropMotif }) {
  const emoji = MOTIFS[motif];
  return (
    <div aria-hidden className="page-backdrop">
      <div className="page-backdrop-lines" />
      {emoji.map((e, i) => (
        <span key={i} className="page-backdrop-emoji" style={emojiStyle(i)}>
          {e}
        </span>
      ))}
    </div>
  );
}
