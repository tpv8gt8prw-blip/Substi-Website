import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/changelog/Timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "changelog" });
  return { title: t("eyebrow"), description: t("desc") };
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("changelog");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        highlight={t("titleHighlight")}
        description={t("desc")}
      />
      <Section className="pt-6">
        <Timeline />
      </Section>
    </>
  );
}
