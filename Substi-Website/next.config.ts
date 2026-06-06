import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // We live inside a larger repo that has its own lockfile higher up; pin the
  // Turbopack root to this project so Next stops guessing.
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
