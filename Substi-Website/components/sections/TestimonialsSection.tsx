"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiStar } from "react-icons/fi";
import { useParallax } from "@/hooks/useParallax";
import { TESTIMONIAL_COUNT } from "@/lib/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";

function Card({
  quote,
  name,
  role,
  offset,
}: {
  quote: string;
  name: string;
  role: string;
  offset: number;
}) {
  const { ref, y } = useParallax(offset);
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="flex flex-col rounded-4xl border border-line bg-bg-elevated/70 p-7 backdrop-blur-md"
    >
      <span className="font-display text-5xl leading-none text-accent/30">&ldquo;</span>
      <div className="-mt-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
          >
            <FiStar className="h-4 w-4 fill-accent text-accent" />
          </motion.span>
        ))}
      </div>
      <p className="mt-4 flex-1 leading-relaxed text-fg">{quote}</p>
      <div className="mt-6 flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-bold text-white"
        >
          {name.charAt(0)}
        </motion.span>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-fg-muted">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const offsets = [50, -30, 40];
  const items = Array.from({ length: TESTIMONIAL_COUNT }, (_, i) => i);

  return (
    <Section className="bg-bg-subtle">
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

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {items.map((i) => (
          <Card
            key={i}
            quote={t(`items.${i}.quote`)}
            name={t(`items.${i}.name`)}
            role={t(`items.${i}.role`)}
            offset={offsets[i]}
          />
        ))}
      </div>
    </Section>
  );
}
