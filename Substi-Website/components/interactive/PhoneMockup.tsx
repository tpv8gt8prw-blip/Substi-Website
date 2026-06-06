"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiCalendar, FiZap, FiBell, FiUser } from "react-icons/fi";
import { SUBSTI_ICON_SRC } from "@/components/ui/SubstiLogo";

const LESSONS = [
  { time: "08:00", subjectKey: "math", room: "A2.14", tone: "normal" },
  { time: "08:55", subjectKey: "physics", room: "Lab 3", tone: "sub" },
  { time: "09:50", subjectKey: "english", room: "B1.02", tone: "normal" },
  { time: "10:45", subjectKey: "history", room: "—", tone: "cancel" },
  { time: "11:40", subjectKey: "cs", room: "C0.07", tone: "normal" },
] as const;

const toneStyles: Record<string, string> = {
  normal: "border-l-[3px] border-l-blue-500",
  sub: "border-l-[3px] border-l-accent",
  cancel: "border-l-[3px] border-l-red-500 opacity-60",
};

const toneColor: Record<string, string> = {
  normal: "text-slate-400",
  sub: "text-accent",
  cancel: "text-red-500",
};

/** A self-contained, animated mock of the Substi iOS app. */
export function PhoneMockup() {
  const t = useTranslations("phone");
  const badgeLabel = (tone: string, room: string) => {
    if (tone === "sub") return t("substituted");
    if (tone === "cancel") return t("cancelled");
    return room;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -12 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      style={{ perspective: 1200 }}
      className="relative mx-auto w-[280px] sm:w-[320px]"
    >
      {/* glow behind */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative rounded-[2.8rem] border border-slate-200/60 bg-slate-900 p-3 shadow-2xl shadow-black/40 dark:border-white/10">
        {/* screen */}
        <div className="relative overflow-hidden rounded-[2.2rem] bg-white dark:bg-[#0d1426]">
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900" />

          {/* status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-slate-900 dark:text-white">
            <span>9:41</span>
            <span className="flex items-center gap-1 opacity-80">
              <Image
                src={SUBSTI_ICON_SRC}
                alt=""
                width={14}
                height={14}
                className="rounded-[22%]"
                aria-hidden
              />
              Substi
            </span>
          </div>

          {/* header */}
          <div className="px-5 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-400">{t("weekday")}</p>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t("today")}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5">
                <span className="text-sm font-bold text-accent">2,480</span>
                <span className="text-[10px] text-accent/70">{t("coins")}</span>
              </div>
            </div>
          </div>

          {/* lessons */}
          <div className="space-y-2 px-4 py-4">
            {LESSONS.map((l, i) => (
              <motion.div
                key={l.subjectKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12, ease: "easeOut" }}
                className={`flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/5 ${toneStyles[l.tone]}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-400">{l.time}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t(`subjects.${l.subjectKey}`)}
                  </span>
                </div>
                <span className={`text-[10px] font-medium ${toneColor[l.tone]}`}>
                  {badgeLabel(l.tone, l.room)}
                </span>
              </motion.div>
            ))}
          </div>

          {/* floating dock */}
          <div className="px-4 pb-5 pt-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mx-auto flex w-[88%] items-center justify-around rounded-full border border-slate-200/70 bg-white/80 p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
            >
              {[FiCalendar, FiZap, FiBell, FiUser].map((Icon, i) => (
                <div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    i === 0 ? "bg-accent text-white" : "text-slate-400"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* floating prediction toast */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
        className="absolute -right-6 top-28 hidden rounded-2xl border border-line bg-bg-elevated px-3.5 py-2.5 shadow-xl sm:block"
      >
        <p className="text-[11px] font-semibold text-fg">{t("predictionWon")}</p>
        <p className="text-[10px] text-accent">{t("coinsWon")}</p>
      </motion.div>
    </motion.div>
  );
}
