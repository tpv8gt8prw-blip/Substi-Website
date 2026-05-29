"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { staggerContainer, viewportOnce } from "@/lib/animations";

const ROWS = [
  { rank: 1, name: "streakwizard", coins: 48210 },
  { rank: 2, name: "lena.m", coins: 41980 },
  { rank: 3, name: "tobi_k", coins: 39740 },
  { rank: 4, name: "freeperiod", coins: 31220 },
  { rank: 5, name: "sara.predicts", coins: 28650 },
];

const medal = ["#ffd60a", "#cbd5e1", "#d97706"];

export function Leaderboard() {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="overflow-hidden rounded-4xl border border-line bg-bg-elevated/70 backdrop-blur-md"
    >
      {ROWS.map((row) => (
        <motion.div
          key={row.rank}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ backgroundColor: "var(--accent-soft)" }}
          className="flex items-center gap-4 border-b border-line px-6 py-4 last:border-0"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: row.rank <= 3 ? medal[row.rank - 1] : "var(--surface-border)",
              color: row.rank <= 3 ? "#0b1220" : "var(--fg-muted)",
            }}
          >
            {row.rank}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-accent-2/80 text-sm font-bold text-white">
            {row.name.charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 font-medium">@{row.name}</span>
          <span className="font-display font-bold text-accent">
            <AnimatedCounter value={row.coins} suffix=" 🪙" />
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
