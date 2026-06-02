"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  glow?: boolean;
};

const base =
  "btn-interactive group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/25",
  secondary:
    "text-white bg-gradient-to-br from-secondary to-secondary-2 shadow-lg shadow-secondary/25",
  outline:
    "text-fg border border-line bg-surface backdrop-blur-md hover:border-accent/60",
  ghost: "text-fg-muted hover:text-fg hover:bg-fg/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", glow = false, className, children, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const hasSheen = variant === "primary" || variant === "secondary";

    return (
      <motion.button
        ref={ref}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          base,
          !reduceMotion && "transition-[transform,box-shadow] duration-200 ease-out",
          variants[variant],
          sizes[size],
          glow && "glow-accent",
          className
        )}
        {...props}
      >
        {hasSheen && (
          <span
            aria-hidden
            className="btn-sheen pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
