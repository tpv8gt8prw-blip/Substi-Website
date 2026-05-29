import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { FeedbackForm } from "@/components/interactive/FeedbackForm";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { FiMessageCircle, FiHeart, FiZap } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share feedback, report a bug, or request a feature for Substi.",
};

const PERKS = [
  { icon: FiZap, title: "We read everything", body: "Every message lands in our inbox and shapes the roadmap." },
  { icon: FiHeart, title: "Built with students", body: "Most features started as a single suggestion just like yours." },
  { icon: FiMessageCircle, title: "Fast replies", body: "We usually get back within a day or two." },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Feedback"
        title="Tell us what to build next"
        gradientWords={[4]}
        description="Found a bug, have an idea, or just want to say hi? We'd love to hear from you."
      />

      <Section className="pt-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            {PERKS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.1}>
                <div className="flex gap-4 rounded-3xl border border-line bg-bg-elevated/60 p-5 backdrop-blur-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{p.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.15}>
            <FeedbackForm />
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
