import { haptic } from "@/lib/haptics";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  CirclePlay,
  CircleX,
  ClipboardList,
  Ellipsis,
  Home,
  Images,
  LayoutGrid,
  Mail,
  MapPin,
  Clock,
  Megaphone,
  Minus,
  Paperclip,
  PenLine,
  Phone,
  Plus,
  ScrollText,
  Send,
  ShieldCheck,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react";

type IconProps = { className?: string };

/* Icons are Lucide (lucide.dev) — the open-source set most native-quality
   apps and shadcn/ui ship with: consistent 24-grid, 2px strokes, MIT.
   Export names are kept identical to the old hand-drawn set so no call
   sites change. Two bare marks (✓ ✕ – !) stay custom: Lucide's versions
   all sit in circles, which double up inside our colored status badges. */

export {
  Home as HomeIcon,
  ClipboardList as HomeworkIcon,
  LayoutGrid as TimetableIcon,
  CalendarDays as EventsIcon,
  ShieldCheck as ShieldIcon,
  CirclePlay as PlayIcon,
  Trophy as TrophyIcon,
  Images as ImagesIcon,
  CircleHelp as QuestionIcon,
  Phone as PhoneIcon,
  Mail as EnvelopeIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageSquareText as MessageIcon,
  Sun as SunIcon,
  Send as NoteIcon,
  User as UserIcon,
  Megaphone as MegaphoneIcon,
  Paperclip as PaperclipIcon,
  Plus as PlusIcon,
  ArrowRight as ArrowRightIcon,
  CalendarPlus as CalendarPlusIcon,
  ChevronRight as ChevronIcon,
  BookOpen as BookOpenIcon,
  CalendarCheck as CalendarCheckIcon,
  PenLine as PenLineIcon,
  ScrollText as ScrollTextIcon,
} from "lucide-react";

export function CloseIcon(p: IconProps) {
  return <X {...p} />;
}

export function CheckIcon(p: IconProps) {
  return <CircleCheck {...p} />;
}

export function CrossIcon(p: IconProps) {
  return <CircleX {...p} />;
}

/** Universal "more places" glyph — a control mark, not a logo. */
export function MoreIcon(p: IconProps) {
  return <Ellipsis {...p} strokeWidth={2.5} />;
}

/** Bare glyphs for filled badges — no circle, stroke inherits the badge color. */
export function CheckGlyph(p: IconProps) {
  return <Check {...p} strokeWidth={2.8} />;
}

export function CrossGlyph(p: IconProps) {
  return <X {...p} strokeWidth={2.8} />;
}

export function DashGlyph(p: IconProps) {
  return <Minus {...p} strokeWidth={2.8} />;
}

export function ExclaimGlyph(p: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
      aria-hidden
      className={`h-6 w-6 ${p.className ?? ""}`}
    >
      <path d="M12 6v7.5" />
      <path d="M12 17.4h.01" />
    </svg>
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
