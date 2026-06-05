import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";

type PrivacySubsection = {
  title: string;
  body?: string[];
  steps?: string[];
  where?: string[];
  notStored?: string[];
  visible?: string[];
  notVisible?: string[];
};

type PrivacySection = {
  id: string;
  title: string;
  body?: string[];
  list?: string[];
  steps?: string[];
  doNotStore?: string[];
  doStoreLocal?: string[];
  doStoreServer?: string[];
  subsections?: PrivacySubsection[];
  rights?: string[];
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-fg-muted">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function LabeledList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-fg">{label}</h3>
      <BulletList items={items} />
    </div>
  );
}

type SubsectionLabels = {
  where: string;
  notStored: string;
  visible: string;
  notVisible: string;
};

function SubsectionBlock({
  sub,
  labels,
}: {
  sub: PrivacySubsection;
  labels: SubsectionLabels;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-fg/8 bg-fg/[0.02] p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold">{sub.title}</h3>
      {sub.body?.map((p, i) => (
        <p key={i} className="mt-3 leading-relaxed text-fg-muted">
          {p}
        </p>
      ))}
      {sub.steps && sub.steps.length > 0 && (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-fg-muted">
          {sub.steps.map((step, i) => (
            <li key={i} className="leading-relaxed pl-1">
              {step}
            </li>
          ))}
        </ol>
      )}
      {sub.where && sub.where.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-fg">{labels.where}</p>
          <BulletList items={sub.where} />
        </div>
      )}
      {sub.notStored && sub.notStored.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-fg">{labels.notStored}</p>
          <BulletList items={sub.notStored} />
        </div>
      )}
      {sub.visible && sub.visible.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-fg">{labels.visible}</p>
          <BulletList items={sub.visible} />
        </div>
      )}
      {sub.notVisible && sub.notVisible.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-fg">{labels.notVisible}</p>
          <BulletList items={sub.notVisible} />
        </div>
      )}
    </div>
  );
}

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
  const subsectionLabels: SubsectionLabels = {
    where: t("whereLabel"),
    notStored: t("notStoredLabel"),
    visible: t("visibleLabel"),
    notVisible: t("notVisibleLabel"),
  };

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
                  {s.doNotStore && (
                    <LabeledList label={t("doNotStoreLabel")} items={s.doNotStore} />
                  )}
                  {s.doStoreLocal && (
                    <LabeledList label={t("doStoreLocalLabel")} items={s.doStoreLocal} />
                  )}
                  {s.doStoreServer && (
                    <LabeledList label={t("doStoreServerLabel")} items={s.doStoreServer} />
                  )}
                  {s.steps && s.steps.length > 0 && (
                    <ol className="mt-4 list-decimal space-y-2 pl-5 text-fg-muted">
                      {s.steps.map((step, i) => (
                        <li key={i} className="leading-relaxed pl-1">
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                  {s.list && <BulletList items={s.list} />}
                  {s.subsections?.map((sub, i) => (
                    <SubsectionBlock key={i} sub={sub} labels={subsectionLabels} />
                  ))}
                  {s.rights && <BulletList items={s.rights} />}
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
