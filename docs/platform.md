# Platform plan — iOS today, native apps later

**Question this doc answers:** "Is EduBridge compatible with Apple iOS? Should we
use React Native / Expo?"

## Short answer

Yes — EduBridge is a web app, and web apps run in Safari on every iPhone. On
**September 19, 2026** it was upgraded from "works in the browser" to
**installable**: students and families can add it to the home screen and it
opens full-screen with no browser chrome, like an app from the store.

## What was done for iOS (September 19, 2026)

| Concern | Status |
| --- | --- |
| Viewport & notch | `viewport-fit=cover` + safe-area insets on the page top and bottom tab bar (`env(safe-area-inset-*)`) |
| Double-tap zoom delay | `touch-action: manipulation` on the page — taps respond instantly |
| Grey tap flash | `-webkit-tap-highlight-color: transparent` |
| Text inflation in landscape | `-webkit-text-size-adjust: 100%` |
| Keyboard zoom bug | all form fields render at 16px, so iOS never force-zooms on focus (already true; now documented) |
| Home-screen install | web app manifest (`/manifest.webmanifest`) + `apple-mobile-web-app-*` meta tags + `apple-touch-icon` |
| Phone numbers | explicit `tel:` links on Hotlines; iOS auto-linking disabled so it can't restyle other text |
| Camera | absence-note photo picker uses `capture="environment"` — opens the camera directly on iPhone |
| Scroll feel | `min-h-dvh` (dynamic viewport height, correct with Safari's collapsing URL bar); rubber-band/pull-to-refresh disabled for app feel |

**Home-screen icon:** a flat placeholder tile (deep-green square, white "EB")
generated from the brand tokens. It is deliberately not a logo — swap
`web/public/icon-180.png`, `icon-192.png` and `icon-512.png` when the real
logo is chosen. The in-app UI stays logo-free, as agreed.

## How to test on a real iPhone

1. Start the dev server reachable on the network:
   `npm run dev -- -H 0.0.0.0` (see `docs/running-the-app.md`).
2. On the iPhone (same Wi-Fi), open `http://<your-computer-ip>:3000` in Safari.
3. Share → **Add to Home Screen** → open from the home screen: it should run
   full-screen with the tab bar sitting above the home indicator.
4. Check the absence photo picker opens the camera, and Hotlines buttons
   start a call.

A production build (`npm run build && npm start`) is the real test — dev mode
is slower and must never be used to judge performance.

## The Expo / React Native question

Expo is a toolchain for building **native apps with React Native** — a
different UI layer from this Next.js app. Starting one now would mean
rewriting every screen from scratch, while this web app already works on the
iPhone it needs to work on. Decision:

- **Now: stay a web app.** One codebase runs on iPhone, Android and laptop.
  Install-to-home-screen covers the "feels like an app" need for the pilot.
- **Revisit Expo (or Capacitor, which wraps this exact web app in a native
  shell) only when at least one of these is true:**
  1. the school asks for App Store / Play Store distribution, or
  2. we need push notifications before the web app's notification path exists, or
  3. the pilot shows home-screen install confuses families in practice.

Costs of going native early: a second codebase to keep in sync, Apple's
$99/year developer account, App Store review for a school product, and —
critically — there is no backend yet, so a native shell would be a second
mock of everything.

## Deliberately not done yet

- **Service worker / offline mode.** Offline caching of a timetable we can't
  yet refresh invites showing stale data — the exact trust failure we are
  fixing against the old portal. Add it together with the real backend.
- **Push notifications.** Not meaningful without a server to send them.
