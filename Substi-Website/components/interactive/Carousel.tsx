"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Slide = { name: string; role: string; quote: string };

export function Carousel({ slides }: { slides: Slide[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const slide = slides[index];

  const paginate = (d: number) =>
    setState([(index + d + slides.length) % slides.length, d]);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="relative h-64 overflow-hidden rounded-4xl border border-line bg-bg-elevated/70 backdrop-blur-md sm:h-56">
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? 120 : -120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? -120 : 120 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-lg font-bold text-white"
            >
              {slide.name.charAt(0)}
            </motion.span>
            <p className="mt-4 text-lg font-medium leading-relaxed text-fg">
              &ldquo;{slide.quote}&rdquo;
            </p>
            <p className="mt-3 text-sm text-fg-muted">
              {slide.name} · {slide.role}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          aria-label="Previous"
          onClick={() => paginate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setState([i, i > index ? 1 : -1])}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? "var(--accent)" : "var(--surface-border)",
              }}
            />
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={() => paginate(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
