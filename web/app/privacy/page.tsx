import type { Metadata } from "next";
import { ShieldIcon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy & terms",
};

export default function PrivacyPage() {
  const updated = "19 September 2026";
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
        <p className="text-[15px] leading-7">
          EduBridge is a school tool for Oakbridge families. It shows homework,
          the timetable, school events and announcements from the office. This
          page tells you what it stores and the few rules of using it, written
          to be read, not skimmed.
        </p>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          What this app stores
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          Almost nothing, and only on your own device. Your sign-in name and
          your class stay in this browser. The list of homework you mark as
          done stays in this browser too. Nothing is sent anywhere: right now
          the app has no server to send it to.
        </p>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          When the school version arrives, this will change in one way: your
          class's homework and the school's announcements will be kept on the
          school's database so every family sees the same things. We will
          update this page before that happens.
        </p>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          The absence note and your photo
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          When you send an absence note you may attach a photo, for example a
          medical certificate. In this preview the photo never leaves your
          device — there is no server to receive it. In the school version the
          photo goes only to your class teacher and the office, and it is
          deleted after the school has dealt with the absence.
        </p>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          What we do not do
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          No advertising. No tracking. No selling data, ever. The app does not
          follow you to other websites or apps.
        </p>
      </section>

      <section
        className="rise mt-4 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 5 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          Children's information
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          This app is built for schoolchildren and their parents. That sets a
          high bar: we collect the minimum needed to run the school day — a
          name, a class, and the work the school itself assigns. Parents see
          their own child's information, and the school — not any company —
          stays in control of the records.
        </p>
      </section>

      <section
        id="terms"
        className="rise mt-4 scroll-mt-6 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 6 } as React.CSSProperties}
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
        style={{ "--i": 7 } as React.CSSProperties}
      >
        <h2 className="font-display text-[17px] font-semibold">
          If something goes wrong
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          Talk to us first. Write to the school office and mention EduBridge,
          and we will sort it out with you directly.
        </p>
      </section>

      <p className="rise mt-4 text-xs text-muted">
        Written in simple English on purpose. It is not a lawyer's document and
        not legal advice; the school's official policies come first. Last
        updated {updated}.
      </p>
    </div>
  );
}
