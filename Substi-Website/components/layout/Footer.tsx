"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiGithub, FiTwitter, FiMessageCircle, FiMail } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { useParallax } from "@/hooks/useParallax";
import { SubstiLogo } from "@/components/ui/SubstiLogo";

const COLUMNS = [
  {
    key: "product",
    links: [
      { key: "features", href: "/#features" },
      { key: "how", href: "/#how" },
      { key: "changelog", href: "/changelog" },
      { key: "docs", href: "/docs" },
    ],
  },
  {
    key: "community",
    links: [
      { key: "discord", href: "/community" },
      { key: "leaderboard", href: "/community#leaderboard" },
      { key: "feedback", href: "/feedback" },
    ],
  },
  {
    key: "legal",
    links: [
      { key: "privacy", href: "/privacy" },
      { key: "terms", href: "/privacy#terms" },
    ],
  },
] as const;

const SOCIALS = [
  { icon: FiGithub, href: "#", label: "GitHub" },
  { icon: FiTwitter, href: "#", label: "Twitter" },
  { icon: FiMessageCircle, href: "/community", label: "Discord" },
  { icon: FiMail, href: "/feedback", label: "Email" },
];

export function Footer() {
  const t = useTranslations("footer");
  const { ref, y } = useParallax(40);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-line bg-bg-subtle"
    >
      <motion.div
        style={{ y }}
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none text-fg/[0.03]"
      >
        Substi
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <SubstiLogo size={36} />
              <span className="font-display text-lg font-extrabold">Substi</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {t("tagline")}
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg-muted backdrop-blur-md hover:text-accent"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </motion.a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.key}>
              <h4 className="text-sm font-semibold text-fg">
                {t(`columns.${col.key}.title`)}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-fg-muted transition-colors hover:text-accent"
                    >
                      <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                      {t(`columns.${col.key}.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-fg-subtle sm:flex-row">
          <span>© {new Date().getFullYear()} Substi · {t("rights")}</span>
          <span>{t("madeWith")}</span>
        </div>
      </div>
    </footer>
  );
}
