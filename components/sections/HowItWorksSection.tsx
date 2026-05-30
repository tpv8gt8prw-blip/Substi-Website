"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { STEP_COUNT } from "@/lib/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { fromLeft, fromRight, viewportOnce } from "@/lib/animations";

export function HowItWorksSection() {
  const t = useTranslations("how");
  const steps = Array.from({ length: STEP_COUNT }, (_, i) => i);

  return (
    <Section id="how" className="bg-bg-subtle">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </ScrollReveal>
        <AnimatedHeading
          text={t("title")}
          highlight={t("titleHighlight")}
          className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
        />
      </div>

      <div className="relative mx-auto mt-16 max-w-3xl">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-[27px] top-2 hidden h-[calc(100%-1rem)] w-0.5 origin-top bg-gradient-to-b from-accent via-accent-2 to-secondary sm:block"
        />

        <ul className="space-y-8">
          {steps.map((i) => (
            <motion.li
              key={i}
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
                {i + 1}
              </motion.span>
              <div className="rounded-3xl border border-line bg-bg-elevated/70 p-6 backdrop-blur-md">
                <h3 className="font-display text-xl font-bold">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="mt-2 text-fg-muted leading-relaxed">
                  {t(`steps.${i}.body`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
