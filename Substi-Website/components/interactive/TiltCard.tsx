"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  intensity?: number;
};

/** Card that tilts toward the cursor in 3D and shows a cursor-following glow. */
export function TiltCard({ children, className, intensity = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set((0.5 - py) * intensity * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, var(--accent-soft), transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group relative rounded-4xl border border-line bg-bg-elevated/80 backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-accent/10",
        className
      )}
    >
      {/* cursor-following glow */}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 rounded-4xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-4xl opacity-0 ring-1 ring-inset ring-accent/40 transition-opacity duration-300 group-hover:opacity-100" />
      <div style={{ transform: "translateZ(40px)" }} className="relative h-full">
        {children}
      </div>
    </motion.div>
  );
}
