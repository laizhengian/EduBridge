// The signed-in person's basics, saved on this device. Replaced by the real
// account when Supabase sign-in is wired in. The role decides which feature
// set the app shows — same app, different doors (teacher tools live at
// /teacher/*; students and parents never see them).
export type Role = "student" | "teacher";
export type Profile = { name: string; className: string; role: Role };

const KEY = "ois-profile";

export function loadProfile(): Profile | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    // Older saved profiles predate roles — they were students.
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      name: parsed.name ?? "Student",
      className: parsed.className ?? "",
      role: parsed.role === "teacher" ? "teacher" : "student",
    };
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  window.localStorage.setItem(KEY, JSON.stringify(p));
}
