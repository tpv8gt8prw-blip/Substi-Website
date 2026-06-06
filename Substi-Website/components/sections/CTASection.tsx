"use client";

import { useTranslations } from "next-intl";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { AppDownloadButtons } from "@/components/sections/AppDownloadButtons";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { SubstiLogo } from "@/components/ui/SubstiLogo";

export function CTASection() {
  const t = useTranslations("cta");
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-5xl border border-line p-10 text-center sm:p-16">
        {/* animated gradient background */}
        <div className="animate-gradient absolute inset-0 -z-10 bg-[linear-gradient(120deg,var(--accent),var(--accent-2),var(--secondary),var(--secondary-2))] opacity-90" />
        <div className="absolute inset-0 -z-10 bg-black/10" />

        {/* floating shapes */}
        <div className="animate-float-slow absolute left-10 top-10 h-20 w-20 rounded-2xl border border-white/20 bg-white/5" />
        <div className="animate-float-medium absolute bottom-10 right-12 h-16 w-16 rounded-full border border-white/20 bg-white/5" />

        <ScrollReveal>
          <SubstiLogo
            size={56}
            className="mx-auto justify-center"
            imageClassName="shadow-xl shadow-black/20"
          />
        </ScrollReveal>

        <AnimatedHeading
          text={t("title")}
          className="justify-center text-center font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
        />
        <ScrollReveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="mx-auto mt-9 flex w-full max-w-2xl flex-col items-center gap-4">
            <AppDownloadButtons variant="cta" className="items-center text-center [&_p]:mx-auto">
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white backdrop-blur-md hover:border-white"
                >
                  {t("readDocs")}
                  <FiArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </AppDownloadButtons>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
