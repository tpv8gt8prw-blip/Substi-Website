"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiCheck } from "react-icons/fi";
import { fromLeft, fromRight, fadeUp, viewportOnce } from "@/lib/animations";

type Entry = {
  version: string;
  date: string;
  title: string;
  points: string[];
};

type Roadmap = { title: string; body: string };

export function Timeline() {
  const t = useTranslations("changelog");
  const entries = t.raw("entries") as Entry[];
  const roadmap = t.raw("roadmap") as Roadmap[];

  return (
    <div className="relative mx-auto max-w-4xl">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute left-4 top-2 h-full w-0.5 origin-top bg-gradient-to-b from-accent via-secondary to-secondary-2 sm:left-1/2 sm:-translate-x-1/2"
      />

      <ul className="space-y-10">
        {entries.map((entry, i) => {
          const left = i % 2 === 0;
          return (
            <motion.li
              key={entry.version}
              variants={left ? fromLeft : fromRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                left ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
              }`}
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
                className={`absolute top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/30 left-0 sm:left-auto ${
                  left ? "sm:-right-4" : "sm:-left-4"
                }`}
              >
                <span className="text-xs font-bold">v{entry.version.split(".")[0]}</span>
              </motion.span>

              <div className="rounded-3xl border border-line bg-bg-elevated/70 p-6 backdrop-blur-md">
                <div className={`flex items-center gap-2 ${left ? "sm:justify-end" : ""}`}>
                  <span className="font-display text-xl font-bold">v{entry.version}</span>
                  {i === 0 && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                      {t("latest")}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-fg-subtle">{entry.date}</p>
                <h3 className="mt-2 font-semibold text-fg">{entry.title}</h3>
                <ul className={`mt-3 space-y-2 ${left ? "sm:ml-auto" : ""}`}>
                  {entry.points.map((p) => (
                    <li
                      key={p}
                      className={`flex gap-2 text-sm text-fg-muted ${
                        left ? "sm:flex-row-reverse sm:text-right" : ""
                      }`}
                    >
                      <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-16"
      >
        <h2 className="text-center font-display text-2xl font-bold">
          {t("roadmapTitle")}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {roadmap.map((r) => (
            <div
              key={r.title}
              className="rounded-3xl border border-dashed border-line bg-bg-elevated/40 p-6"
            >
              <h3 className="font-semibold text-fg">{r.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
