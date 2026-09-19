import { hotlines } from "@/lib/mock-data";
import { PhoneIcon } from "@/components/ui";

export default function HotlinesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Hotlines
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Who answers, when, and for what
        </p>
      </header>

      <div
        className="rise mt-6 rounded-xl border border-hairline bg-paper"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {hotlines.map((h, i) => (
          <div
            key={h.phone}
            className={`flex flex-wrap items-center gap-x-4 gap-y-3 p-4 ${
              i > 0 ? "border-t border-hairline" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-semibold">{h.name}</p>
              <p className="mt-0.5 text-xs leading-5 text-muted">{h.role}</p>
              <p className="text-xs leading-5 text-muted">{h.hours}</p>
            </div>
            <a
              href={`tel:${h.phone.replace(/\s/g, "")}`}
              className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-paper transition-transform active:scale-[0.98]"
            >
              <PhoneIcon className="h-4.5 w-4.5" aria-hidden />
              {h.phone}
            </a>
          </div>
        ))}
      </div>

      <p className="rise mt-4 text-xs leading-5 text-muted" style={{ "--i": 2 } as React.CSSProperties}>
        For anything urgent during school hours, call the office first — it can
        route you fastest. Numbers shown are samples for the preview.
      </p>
    </div>
  );
}
