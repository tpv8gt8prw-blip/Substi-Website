"use client";

import { motion } from "framer-motion";

const COLORS = ["#ff7a00", "#ff9d26", "#3b82f6", "#06b6d4", "#a855f7", "#30d158"];

// Deterministic pseudo-random in [0,1) — pure, SSR-safe, and lint-clean.
const rand = (seed: number) => {
  const x = Math.sin(seed * 99.71) * 43758.5453;
  return x - Math.floor(x);
};

/** Lightweight CSS/Framer confetti burst — no external dependency. */
export function Confetti({ count = 28 }: { count?: number }) {
  const pieces = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: (rand(i + 1) - 0.5) * 320,
    y: -(rand(i + 2) * 240 + 120),
    rotate: rand(i + 3) * 540,
    color: COLORS[i % COLORS.length],
    delay: rand(i + 4) * 0.15,
    size: 6 + rand(i + 5) * 6,
  }));

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: [0, p.y, p.y + 260],
            rotate: p.rotate,
            scale: [1, 1, 0.6],
          }}
          transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
          style={{
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            borderRadius: 2,
          }}
          className="absolute block"
        />
      ))}
    </div>
  );
}
