# Substi — Marketing Website

A production-ready, animation-rich marketing site for **Substi**, the iOS app that
turns your school timetable into a game. Built with parallax effects, smooth
Framer Motion animations, and a polished dark/light theme.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first config, theme tokens via CSS variables)
- **Framer Motion** — scroll-linked parallax, reveals, gestures
- **next-themes** — dark / light / system with smooth transitions
- **react-icons**, **clsx**, **tailwind-merge**

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
app/                     # routes (home + 5 pages) and root layout
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

- **Copy & data:** edit `lib/content.ts` (features, stats, steps, FAQ, changelog,
  testimonials, nav links).
- **Feedback form:** set your Formspree endpoint in
  `components/interactive/FeedbackForm.tsx` (`FORMSPREE_ENDPOINT`). Until then it
  runs in demo mode and always shows the success state.
- **Colors:** tweak the variables in `:root` / `.dark` in `app/globals.css`.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero config.
```bash
npm run build && npm start
```
