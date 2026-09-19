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
    "Homework, timetable and school announcements for Oakbridge students and families.",
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
  themeColor: "#1d6b4f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
