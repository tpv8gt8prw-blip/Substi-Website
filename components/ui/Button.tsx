"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
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
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:pointer-events-none";

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
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.045, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(base, variants[variant], sizes[size], glow && "glow-accent", className)}
        {...props}
      >
        {/* sheen on hover */}
        {(variant === "primary" || variant === "secondary") && (
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
