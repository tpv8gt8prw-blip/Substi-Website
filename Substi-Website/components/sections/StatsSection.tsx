"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { STAT_META } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";

export function StatsSection() {
  const t = useTranslations("stats");

  return (
    <Section>
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {STAT_META.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-4xl border border-line bg-bg-elevated/70 p-7 text-center backdrop-blur-md"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-accent/5 group-hover:to-secondary/5 group-hover:opacity-100" />
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon className="h-6 w-6" />
              </span>
              <div className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-fg-muted">
                {t(`items.${i}.label`)}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
