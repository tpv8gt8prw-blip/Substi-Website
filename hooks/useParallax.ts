"use client";

import { useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useRef, type RefObject } from "react";

/**
 * Returns a spring-smoothed MotionValue that maps the element's scroll
 * progress (0 → 1 as it passes through the viewport) to a vertical offset.
 *
 * @param distance positive = moves up as you scroll (foreground feel),
 *                 negative = moves down (background feel)
 */
export function useParallax(distance = 80): {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  return { ref, y };
}
