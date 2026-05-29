import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
};

export function Section({ children, className, id, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn("relative px-5 py-20 sm:px-8 sm:py-28", className)}>
      <div className={cn("mx-auto max-w-7xl", containerClassName)}>{children}</div>
    </section>
  );
}

type EyebrowProps = { children: ReactNode; className?: string };

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-accent-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
