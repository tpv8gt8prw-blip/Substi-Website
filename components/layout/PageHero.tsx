"use client";

import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Section";
import { AnimatedHeading } from "@/components/interactive/AnimatedHeading";
import { ScrollReveal } from "@/components/interactive/ScrollReveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-36 sm:px-8 sm:pt-44">
      {/* parallax-ish floating background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="animate-aurora absolute -left-40 -top-20 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />
        <div className="animate-aurora absolute -right-20 top-0 h-80 w-80 rounded-full bg-secondary/15 blur-[120px] [animation-delay:-10s]" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </ScrollReveal>
        <AnimatedHeading
          as="h1"
          text={title}
          highlight={highlight}
          className="mt-5 justify-center text-center font-display text-4xl font-extrabold tracking-tight sm:text-6xl"
        />
        {description && (
          <ScrollReveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-muted">
              {description}
            </p>
          </ScrollReveal>
        )}
        {children}
      </div>
    </section>
  );
}
