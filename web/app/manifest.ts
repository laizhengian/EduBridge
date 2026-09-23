import type { MetadataRoute } from "next";

// Installable web app: "Add to Home Screen" on iOS/Android opens EduBridge
// full-screen with no browser chrome. The icon tiles are placeholders —
// replaced by the real logo when it exists (docs/platform.md → "Home-screen icon").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EduBridge",
    short_name: "EduBridge",
    description:
      "Homework, timetable and school announcements for students and families.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#1d6b4f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
