import { examResults } from "@/lib/mock-data";
import { DotTag, SubjectChip } from "@/components/ui";
import { PageBackdrop } from "@/components/PageBackdrop";

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ResultsPage() {
  const [latest, previous] = examResults;

  return (
    <div className="mx-auto max-w-3xl">
      <PageBackdrop motif="results" />
      <header className="rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Exam results
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {latest.term} · released {longDate(latest.issuedAt)}
        </p>
      </header>

      {/* one term at a glance, change since last exam next to each mark */}
      <section
        className="rise mt-6 rounded-xl border border-hairline bg-paper px-4 py-1"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {latest.results.map((r, i) => {
          const prev = previous?.results.find((p) => p.subject === r.subject);
          const delta = prev ? r.score - prev.score : null;
          const below = r.score < r.passMark;
          return (
            <div
              key={r.subject}
              className={`py-4 ${i > 0 ? "border-t border-hairline" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium">{r.subject}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <SubjectChip>{r.grade}</SubjectChip>
                    {delta !== null && delta !== 0 && (
                      <span
                        className={`text-xs font-semibold ${
                          delta > 0 ? "text-accent-strong" : "text-danger"
                        }`}
                      >
                        {delta > 0 ? "↑" : "↓"} {Math.abs(delta)} since{" "}
                        {previous.term.split(",")[0]}
                      </span>
                    )}
                    {delta === 0 && (
                      <span className="text-xs text-muted">
                        steady since {previous.term.split(",")[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`font-display text-lg font-semibold ${
                      below ? "text-danger" : ""
                    }`}
                  >
                    {r.score}
                    <span className="text-sm font-normal text-muted">
                      /{r.max}
                    </span>
                  </p>
                </div>
              </div>
              {below && (
                <div className="mt-1.5">
                  <DotTag color="red">below the pass mark ({r.passMark})</DotTag>
                </div>
              )}
              {r.teacherComment && (
                <p className="mt-1.5 border-l-2 border-accent-soft pl-3 text-[13px] leading-5 text-muted">
                  {r.teacherComment}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* legend — colour means exactly one thing here */}
      <p className="rise mt-2.5 text-xs leading-5 text-muted" style={{ "--i": 2 } as React.CSSProperties}>
        Colour means one thing: red sits below the pass mark. Everything else is
        a pass, so it stays plain.
      </p>

      {/* the progress report, stamped with its issue date so it can't go stale silently */}
      <section
        className="rise mt-6 rounded-xl border border-hairline bg-paper p-5"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[17px] font-semibold">
            Student progress report
          </h2>
          <DotTag color="green">up to date</DotTag>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          “{latest.classTeacherComment}”
        </p>
        <p className="mt-3 border-t border-hairline pt-3 text-xs text-muted">
          Issued by the class teacher · Class 8B · {longDate(latest.issuedAt)}
        </p>
      </section>

      {/* earlier this year, compact */}
      {previous && (
        <section className="rise mt-6 pb-2" style={{ "--i": 4 } as React.CSSProperties}>
          <h2 className="font-display text-[17px] font-semibold">
            Earlier this year
          </h2>
          <p className="mt-0.5 text-xs text-muted">{previous.term}</p>
          <div className="mt-3 rounded-xl border border-hairline bg-paper px-4 py-1">
            {previous.results.map((r, i) => (
              <div
                key={r.subject}
                className={`flex items-center justify-between py-3 ${
                  i > 0 ? "border-t border-hairline" : ""
                }`}
              >
                <span className="text-[15px] text-muted">{r.subject}</span>
                <span className="text-sm text-muted">
                  {r.score}/{r.max} · {r.grade}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-5 pb-2 text-xs text-muted">
        Sample data for the design preview.
      </p>
    </div>
  );
}
