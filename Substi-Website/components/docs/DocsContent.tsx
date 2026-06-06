"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiCopy, FiCheck } from "react-icons/fi";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { Accordion } from "@/components/interactive/Accordion";
import { FAQ_COUNT } from "@/lib/content";
import { cn } from "@/lib/utils";

const NAV_IDS = [
  "gettingStarted",
  "connecting",
  "predictions",
  "casino",
  "faq",
] as const;

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const t = useTranslations("docs");
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="group relative mt-4 overflow-hidden rounded-2xl border border-line bg-[#0d1426] text-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:text-white"
        >
          {copied ? <FiCheck className="h-3.5 w-3.5 text-green-400" /> : <FiCopy className="h-3.5 w-3.5" />}
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

type Outcome = { name: string; desc: string };

export function DocsContent() {
  const t = useTranslations("docs");
  const tFaq = useTranslations("faq");
  const [active, setActive] = useState<string>(NAV_IDS[0]);
  const outcomes = t.raw("predictions.outcomes") as Outcome[];
  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: tFaq(`items.${i}.q`),
    a: tFaq(`items.${i}.a`),
  }));

  return (
    <div className="grid gap-12 lg:grid-cols-[230px_1fr]">
      <aside className="hidden lg:block">
        <nav className="sticky top-28 space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-subtle">
            {t("sidebar")}
          </p>
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              className={cn(
                "relative block rounded-lg px-3 py-2 text-sm transition-colors",
                active === id
                  ? "font-medium text-accent"
                  : "text-fg-muted hover:bg-fg/5 hover:text-fg"
              )}
            >
              {active === id && (
                <motion.span
                  layoutId="docs-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-accent-soft"
                />
              )}
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>
      </aside>

      <div className="max-w-2xl space-y-16">
        <ScrollReveal as="section">
          <div id="gettingStarted" className="scroll-mt-28">
            <p className="text-sm font-semibold text-accent">
              {t("gettingStarted.stepLabel")}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold">
              {t("gettingStarted.heading")}
            </h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              {t("gettingStarted.body")}
            </p>
            <CodeBlock lang="text" code={t("gettingStarted.code")} />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="connecting" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">
              {t("connecting.heading")}
            </h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              {t("connecting.body")}
            </p>
            <CodeBlock
              lang="json"
              code={`{\n  "server": "your-school.webuntis.com",\n  "school": "My School",\n  "username": "student.name",\n  "password": "••••••••"\n}`}
            />
            <p className="mt-4 leading-relaxed text-fg-muted">{t("connecting.note")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="predictions" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">
              {t("predictions.heading")}
            </h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              {t("predictions.intro")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {outcomes.map((o) => (
                <li key={o.name} className="flex gap-3 text-fg-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="text-fg">{o.name}</strong> — {o.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="casino" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">{t("casino.heading")}</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">{t("casino.body")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="faq" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">{t("faqHeading")}</h2>
            <div className="mt-5">
              <Accordion items={faqItems} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
