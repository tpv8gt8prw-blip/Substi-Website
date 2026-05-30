import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";

type PrivacySection = {
  id: string;
  title: string;
  body?: string[];
  list?: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("eyebrow"), description: t("desc") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as PrivacySection[];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        highlight={t("titleHighlight")}
        description={t("desc")}
      />

      <Section className="pt-6">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-subtle">
                {t("toc")}
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-fg/5 hover:text-accent"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="max-w-2xl space-y-12">
            {sections.map((s) => (
              <ScrollReveal key={s.id} as="section">
                <div id={s.id} className="scroll-mt-28">
                  <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                  {s.body?.map((p, i) => (
                    <p key={i} className="mt-3 leading-relaxed text-fg-muted">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="mt-4 space-y-2.5">
                      {s.list.map((item, i) => (
                        <li key={i} className="flex gap-3 text-fg-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollReveal>
            ))}
            <p className="text-sm text-fg-subtle">{t("lastUpdated")}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
