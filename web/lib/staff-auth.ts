// Staff sign-in for the preview build. Fixed accounts, checked on this
// device — exactly one step above a curtain. When Supabase arrives these
// three functions become real auth calls (email + password per staff
// account) and every call site keeps working unchanged.
//
//   teacher app → teacher / 123ABC
//   admin console → admin / 456DEF

const CREDENTIALS = {
  teacher: { user: "teacher", pass: "123ABC" },
  admin: { user: "admin", pass: "456DEF" },
} as const;

export type StaffRole = keyof typeof CREDENTIALS;

const storageKey = (role: StaffRole) => `ois-staff-auth-${role}`;

export function isStaffSignedIn(role: StaffRole): boolean {
  try {
    return window.localStorage.getItem(storageKey(role)) === "1";
  } catch {
    return false;
  }
}

export function staffSignIn(role: StaffRole, username: string, password: string): boolean {
  const c = CREDENTIALS[role];
  if (username !== c.user || password !== c.pass) return false;
  try {
    window.localStorage.setItem(storageKey(role), "1");
  } catch {
    // private mode etc — sign-in still works for this page load
  }
  return true;
}

export function staffSignOut(role: StaffRole): void {
  try {
    window.localStorage.removeItem(storageKey(role));
  } catch {
    // nothing to clean up
  }
}
