import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/layout/PageHero";
import { CommunityHeroCtas } from "@/components/community/CommunityHeroCtas";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { Carousel } from "@/components/interactive/Carousel";
import { Leaderboard } from "@/components/community/Leaderboard";
import { COMMUNITY_STAT_META, FEATURED_COUNT } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community" });
  return { title: t("eyebrow"), description: t("desc") };
}

function StatsRow() {
  const t = useTranslations("community");
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {COMMUNITY_STAT_META.map((s, i) => {
        const Icon = s.icon;
        return (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="rounded-4xl border border-line bg-bg-elevated/70 p-7 text-center backdrop-blur-md">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon className="h-6 w-6" />
              </span>
              <div className="mt-4 font-display text-4xl font-extrabold">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-1 text-sm text-fg-muted">{t(`stats.${i}.label`)}</p>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("community");

  const featured = Array.from({ length: FEATURED_COUNT }, (_, i) => ({
    name: ["streakwizard", "lena.m", "tobi_k"][i],
    role: t(`featured.${i}.role`),
    quote: t(`featured.${i}.quote`),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        highlight={t("titleHighlight")}
        description={t("desc")}
      >
        <CommunityHeroCtas />
      </PageHero>

      <Section className="pt-6">
        <StatsRow />
      </Section>

      <Section className="bg-bg-subtle">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <Eyebrow>{t("featuredEyebrow")}</Eyebrow>
          </ScrollReveal>
          <AnimatedHeading
            text={t("featuredTitle")}
            highlight={t("featuredHighlight")}
            className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
          />
        </div>
        <div className="mt-12">
          <Carousel slides={featured} />
        </div>
      </Section>

      <Section id="leaderboard">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <Eyebrow>{t("leaderboardEyebrow")}</Eyebrow>
          </ScrollReveal>
          <AnimatedHeading
            text={t("leaderboardTitle")}
            highlight={t("leaderboardHighlight")}
            className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
          />
        </div>
        <div className="mx-auto mt-12 max-w-2xl">
          <Leaderboard />
          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-center text-sm text-fg-muted">
              {t("leaderboardCaption")}
            </p>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
