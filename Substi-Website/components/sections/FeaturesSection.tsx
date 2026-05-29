"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { FEATURES, type Feature } from "@/lib/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { TiltCard } from "@/components/interactive/TiltCard";
import { Modal } from "@/components/ui/Modal";
import { fadeUp, viewportOnce } from "@/lib/animations";

export function FeaturesSection() {
  const [active, setActive] = useState<Feature | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Two parallax tracks so alternating cards drift at different speeds.
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <Section id="features">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <Eyebrow>Features</Eyebrow>
        </ScrollReveal>
        <AnimatedHeading
          text="Everything your timetable wishes it could do"
          gradientWords={[5, 6]}
          className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
        />
        <ScrollReveal delay={0.15}>
          <p className="mt-5 text-lg text-fg-muted">
            Four pillars that make Substi the schedule app students actually open
            on purpose.
          </p>
        </ScrollReveal>
      </div>

      <div ref={ref} className="mt-16 grid gap-6 sm:grid-cols-2">
        {FEATURES.map((feature, i) => (
          <motion.div key={feature.title} style={{ y: i % 2 === 0 ? yA : yB }}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <TiltCard className="h-full p-8">
                <button
                  onClick={() => setActive(feature)}
                  className="flex h-full w-full flex-col items-start text-left"
                >
                  <motion.span
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${feature.accent}, ${feature.accent}cc)`,
                      boxShadow: `0 10px 30px -8px ${feature.accent}80`,
                    }}
                  >
                    <feature.icon className="h-7 w-7" />
                  </motion.span>

                  <h3 className="mt-6 font-display text-2xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 flex-1 text-fg-muted leading-relaxed">
                    {feature.short}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Learn more
                    <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              </TiltCard>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div>
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              style={{
                background: `linear-gradient(135deg, ${active.accent}, ${active.accent}cc)`,
              }}
            >
              <active.icon className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold">{active.title}</h3>
            <p className="mt-3 leading-relaxed text-fg-muted">{active.long}</p>
          </div>
        )}
      </Modal>
    </Section>
  );
}
