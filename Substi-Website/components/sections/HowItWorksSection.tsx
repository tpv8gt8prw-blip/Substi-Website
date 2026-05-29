"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { fromLeft, fromRight, viewportOnce } from "@/lib/animations";

export function HowItWorksSection() {
  return (
    <Section id="how" className="bg-bg-subtle">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <Eyebrow>How it works</Eyebrow>
        </ScrollReveal>
        <AnimatedHeading
          text="From login to leaderboard in minutes"
          gradientWords={[4]}
          className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
        />
      </div>

      <div className="relative mx-auto mt-16 max-w-3xl">
        {/* center line that draws on scroll */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-[27px] top-2 hidden h-[calc(100%-1rem)] w-0.5 origin-top bg-gradient-to-b from-accent via-accent-2 to-secondary sm:block"
        />

        <ul className="space-y-8">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              variants={i % 2 === 0 ? fromLeft : fromRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative flex gap-5 sm:gap-7"
            >
              <motion.span
                whileInView={{ scale: [0.5, 1.15, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 font-display text-xl font-extrabold text-white shadow-lg shadow-accent/30"
              >
                {step.n}
              </motion.span>
              <div className="rounded-3xl border border-line bg-bg-elevated/70 p-6 backdrop-blur-md">
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-fg-muted leading-relaxed">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
