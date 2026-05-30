import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  // Always keep the locale in the pathname (/en, /de) for SEO-friendly URLs.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
