import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiZap,
  FiTrendingUp,
  FiBell,
  FiAward,
  FiShield,
} from "react-icons/fi";

/**
 * Non-translatable metadata only. All user-facing strings live in
 * `messages/{locale}.json` and are read via next-intl `useTranslations`.
 * These arrays line up by index with the matching translation arrays.
 */

export const NAV_KEYS = [
  { key: "home", href: "/" },
  { key: "docs", href: "/docs" },
  { key: "changelog", href: "/changelog" },
  { key: "community", href: "/community" },
  { key: "privacy", href: "/privacy" },
  { key: "feedback", href: "/feedback" },
] as const;

/** Feature icons + accent colors (text comes from `features.items[i]`). */
export const FEATURE_META: { icon: IconType; accent: string }[] = [
  { icon: FiCalendar, accent: "#ff7a00" },
  { icon: FiZap, accent: "#3b82f6" },
  { icon: FiTrendingUp, accent: "#06b6d4" },
  { icon: FiBell, accent: "#a855f7" },
];

/** Stat icons + animated numeric values (labels come from `stats.items[i]`). */
export const STAT_META: {
  icon: IconType;
  value: number;
  suffix: string;
  decimals?: number;
}[] = [
  { icon: FiTrendingUp, value: 12000, suffix: "+" },
  { icon: FiZap, value: 98, suffix: "%" },
  { icon: FiAward, value: 4.9, suffix: "", decimals: 1 },
  { icon: FiShield, value: 100, suffix: "%" },
];

export const STEP_COUNT = 4;
export const FAQ_COUNT = 5;
export const TESTIMONIAL_COUNT = 3;
export const CHANGELOG_COUNT = 4;
export const ROADMAP_COUNT = 3;

/** Community stat icons + numeric values (labels from `community.stats[i]`). */
export const COMMUNITY_STAT_META: {
  icon: IconType;
  value: number;
  suffix: string;
}[] = [
  { icon: FiTrendingUp, value: 5400, suffix: "+" },
  { icon: FiZap, value: 12000, suffix: "+" },
  { icon: FiBell, value: 320, suffix: "/day" },
];

export const FEATURED_COUNT = 3;

/** Leaderboard rows — names/coins are data, not copy. */
export const LEADERBOARD_ROWS = [
  { rank: 1, name: "streakwizard", coins: 48210 },
  { rank: 2, name: "lena.m", coins: 41980 },
  { rank: 3, name: "tobi_k", coins: 39740 },
  { rank: 4, name: "freeperiod", coins: 31220 },
  { rank: 5, name: "sara.predicts", coins: 28650 },
];
