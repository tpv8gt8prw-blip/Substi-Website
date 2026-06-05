"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { FiArrowRight, FiArrowDown } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { AppDownloadButtons } from "@/components/sections/AppDownloadButtons";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { PhoneMockup } from "@/components/interactive/PhoneMockup";

export function HeroSection() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layered parallax — each moves at a different speed for depth.
  const ySky = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yClouds = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Layer 1 — sky / aurora (slowest) */}
      <motion.div style={{ y: ySky }} className="absolute inset-0 -z-30">
        <div className="grid-bg absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="animate-aurora absolute -left-1/4 top-0 h-[60vh] w-[60vh] rounded-full bg-accent/25 blur-[120px]" />
        <div className="animate-aurora absolute right-0 top-1/4 h-[50vh] w-[50vh] rounded-full bg-secondary/20 blur-[120px] [animation-delay:-8s]" />
      </motion.div>

      {/* Layer 2 — floating shapes (medium) */}
      <motion.div style={{ y: yClouds }} className="absolute inset-0 -z-20">
        <div className="animate-float-slow absolute left-[8%] top-[22%] h-16 w-16 rounded-2xl border border-accent/30 bg-accent/5 backdrop-blur-sm" />
        <div className="animate-float-medium absolute right-[12%] top-[30%] h-24 w-24 rounded-full border border-secondary/30 bg-secondary/5 backdrop-blur-sm" />
        <div className="animate-float-slow absolute bottom-[18%] left-[16%] h-12 w-12 rotate-45 rounded-lg border border-accent/30 bg-accent/5 [animation-delay:-3s]" />
        <div className="animate-float-medium absolute bottom-[26%] right-[20%] h-8 w-8 rounded-full bg-accent/20 [animation-delay:-2s]" />
      </motion.div>

      {/* Layer 3 — content (normal) */}
      <motion.div
        style={{ y: yContent, opacity }}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-fg-muted backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t("badge")}
          </motion.div>

          <AnimatedHeading
            as="h1"
            text={`${t("titleLead")} ${t("titleHighlight")}`}
            highlight={t("titleHighlight")}
            delay={0.1}
            className="mt-6 font-display text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-tight"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-8"
          >
            <AppDownloadButtons variant="hero">
              <Link href="/community">
                <Button size="lg" variant="outline">
                  {t("joinCommunity")}
                  <FiArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </AppDownloadButtons>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex items-center gap-6 text-sm text-fg-subtle"
          >
            <span>{t("rating")}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{t("predictions")}</span>
          </motion.div>
        </div>

        <div className="relative">
          <PhoneMockup />
        </div>
      </motion.div>

      {/* scroll indicator */}
      <motion.a
        href="#features"
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-fg-subtle"
      >
        <span className="text-xs uppercase tracking-widest">{t("scroll")}</span>
        <FiArrowDown className="animate-bounce-down h-5 w-5" />
      </motion.a>
    </section>
  );
}
