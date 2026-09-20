// Tactile feedback through the Vibration API. Android Chrome responds today;
// iOS Safari has no web vibration API and silently no-ops, so calls are safe
// everywhere. Keep it little: one short tick on committed actions, never on
// scroll or hover. See docs/platform.md → "Haptics" for the native-shell plan.
type HapticKind = "light" | "medium" | "success" | "warning";

const PATTERNS: Record<HapticKind, number | number[]> = {
  light: 8,
  medium: 16,
  success: [10, 40, 16],
  warning: [20, 60, 20],
};

export function haptic(kind: HapticKind = "light") {
  try {
    navigator.vibrate?.(PATTERNS[kind]);
  } catch {
    // never let feedback break the action it accompanies
  }
}
