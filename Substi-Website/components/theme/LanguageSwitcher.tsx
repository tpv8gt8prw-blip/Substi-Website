"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Compact EN / DE pill toggle with a sliding indicator. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      // Keeps the current path, only swaps the locale segment.
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      className={cn(
        "relative flex h-10 items-center rounded-full border border-line bg-surface p-1 backdrop-blur-md",
        isPending && "opacity-70"
      )}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            onClick={() => switchTo(l)}
            aria-pressed={active}
            className={cn(
              "relative z-10 flex h-8 w-9 items-center justify-center rounded-full text-xs font-bold uppercase transition-colors",
              active ? "text-white" : "text-fg-muted hover:text-fg"
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-accent to-accent-2"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {l}
          </button>
        );
      })}
    </div>
  );
}
