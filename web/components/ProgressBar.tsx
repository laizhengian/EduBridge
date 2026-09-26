/**
 * The quiet progress bar under a list's header — how much of the work is
 * done, at a glance, without reading a number. Hidden entirely when there
 * is nothing tracked (a page never ships an empty module), and instant on
 * first paint (no width animation on mount) — it only animates when the
 * user's own tap changes it, which is the only moment motion carries
 * meaning. Reduced-motion collapses it to a plain swap.
 */
export function ProgressBar({
  done,
  total,
  className = "",
}: {
  done: number;
  total: number;
  className?: string;
}) {
  if (total === 0) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <div
      role="progressbar"
      aria-label={`${done} of ${total} done`}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className={`h-1.5 overflow-hidden rounded-full bg-accent-soft ${className}`}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
