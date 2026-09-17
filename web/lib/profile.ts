// The signed-in person's basics, saved on this device. Replaced by the real
// account when Supabase sign-in is wired in.
export type Profile = { name: string; className: string };

const KEY = "ois-profile";

export function loadProfile(): Profile | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  window.localStorage.setItem(KEY, JSON.stringify(p));
}
