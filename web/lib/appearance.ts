// Appearance preferences: accent colour and light/dark. Two classes on
// <html> carry the whole theme — `.accent-*` swaps the palette, `.dark`
// flips every surface token (globals.css). Both are restored before first
// paint by the script in layout.tsx, so there is no flash of the wrong
// theme, the same mechanism text-size uses.
export const ACCENTS = [
  "green",
  "blue",
  "teal",
  "indigo",
  "maroon",
  "rose",
  "plum",
  "amber",
] as const;
export type Accent = (typeof ACCENTS)[number];

export const MODES = ["light", "dark", "system"] as const;
export type Mode = (typeof MODES)[number];

const ACCENT_KEY = "ois-accent";
const MODE_KEY = "ois-mode";

const ACCENT_CLASS: Record<Accent, string> = {
  green: "",
  blue: "accent-blue",
  teal: "accent-teal",
  indigo: "accent-indigo",
  maroon: "accent-maroon",
  rose: "accent-rose",
  plum: "accent-plum",
  amber: "accent-amber",
};

export function loadAccent(): Accent {
  try {
    const raw = window.localStorage.getItem(ACCENT_KEY);
    return ACCENTS.includes(raw as Accent) ? (raw as Accent) : "green";
  } catch {
    return "green";
  }
}

export function loadMode(): Mode {
  try {
    const raw = window.localStorage.getItem(MODE_KEY);
    return MODES.includes(raw as Mode) ? (raw as Mode) : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyAccent(accent: Accent) {
  const el = document.documentElement;
  for (const a of ACCENTS) {
    if (ACCENT_CLASS[a]) el.classList.remove(ACCENT_CLASS[a]);
  }
  if (ACCENT_CLASS[accent]) el.classList.add(ACCENT_CLASS[accent]);
}

function applyDark(on: boolean) {
  document.documentElement.classList.toggle("dark", on);
}

/** Resolve the mode (following the system for "system") and apply it. */
export function applyMode(mode: Mode) {
  applyDark(mode === "dark" || (mode === "system" && systemPrefersDark()));
}

export function saveAccent(accent: Accent) {
  try {
    window.localStorage.setItem(ACCENT_KEY, accent);
  } catch {
    /* private mode — the setting just won't persist */
  }
  applyAccent(accent);
}

export function saveMode(mode: Mode) {
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* private mode — the setting just won't persist */
  }
  applyMode(mode);
}

/** Follow the OS live while the user is on "system". Returns the cleanup. */
export function watchSystemMode(): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (loadMode() === "system") applyMode("system");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
