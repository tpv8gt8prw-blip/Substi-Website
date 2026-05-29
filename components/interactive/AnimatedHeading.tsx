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
  /** indices of words to wrap in the gradient accent */
  gradientWords?: number[];
  delay?: number;
};

/** Splits a heading into words and reveals them with a staggered 3D flip. */
export function AnimatedHeading({
  text,
  className,
  as = "h2",
  gradientWords = [],
  delay = 0,
}: AnimatedHeadingProps) {
  const MotionTag = TAGS[as];
  const words = text.split(" ");

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
              gradientWords.includes(i) && "text-gradient"
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
