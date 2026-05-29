import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Substi handles your data — short version: minimally and safely.",
};

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "Substi is built privacy-first. We collect the absolute minimum needed to show your timetable and run the prediction game, and we never sell your data.",
      "This page explains exactly what we store, where, and why.",
    ],
  },
  {
    id: "data",
    title: "What we collect",
    list: [
      "Your WebUntis server, school, and login — used only to fetch your timetable.",
      "Your in-app coins, predictions, and leaderboard score.",
      "Basic, anonymous usage signals to fix crashes and improve performance.",
    ],
  },
  {
    id: "storage",
    title: "Where it lives",
    body: [
      "Your credentials are stored securely on your device. Game state (coins, predictions) syncs to our servers so you can switch devices, and is tied to an anonymous identifier — not your real name.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    body: [
      "We do not sell, rent, or trade your personal data. The only data visible to others is your chosen leaderboard display name and score.",
    ],
  },
  {
    id: "control",
    title: "Your control",
    list: [
      "Log out any time to remove your credentials from the device.",
      "Request deletion of your synced game data from the Account screen.",
      "Disable the leaderboard to keep your score private.",
    ],
  },
  {
    id: "terms",
    title: "Terms",
    body: [
      "Substi is provided as-is for personal, non-commercial use. All in-app coins are virtual, have no monetary value, and cannot be exchanged for real money or goods.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Your data, handled with respect"
        gradientWords={[3]}
        description="The short version: we collect the minimum, store it safely, and never sell it."
      />

      <Section className="pt-6">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* sticky TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-subtle">
                On this page
              </p>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-fg/5 hover:text-accent"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="max-w-2xl space-y-12">
            {SECTIONS.map((s) => (
              <ScrollReveal key={s.id} as="section">
                <div id={s.id} className="scroll-mt-28">
                  <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                  {s.body?.map((p, i) => (
                    <p key={i} className="mt-3 leading-relaxed text-fg-muted">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="mt-4 space-y-2.5">
                      {s.list.map((item, i) => (
                        <li key={i} className="flex gap-3 text-fg-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollReveal>
            ))}
            <p className="text-sm text-fg-subtle">Last updated: May 2026</p>
          </div>
        </div>
      </Section>
    </>
  );
}
