"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaApple, FaAndroid } from "react-icons/fa";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Variant = "hero" | "cta";

type AppDownloadButtonsProps = {
  variant?: Variant;
  children?: ReactNode;
  className?: string;
};

const androidLinkBase =
  "btn-interactive group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full px-8 text-base font-semibold tracking-tight select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-[transform,box-shadow] duration-200 ease-out";

export function AppDownloadButtons({
  variant = "hero",
  children,
  className,
}: AppDownloadButtonsProps) {
  const t = useTranslations(variant === "hero" ? "hero" : "cta");
  const reduceMotion = useReducedMotion();

  const androidClasses =
    variant === "cta"
      ? cn(
          androidLinkBase,
          "border border-white/40 bg-white/10 text-white backdrop-blur-md hover:border-white focus-visible:ring-white"
        )
      : cn(
          androidLinkBase,
          "border border-line bg-surface text-fg backdrop-blur-md hover:border-accent/60 focus-visible:ring-accent"
        );

  const hintClasses =
    variant === "cta"
      ? "text-white/75"
      : "text-fg-subtle";

  return (
    <div className={cn("flex w-full max-w-xl flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-4">
        <Button
          size="lg"
          variant={variant === "cta" ? "primary" : "secondary"}
          className={
            variant === "cta"
              ? "bg-white text-slate-900 shadow-xl shadow-black/20 hover:bg-white from-white to-white"
              : undefined
          }
        >
          <FaApple className="h-5 w-5 shrink-0" aria-hidden />
          {t("downloadApp")}
        </Button>

        <motion.a
          href="/substi.apk"
          download="Substi.apk"
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={androidClasses}
        >
          <FaAndroid className="h-5 w-5 shrink-0" aria-hidden />
          {t("downloadAndroid")}
        </motion.a>

        {children}
      </div>

      <p
        className={cn(
          "max-w-md text-xs leading-relaxed sm:text-sm",
          hintClasses
        )}
      >
        {t("androidSideloadHint")}
      </p>
    </div>
  );
}
