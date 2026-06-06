# Substi — Marketing Website

A production-ready, animation-rich marketing site for **Substi**, the iOS app that
turns your school timetable into a game. Built with parallax effects, smooth
Framer Motion animations, and a polished dark/light theme.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first config, theme tokens via CSS variables)
- **Framer Motion** — scroll-linked parallax, reveals, gestures
- **next-themes** — dark / light / system with smooth transitions
- **next-intl** — English / Deutsch i18n with `/[locale]` routing
- **react-icons**, **clsx**, **tailwind-merge**

## Internationalization (i18n)

The site is fully localized in **English (`/en`)** and **Deutsch (`/de`)** via
[next-intl](https://next-intl.dev).

- **Routing:** every page lives under `app/[locale]/…`. Visiting `/` redirects
  to the best matching locale (cookie → `Accept-Language` → default `en`).
- **Locale detection & cookie:** handled by `proxy.ts` (Next 16's renamed
  middleware) using `createMiddleware(routing)`.
- **Config:** `i18n/routing.ts` (locales), `i18n/navigation.ts` (locale-aware
  `Link`/`useRouter`/`usePathname`), `i18n/request.ts` (loads messages).
- **Messages:** all copy lives in `messages/en.json` and `messages/de.json`.
  Components read it with `useTranslations()` / `getTranslations()`; arrays use
  `t.raw()`.
- **Language switcher:** the EN/DE pill in the navbar (next to the theme
  toggle) swaps locale client-side via `router.replace(pathname, { locale })`
  — no full reload, current path preserved.
- **Static rendering:** each locale is prerendered at build time
  (`generateStaticParams` + `setRequestLocale`).

To add a locale: add it to `routing.locales`, drop in a `messages/<locale>.json`,
and you're done.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Pages

| Route        | Highlights                                                            |
| ------------ | --------------------------------------------------------------------- |
| `/`          | Multi-layer parallax hero, feature cards (tilt + modal), animated timeline, count-up stats, testimonials, gradient CTA |
| `/docs`      | Sticky animated sidebar, copyable code blocks, FAQ accordion          |
| `/privacy`   | Sticky table of contents, scroll-reveal sections                      |
| `/feedback`  | Validated form with focus glow, shake errors, loading dots, confetti success |
| `/changelog` | Alternating timeline with draw-on-scroll line + roadmap               |
| `/community` | Counter stats, swipeable testimonial carousel, staggered leaderboard  |

## Project structure

```
app/
  layout.tsx             # pass-through root layout
  [locale]/              # localized routes (home + 5 pages) + html shell
i18n/                    # routing, navigation, request config (next-intl)
messages/                # en.json, de.json — all UI copy
proxy.ts                 # locale detection / routing (Next 16 middleware)
components/
  layout/                # Header, Footer, PageHero
  sections/              # Hero, Features, HowItWorks, Stats, Testimonials, CTA
  interactive/           # AnimatedHeading, AnimatedCounter, TiltCard, Carousel,
                         # Accordion, FeedbackForm, Confetti, PhoneMockup, ...
  ui/                    # Button, Modal, Section primitives
  theme/                 # ThemeProvider, ThemeToggle
  docs/ · changelog/ · community/   # page-specific blocks
hooks/                   # useParallax, useMounted
lib/                     # animations (variants), content (copy/data), utils
```

## Design system

Theme tokens live in `app/globals.css` as CSS variables (`--accent`, `--fg`,
`--bg`, …) and are mapped into Tailwind via `@theme inline`, so utilities like
`bg-bg`, `text-fg`, and `bg-accent` stay theme-reactive. Dark mode is class-based
(`.dark` on `<html>`, driven by next-themes).

- **Accent:** orange `#ff7a00 → #ff9d26`  ·  **Secondary:** blue/cyan
- **Fonts:** Sora (display), Inter (body), JetBrains Mono (code)
- **Motion timing:** fast `0.2–0.3s` (interactions), medium `0.5–0.7s`
  (reveals), slow `0.8s+` (scroll). Respects `prefers-reduced-motion`.

## Customising

- **Copy & translations:** edit `messages/en.json` and `messages/de.json`. All
  user-facing text lives here. `lib/content.ts` now only holds non-text
  metadata (icons, accent colors, numeric stat values, hrefs).
- **Feedback form:** set your Formspree endpoint in
  `components/interactive/FeedbackForm.tsx` (`FORMSPREE_ENDPOINT`). Until then it
  runs in demo mode and always shows the success state.
- **Colors:** tweak the variables in `:root` / `.dark` in `app/globals.css`.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero config.
```bash
npm run build && npm start
```
