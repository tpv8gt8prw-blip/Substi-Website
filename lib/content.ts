import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiZap,
  FiTrendingUp,
  FiBell,
  FiAward,
  FiShield,
} from "react-icons/fi";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  { label: "Community", href: "/community" },
  { label: "Privacy", href: "/privacy" },
  { label: "Feedback", href: "/feedback" },
] as const;

export type Feature = {
  icon: IconType;
  title: string;
  short: string;
  long: string;
  accent: string;
};

export const FEATURES: Feature[] = [
  {
    icon: FiCalendar,
    title: "Live Timetable",
    short: "Your whole week, synced from WebUntis in real time.",
    long: "Substi pulls your schedule straight from WebUntis and keeps it in sync. Day and week views, color-coded subjects, room changes, and a clean glassy interface designed to feel native on iOS. Swipe between days, jump to today, and never miss a room change again.",
    accent: "#ff7a00",
  },
  {
    icon: FiZap,
    title: "Substitution Predictions",
    short: "Bet coins on whether a lesson gets cancelled or moved.",
    long: "Turn the daily uncertainty of school into a game. Predict whether a lesson will be normal, substituted, or cancelled and wager virtual coins. Correct calls pay out with multipliers up to ×3 — building a streak feels incredible.",
    accent: "#3b82f6",
  },
  {
    icon: FiTrendingUp,
    title: "Casino Mode",
    short: "Spin wheels, climb multipliers, chase the jackpot.",
    long: "An optional casino layer with a spin wheel, animated reels, and risk-tuned payouts. Everything is play-money and purely for fun — a delightful little dopamine loop wrapped in liquid-glass visuals.",
    accent: "#06b6d4",
  },
  {
    icon: FiBell,
    title: "Smart Notifications",
    short: "Get pinged the moment your schedule changes.",
    long: "Substi watches your timetable and notifies you the instant a substitution, cancellation, or room change lands — so you find out before you walk to the wrong room.",
    accent: "#a855f7",
  },
];

export const STATS = [
  { value: 12000, suffix: "+", label: "Predictions placed", icon: FiTrendingUp },
  { value: 98, suffix: "%", label: "Sync accuracy", icon: FiZap },
  { value: 4, suffix: ".9", label: "App Store rating", icon: FiAward },
  { value: 100, suffix: "%", label: "Privacy-first", icon: FiShield },
];

export const STEPS = [
  {
    n: 1,
    title: "Connect WebUntis",
    body: "Sign in with your school server and credentials. Substi reads your timetable — nothing else.",
  },
  {
    n: 2,
    title: "See your week",
    body: "Your schedule appears instantly in a beautiful day or week view, color-coded and always current.",
  },
  {
    n: 3,
    title: "Make predictions",
    body: "Spot a teacher who's often out? Wager coins on whether the lesson gets substituted.",
  },
  {
    n: 4,
    title: "Climb the board",
    body: "Win coins, build streaks, and rise up the global leaderboard against classmates.",
  },
];

export const FAQ = [
  {
    q: "Is Substi free?",
    a: "Yes. Substi is completely free to download and use. There are no ads and no real-money transactions — all coins are virtual and just for fun.",
  },
  {
    q: "Which schools are supported?",
    a: "Any school that uses WebUntis. You simply enter your school's server and your normal WebUntis login.",
  },
  {
    q: "Is my data safe?",
    a: "Your credentials are used only to fetch your timetable and are stored securely on your device. We never sell or share your data. See the Privacy page for full details.",
  },
  {
    q: "Is real money involved in the predictions?",
    a: "Never. Every coin in Substi is virtual. Casino mode and predictions are purely for entertainment and bragging rights.",
  },
  {
    q: "Does it work offline?",
    a: "Your last-synced timetable is cached, so you can view your schedule offline. Predictions and the leaderboard require a connection.",
  },
];

export const CHANGELOG = [
  {
    version: "4.0",
    date: "May 2026",
    tag: "Latest",
    title: "Liquid Glass redesign",
    points: [
      "All-new iOS 26 Liquid Glass dock with real-time refraction",
      "Swipeable Day/Week and Plan/Casino segmented controls",
      "Classic (opaque) theme option for non-glass devices",
      "Smoother 60fps animations across the board",
    ],
  },
  {
    version: "3.2",
    date: "Mar 2026",
    title: "Casino mode overhaul",
    points: [
      "Redesigned spin wheel with physics-based easing",
      "New payout multipliers and streak bonuses",
      "Fixed leaderboard flicker on refresh",
    ],
  },
  {
    version: "3.0",
    date: "Jan 2026",
    title: "Predictions & leaderboard",
    points: [
      "Introduced substitution predictions with coin wagering",
      "Global leaderboard with weekly resets",
      "Cloud sync across devices",
    ],
  },
  {
    version: "2.0",
    date: "Sep 2025",
    title: "Week view & themes",
    points: [
      "Added full week grid view",
      "Seven accent color themes",
      "Dark mode polish",
    ],
  },
];

export const ROADMAP = [
  { title: "Android beta", body: "Bringing Substi to Android via a React Native build." },
  { title: "Friend leagues", body: "Private leaderboards you can share with your class." },
  { title: "Widgets", body: "Home-screen and lock-screen widgets for your next lesson." },
];

export const TESTIMONIALS = [
  {
    quote:
      "I used to walk to the wrong room twice a week. Now Substi pings me before I even leave. The predictions are weirdly addictive.",
    name: "Lena M.",
    role: "11th grade",
    rating: 5,
  },
  {
    quote:
      "The Liquid Glass dock genuinely looks better than half the apps Apple ships. Buttery smooth on my iPhone.",
    name: "Tobias K.",
    role: "Student dev",
    rating: 5,
  },
  {
    quote:
      "Casino mode during a free period is dangerous. My whole class is on the leaderboard now.",
    name: "Sara P.",
    role: "12th grade",
    rating: 5,
  },
];
