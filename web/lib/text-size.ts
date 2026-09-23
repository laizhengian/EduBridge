// Text size preference. The whole app scales from one setting: we size type
// in rem and scale the root font size, so text grows proportionally and
// nothing can clip its container (the layout is fluid). Two steps above
// standard — enough for a grandparent, small enough to keep rows compact.
export const TEXT_SIZES = ["standard", "large", "larger"] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

const KEY = "ois-text-size";
const CLASS: Record<TextSize, string> = {
  standard: "",
  large: "text-large",
  larger: "text-larger",
};

export function loadTextSize(): TextSize {
  try {
    const raw = window.localStorage.getItem(KEY);
    return TEXT_SIZES.includes(raw as TextSize) ? (raw as TextSize) : "standard";
  } catch {
    return "standard";
  }
}

export function applyTextSize(size: TextSize) {
  const el = document.documentElement;
  el.classList.remove("text-large", "text-larger");
  if (CLASS[size]) el.classList.add(CLASS[size]);
}

export function saveTextSize(size: TextSize) {
  try {
    window.localStorage.setItem(KEY, size);
  } catch {
    /* private mode — the setting just won't persist */
  }
  applyTextSize(size);
}
