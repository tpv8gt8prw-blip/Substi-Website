"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "span";
};

/** Reveals its children once when scrolled into view. */
export function ScrollReveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
