import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { FeedbackForm } from "@/components/interactive/FeedbackForm";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { FiMessageCircle, FiHeart, FiZap } from "react-icons/fi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "feedback" });
  return { title: t("eyebrow"), description: t("desc") };
}

const PERK_ICONS = [FiZap, FiHeart, FiMessageCircle];

function Perks() {
  const t = useTranslations("feedback");
  return (
    <div className="space-y-5">
      {PERK_ICONS.map((Icon, i) => (
        <ScrollReveal key={i} delay={i * 0.1}>
          <div className="flex gap-4 rounded-3xl border border-line bg-bg-elevated/60 p-5 backdrop-blur-md">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">{t(`perks.${i}.title`)}</h3>
              <p className="mt-1 text-sm text-fg-muted">{t(`perks.${i}.body`)}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("feedback");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        highlight={t("titleHighlight")}
        description={t("desc")}
      />

      <Section className="pt-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Perks />
          <ScrollReveal delay={0.15}>
            <FeedbackForm />
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
