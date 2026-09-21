import type { Metadata } from "next";
import { ShieldIcon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy & terms",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl pb-6">
      <header className="rise">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <ShieldIcon className="h-5.5 w-5.5" />
        </span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Privacy &amp; terms
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          What EduBridge stores and the few rules of using it — in plain words.
        </p>
      </header>

      <section
        className="rise mt-6 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          What this app stores
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          Almost nothing, and only on your own device. Your sign-in name, your
          class, and the homework you mark as done stay in this browser. Right
          now there is no server to send anything to. When the school version
          arrives, class homework and announcements will live on the school's
          own database — this page will be updated before that happens.
        </p>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          The absence note and your photo
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          A photo you attach to an absence note, such as a medical certificate,
          never leaves your device in this preview. In the school version it
          goes only to your class teacher and the office, and is deleted once
          the absence is dealt with.
        </p>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          What we do not do
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          No advertising. No tracking. No selling data, ever.
        </p>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          This app is built for schoolchildren and their parents, so it
          collects the minimum: a name, a class, and the work the school
          assigns. Parents see their own child's information only.
        </p>
      </section>

      <section
        id="terms"
        className="rise mt-4 scroll-mt-6 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          The few rules of using it
        </h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted">
          <li>Use your own account; let your family use the app through you.</li>
          <li>
            Content in the app comes from the school — don't repost it
            elsewhere.
          </li>
          <li>Don't try to break, probe, or get around the app's protections.</li>
          <li>Accounts are removed when a student leaves the school.</li>
        </ul>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 5 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          If something goes wrong
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          Talk to us first — we sort things out directly.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <a
            href="mailto:zhengianlai@gmail.com"
            className="pressable min-h-[44px] rounded-xl border border-hairline bg-background px-4 py-2.5 text-sm font-semibold text-accent"
          >
            zhengianlai@gmail.com
          </a>
          <a
            href="tel:+601154043298"
            className="pressable min-h-[44px] rounded-xl border border-hairline bg-background px-4 py-2.5 text-sm font-semibold text-accent"
          >
            +60 11-5404 3298
          </a>
        </div>
      </section>

      <p className="rise mt-4 text-xs text-muted">
        Last updated 19 September 2026.
      </p>
    </div>
  );
}
