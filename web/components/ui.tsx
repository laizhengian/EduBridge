import { haptic } from "@/lib/haptics";

type IconProps = { className?: string };

function Svg({
  className,
  children,
  strokeWidth = 1.8,
}: IconProps & { children: React.ReactNode; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-6 w-6 ${className ?? ""}`}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </Svg>
  );
}

export function HomeworkIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2.5h6V6H9z" />
      <path d="M9 11.5h6M9 15.5h4" />
    </Svg>
  );
}

export function TimetableIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function EventsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M4 11h16" />
    </Svg>
  );
}

/** Universal "more places" glyph — a control mark, not a logo. */
export function MoreIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path strokeWidth={2.6} d="M5.5 12h.01M12 12h.01M18.5 12h.01" />
    </Svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5 19 6v5.5c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6l7-2.5Z" />
      <path d="m9.3 11.8 2 2 3.4-3.6" />
    </Svg>
  );
}

export function PlayIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10.2 9.2 4.6 2.8-4.6 2.8V9.2Z" />
    </Svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.3 2.3 4.7-4.9" />
    </Svg>
  );
}

export function CrossIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
    </Svg>
  );
}

/** Bare glyphs for filled badges — no circle, stroke inherits the badge color.
    Text glyphs ("✓") render differently in every platform font; these don't. */
export function CheckGlyph(p: IconProps) {
  return (
    <Svg {...p} strokeWidth={2.6}>
      <path d="m7 12.6 3.1 3.1L17 8.7" />
    </Svg>
  );
}

export function CrossGlyph(p: IconProps) {
  return (
    <Svg {...p} strokeWidth={2.6}>
      <path d="M8.2 8.2l7.6 7.6M15.8 8.2l-7.6 7.6" />
    </Svg>
  );
}

export function DashGlyph(p: IconProps) {
  return (
    <Svg {...p} strokeWidth={2.6}>
      <path d="M7 12h10" />
    </Svg>
  );
}

export function ExclaimGlyph(p: IconProps) {
  return (
    <Svg {...p} strokeWidth={2.6}>
      <path d="M12 6.5v7" />
      <path d="M12 17.2h.01" />
    </Svg>
  );
}

export function TrophyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5.5a0 0 0 0 0 0 0c0 2.5 1 4 2.5 4.5M16 5h2.5c0 2.5-1 4-2.5 4.5" />
      <path d="M12 13v3.5" />
      <path d="M8.5 20.5h7M10 16.5h4l.8 4h-5.6l.8-4Z" />
    </Svg>
  );
}

export function ImagesIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6" y="3.5" width="15" height="12" rx="2" />
      <path d="M3 7.5v10a2 2 0 0 0 2 2h12" />
      <path d="m9.5 12 2.5-2.5 3 3 1.5-1.5 2.5 2.5" />
      <path d="M15.5 7h.01" />
    </Svg>
  );
}

export function QuestionIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.3A2.5 2.5 0 0 1 14.5 10c0 1.6-2.4 2-2.4 3.4" />
      <path d="M12 16.6h.01" />
    </Svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6.8 3.8 9 3.2c.5-.1 1 .1 1.2.6l1.1 2.6c.2.4.1.9-.3 1.2l-1.4 1.2a12.4 12.4 0 0 0 5.6 5.6l1.2-1.4c.3-.4.8-.5 1.2-.3l2.6 1.1c.5.2.7.7.6 1.2l-.6 2.2c-.1.5-.6.9-1.1.9A16.2 16.2 0 0 1 5.9 4.9c0-.5.4-1 .9-1.1Z" />
    </Svg>
  );
}

export function EnvelopeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </Svg>
  );
}

export function SunIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7" />
    </Svg>
  );
}

export function NoteIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21 3 3 10.5l6.5 2L11.5 19 21 3Z" />
      <path d="m9.5 12.5 4-4" />
    </Svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function MegaphoneIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </Svg>
  );
}

export function PaperclipIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49" />
    </Svg>
  );
}

export function PlusIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function CalendarPlusIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M4 11h16" />
      <path d="M12 14.5v5M9.5 17h5" />
    </Svg>
  );
}

/** Small dot + word label. No colored pill backgrounds. */
export function DotTag({
  color,
  children,
}: {
  color: "green" | "red" | "amber" | "gray";
  children: React.ReactNode;
}) {
  const dot = {
    green: "bg-accent",
    red: "bg-danger",
    amber: "bg-amber-500",
    gray: "bg-stone-400",
  }[color];
  const text = {
    green: "text-accent-strong",
    red: "text-danger",
    amber: "text-amber-700",
    gray: "text-muted",
  }[color];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className={text}>{children}</span>
    </span>
  );
}

export function SubjectChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[#f0ebe2] px-1.5 py-0.5 text-[11px] font-semibold text-[#57503f]">
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="font-display text-[17px] font-semibold text-foreground">
        {children}
      </h2>
      {right}
    </div>
  );
}

export function ChevronIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m9 5 7 7-7 7" />
    </Svg>
  );
}

export function Chip({
  active,
  onClick,
  children,
  type = "button",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={() => {
        haptic("light");
        onClick();
      }}
      className={`pressable min-h-[44px] rounded-full px-4 text-sm font-semibold ${
        active
          ? "bg-accent text-white"
          : "border border-hairline bg-paper text-muted hover:border-stone-300 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
