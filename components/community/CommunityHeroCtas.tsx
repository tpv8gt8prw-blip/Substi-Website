"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { FaDiscord } from "react-icons/fa";
import { PATREON_URL } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Official Patreon mark (circle + vertical bar). */
function PatreonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("h-5 w-5 shrink-0", className)}
      fill="currentColor"
    >
      <path d="M14.82 2.41c-4.46 0-8.09 3.63-8.09 8.09 0 4.45 3.63 8.07 8.09 8.07 4.44 0 8.06-3.62 8.06-8.07 0-4.46-3.62-8.09-8.06-8.09zM1.1 21.59h3.96V2.41H1.1v19.18z" />
    </svg>
  );
}

const ctaBase =
  "btn-interactive group relative inline-flex h-12 min-h-12 w-full max-w-[min(100%,20rem)] items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[15px] font-semibold tracking-tight text-white select-none transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:h-14 sm:max-w-none sm:px-8 sm:text-base";

type CommunityCtaProps = {
  className?: string;
  children: ReactNode;
} & (
  | { as: "button"; type?: "button" }
  | { as: "a"; href: string; target?: string; rel?: string }
);

function CommunityCta(props: CommunityCtaProps) {
  const { className, children, as } = props;
  const inner = (
    <>
      <span
        aria-hidden
        className="btn-sheen pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2.5">
        {children}
      </span>
    </>
  );

  if (as === "a") {
    const { href, target, rel } = props;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={cn(ctaBase, className)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={props.type ?? "button"} className={cn(ctaBase, className)}>
      {inner}
    </button>
  );
}

export function CommunityHeroCtas() {
  const t = useTranslations("community");
  const tp = useTranslations("community.patreon");

  return (
    <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col items-center px-1 sm:px-0">
      <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <CommunityCta
          as="button"
          className="shrink-0 bg-[#5865F2] shadow-lg shadow-[#5865F2]/30 focus-visible:ring-[#5865F2] sm:w-auto"
        >
          <FaDiscord className="h-5 w-5 shrink-0" aria-hidden />
          {t("joinDiscord")}
        </CommunityCta>
        <CommunityCta
          as="a"
          href={PATREON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-gradient-to-br from-[#FF424D] to-[#E85B46] shadow-lg shadow-[#FF424D]/30 focus-visible:ring-[#FF424D] sm:w-auto"
        >
          <PatreonIcon />
          {tp("cta")}
        </CommunityCta>
      </div>
      <p className="mt-6 max-w-xl px-2 text-center text-sm leading-relaxed text-fg-muted sm:px-0 sm:text-[15px]">
        {tp("description")}
      </p>
    </div>
  );
}
