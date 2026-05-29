import type { Metadata } from "next";
import { FaDiscord } from "react-icons/fa";
import { FiUsers, FiTrendingUp, FiMessageSquare } from "react-icons/fi";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { Carousel } from "@/components/interactive/Carousel";
import { Leaderboard } from "@/components/community/Leaderboard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Community",
  description: "Join thousands of students predicting their schedules together.",
};

const STATS = [
  { icon: FiUsers, value: 5400, suffix: "+", label: "Discord members" },
  { icon: FiTrendingUp, value: 12000, suffix: "+", label: "Predictions placed" },
  { icon: FiMessageSquare, value: 320, suffix: "/day", label: "Messages" },
];

const FEATURED = [
  { name: "streakwizard", role: "32-day streak", quote: "Predicting cancellations got me the #1 spot. The community keeps me coming back." },
  { name: "lena.m", role: "Top predictor", quote: "Casino mode during free periods with my class is the best part of school now." },
  { name: "tobi_k", role: "Beta tester", quote: "Reported a bug on Discord and it was fixed the next day. These devs actually listen." },
];

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="You're not predicting alone"
        gradientWords={[2]}
        description="Join thousands of students comparing streaks, sharing tips, and climbing the leaderboard together."
      >
        <ScrollReveal delay={0.25}>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="bg-[#5865F2] hover:bg-[#5865F2]">
              <FaDiscord className="h-5 w-5" />
              Join the Discord
            </Button>
          </div>
        </ScrollReveal>
      </PageHero>

      <Section className="pt-6">
        {/* stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.1}>
              <div className="rounded-4xl border border-line bg-bg-elevated/70 p-7 text-center backdrop-blur-md">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <s.icon className="h-6 w-6" />
                </span>
                <div className="mt-4 font-display text-4xl font-extrabold">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-1 text-sm text-fg-muted">{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="bg-bg-subtle">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <Eyebrow>Featured members</Eyebrow>
          </ScrollReveal>
          <AnimatedHeading
            text="Meet the people on the board"
            gradientWords={[5]}
            className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
          />
        </div>
        <div className="mt-12">
          <Carousel slides={FEATURED} />
        </div>
      </Section>

      <Section id="leaderboard">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <Eyebrow>Leaderboard</Eyebrow>
          </ScrollReveal>
          <AnimatedHeading
            text="This week's top predictors"
            gradientWords={[3]}
            className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
          />
        </div>
        <div className="mx-auto mt-12 max-w-2xl">
          <Leaderboard />
          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-center text-sm text-fg-muted">
              Download Substi and start climbing — the board resets every Monday.
            </p>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
