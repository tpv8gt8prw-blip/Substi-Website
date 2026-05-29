"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";
import { Accordion } from "@/components/interactive/Accordion";
import { FAQ } from "@/lib/content";
import { cn } from "@/lib/utils";

const DOC_SECTIONS = [
  { id: "getting-started", label: "Getting started" },
  { id: "connecting", label: "Connecting WebUntis" },
  { id: "predictions", label: "Predictions" },
  { id: "casino", label: "Casino mode" },
  { id: "faq", label: "FAQ" },
];

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
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
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DocsContent() {
  const [active, setActive] = useState(DOC_SECTIONS[0].id);

  return (
    <div className="grid gap-12 lg:grid-cols-[230px_1fr]">
      {/* sticky sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-28 space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-subtle">
            Documentation
          </p>
          {DOC_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActive(s.id)}
              className={cn(
                "relative block rounded-lg px-3 py-2 text-sm transition-colors",
                active === s.id
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-fg-muted hover:bg-fg/5 hover:text-fg"
              )}
            >
              {active === s.id && (
                <motion.span
                  layoutId="docs-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-accent-soft"
                />
              )}
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="max-w-2xl space-y-16">
        <ScrollReveal as="section">
          <div id="getting-started" className="scroll-mt-28">
            <p className="text-sm font-semibold text-accent">Step 1</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Getting started</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Substi is available for iPhone on the App Store. Once installed, the
              onboarding flow walks you through connecting your school account.
            </p>
            <CodeBlock lang="text" code={`1. Open the App Store and search "Substi"\n2. Install and open the app\n3. Tap "Connect WebUntis"`} />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="connecting" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">Connecting WebUntis</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              You&apos;ll need three things from your school: the server URL, the
              school name, and your personal login. Substi uses these only to read
              your timetable.
            </p>
            <CodeBlock
              lang="json"
              code={`{\n  "server": "your-school.webuntis.com",\n  "school": "My School",\n  "username": "student.name",\n  "password": "••••••••"\n}`}
            />
            <p className="mt-4 leading-relaxed text-fg-muted">
              Credentials are stored securely on-device using the iOS Keychain.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="predictions" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">Predictions</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Switch the segmented control to <strong>Casino</strong> and tap any
              lesson to place a prediction. Choose an outcome and a wager:
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["Normal", "×1.5 — the lesson runs as scheduled"],
                ["Substituted", "×3 — a different teacher takes over"],
                ["Cancelled", "×3 — the lesson is dropped entirely"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3 text-fg-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="text-fg">{k}</strong> — {v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="casino" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">Casino mode</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Casino mode adds an optional spin wheel and reels for when you&apos;ve
              got a free period. Everything is play-money — there is never any real
              currency involved.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section">
          <div id="faq" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-bold">FAQ</h2>
            <div className="mt-5">
              <Accordion items={FAQ} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
