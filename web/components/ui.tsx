type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
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
      <h2 className="text-sm font-semibold tracking-wide text-foreground">
        {children}
      </h2>
      {right}
    </div>
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
      onClick={onClick}
      className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition-transform active:scale-[0.97] ${
        active
          ? "bg-accent text-white"
          : "border border-hairline bg-paper text-muted hover:border-stone-300 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
