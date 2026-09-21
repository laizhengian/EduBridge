import { z } from "zod";

/**
 * The single source of truth for what user input may look like.
 *
 * Today the forms use these schemas client-side so the error messages users
 * see are exactly the rules the server will enforce. When the backend lands,
 * the same schema runs server-side on every field BEFORE anything touches the
 * database (docs/production-hardening.md → "Input validation") — "the app
 * wouldn't send that" is never a security control.
 *
 * If a field has no job, it has no schema — collect the minimum.
 */

const printableText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Required")
    .max(max, `Keep it under ${max} characters`)
    // Control characters only arrive by paste accident or scripted abuse;
    // nothing visible ever needs them.
    .refine((s) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(s), {
      message: "Contains characters that can't be displayed",
    })
    // Visual separation only: collapse runs of blank lines.
    .transform((s) => s.replace(/\n{3,}/g, "\n\n"));

export const absenceNoteSchema = z.object({
  reason: z.enum(["Sick", "Family matter", "Appointment", "Other"], {
    message: "Pick a reason",
  }),
  when: z.enum(["today", "tomorrow"]),
  detail: z
    .string()
    .trim()
    .max(500, "Keep it under 500 characters")
    .transform((s) => s.replace(/\n{3,}/g, "\n\n"))
    .optional()
    .default(""),
  /** Client-side type check only; the real image gate is server-side (magic
   *  bytes + size + MIME) per docs/security-plan.md → Phase B. */
  photo: z
    .object({ name: z.string().max(255), sizeBytes: z.number().max(10 * 1024 * 1024, "Photos are capped at 10 MB") })
    .optional()
    .nullable(),
});

export const feedbackSchema = z.object({
  // Kept identical to `FeedbackKind` in mock-data.ts — the UI chips and the
  // schema must never drift apart.
  kind: z.enum(["Suggestion", "Praise", "Concern"], {
    message: "Pick a kind",
  }),
  message: printableText(600),
  name: z
    .string()
    .trim()
    .max(80, "Keep the name under 80 characters")
    .optional()
    .default(""),
});

export type AbsenceNoteInput = z.infer<typeof absenceNoteSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;

/** Flatten a Zod failure into one friendly sentence for a toast. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "That input doesn't look right";
}
