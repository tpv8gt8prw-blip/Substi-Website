"use client";

import { motion } from "framer-motion";
import { staggerContainer, wordReveal, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

// Static, pre-created motion components — never create components in render.
const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
  span: motion.span,
} as const;

type Tag = keyof typeof TAGS;

type AnimatedHeadingProps = {
  text: string;
  className?: string;
  as?: Tag;
  /**
   * A substring of `text` to render with the gradient accent. Locale-safe:
   * we compute which word indices fall inside the highlight, so it works
   * regardless of word order across languages.
   */
  highlight?: string;
  delay?: number;
};

/** Splits a heading into words and reveals them with a staggered 3D flip. */
export function AnimatedHeading({
  text,
  className,
  as = "h2",
  highlight,
  delay = 0,
}: AnimatedHeadingProps) {
  const MotionTag = TAGS[as];
  const words = text.split(" ");

  // Derive the set of word indices that belong to the highlight phrase.
  const gradientWords = new Set<number>();
  if (highlight) {
    const start = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (start >= 0) {
      const end = start + highlight.length;
      let cursor = 0;
      words.forEach((word, i) => {
        const wordStart = cursor;
        const wordEnd = cursor + word.length;
        if (wordEnd > start && wordStart < end) gradientWords.add(i);
        cursor = wordEnd + 1; // +1 for the split space
      });
    }
  }

  return (
    <MotionTag
      variants={staggerContainer(0.08, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn("flex flex-wrap", className)}
      style={{ perspective: 800 }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.28em]">
          <motion.span
            variants={wordReveal}
            className={cn(
              "inline-block",
              gradientWords.has(i) && "text-gradient"
            )}
            style={{ transformOrigin: "bottom" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
