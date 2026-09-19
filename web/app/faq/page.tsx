import { ChevronIcon } from "@/components/ui";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I report an absence?",
    a: "Open the Hub and tap “Tell the school I'm away”. Pick the reason, attach a photo of the medical certificate if you have one, and send. It goes straight to your class teacher and the office.",
  },
  {
    q: "What time does school start?",
    a: "Gates open 7:15am. Assembly is at 7:45am and the first period starts at 8:00am. Students arriving after 8:00 sign in at the security gate.",
  },
  {
    q: "My child feels sick during class — what happens?",
    a: "The class teacher sends them to the health room, the office calls you, and pickup is arranged at the security gate. The absence is recorded as excused, with the sick-bay note on file.",
  },
  {
    q: "The homework here doesn't match what the teacher said in class",
    a: "What the teacher says in class always wins. Homework appears here within minutes of being posted — if something is missing, tell the teacher; posting it is a 30-second job on their side.",
  },
  {
    q: "When do exam marks appear?",
    a: "Results appear the day the school releases them, together with the class teacher's comments. The progress report always shows its issue date, so you can see it is current.",
  },
  {
    q: "I lost something on the school bus",
    a: "Call the bus coordinator — the number is in Hub → Hotlines. Items found on buses are kept at the security gate.",
  },
  {
    q: "Can both parents use one account?",
    a: "Yes. Sign in on each parent's phone with the same family account — both see the same homework, results and announcements.",
  },
  {
    q: "Is my family's data safe here?",
    a: "The short version is in Hub → Privacy & terms: in this preview nothing leaves your device, and the school version follows the school's own data rules. No advertising, no tracking, no selling data — ever.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Common questions
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          The things families ask most. If yours is missing, call the office —
          it&#39;s in Hotlines.
        </p>
      </header>

      <div
        className="rise mt-6 rounded-xl border border-hairline bg-paper px-4 py-1"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {FAQS.map((f, i) => (
          <details
            key={f.q}
            className={`group py-1 ${i > 0 ? "border-t border-hairline" : ""}`}
          >
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronIcon
                className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-90"
                aria-hidden
              />
            </summary>
            <p className="pb-4 pr-6 text-sm leading-6 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
