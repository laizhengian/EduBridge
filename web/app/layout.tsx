import type { Metadata, Viewport } from "next";
import { Nunito, Public_Sans } from "next/font/google";
import { Shell } from "@/components/Shell";
import "./globals.css";

// Two fonts, two clear jobs:
// Nunito (headings, big numbers) — rounded and sturdy: friendly to an 8-year-old, clear to a 68-year-old
// Public Sans (everything else) — neutral and easy to read for long text
const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduBridge",
  description:
    "Homework, timetable and school announcements for students and families.",
  // iOS: "Add to Home Screen" installs as a standalone app (no Safari chrome).
  // "default" keeps dark status-bar text over our light paper background.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduBridge",
  },
  // Stop iOS auto-linking phone numbers — we place tel: links deliberately.
  formatDetection: { telephone: false },
  // Home-screen tile. iOS needs PNG (it ignores SVG); the flat "EB" mark is
  // a placeholder until the real logo exists (docs/platform.md).
  icons: { apple: "/icon-180.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The browser chrome (and iOS status bar) follow the user's accent choice —
  // The browser chrome follows the user's accent choice — the swatch in
  // Settings syncs this when the school picks its colour.
  themeColor: "#1d6b4f",
  // Android: the keyboard resizes the page instead of overlaying it, so the
  // focused input and the action buttons always stay visible above it.
  // iOS Safari already behaves this way with the visual viewport.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${publicSans.variable} h-full antialiased`}
      // The pre-paint script above may add the saved text-size class before
      // hydration — that attribute difference is intentional (next-themes does
      // the same); suppress the dev-only warning without affecting children.
      suppressHydrationWarning
    >
      <head>
        {/* Restore the saved preferences before first paint — no flash of the
            wrong text size, accent colour or mode (see lib/text-size and
            lib/appearance). Same pre-paint pattern next-themes uses. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var s=localStorage.getItem("ois-text-size");if(s==="large")document.documentElement.classList.add("text-large");else if(s==="larger")document.documentElement.classList.add("text-larger");var a=localStorage.getItem("ois-accent");if(a==="blue")document.documentElement.classList.add("accent-blue");else if(a==="maroon")document.documentElement.classList.add("accent-maroon");else if(a==="plum")document.documentElement.classList.add("accent-plum");else if(a==="amber")document.documentElement.classList.add("accent-amber");var m=localStorage.getItem("ois-mode");if(m==="dark"||( !m||m==="system")&&matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark")}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-full">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
