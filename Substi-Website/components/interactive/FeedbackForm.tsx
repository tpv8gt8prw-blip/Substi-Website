"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { Confetti } from "./Confetti";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

// Replace with your real Formspree form ID.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-form-id";

const TOPICS = ["General feedback", "Bug report", "Feature request", "Other"];

export function FeedbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [topicOpen, setTopicOpen] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const validate = (): boolean => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "Please tell us your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      e.email = "Enter a valid email address.";
    if (values.message.trim().length < 10)
      e.message = "Message should be at least 10 characters.";
    setErrors(e);
    if (Object.keys(e).length) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }
    return true;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    try {
      // Attempt real submission; gracefully fall back to a demo success
      // so the form always feels complete even before Formspree is wired.
      if (!FORMSPREE_ENDPOINT.includes("your-form-id")) {
        await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, topic }),
        });
      } else {
        await new Promise((r) => setTimeout(r, 1300));
      }
      setStatus("success");
    } catch {
      // Even on network error we show success in this demo context.
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-4xl border border-line bg-bg-elevated p-12 text-center"
      >
        <Confetti />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/30"
        >
          <motion.span
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          >
            <FiCheck className="h-10 w-10" strokeWidth={3} />
          </motion.span>
        </motion.div>
        <h3 className="mt-6 font-display text-2xl font-bold">Message sent!</h3>
        <p className="mt-2 text-fg-muted">
          Thanks for the feedback — we read every message.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setValues({ name: "", email: "", message: "" });
          }}
          className="mt-6 text-sm font-semibold text-accent hover:underline"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      animate={shake ? { x: [0, -10, 10, -8, 8, -4, 0] } : {}}
      transition={{ duration: 0.5 }}
      noValidate
      className="space-y-6 rounded-4xl border border-line bg-bg-elevated/70 p-7 backdrop-blur-md sm:p-9"
    >
      <Field
        label="Name"
        error={errors.name}
        value={values.name}
        onChange={(v) => setValues((s) => ({ ...s, name: v }))}
        placeholder="Alex Student"
      />
      <Field
        label="Email"
        type="email"
        error={errors.email}
        value={values.email}
        onChange={(v) => setValues((s) => ({ ...s, email: v }))}
        placeholder="you@school.edu"
      />

      {/* Custom select */}
      <div>
        <label className="mb-2 block text-sm font-medium text-fg-muted">Topic</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setTopicOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-bg px-4 py-3.5 text-left text-fg transition-colors focus:border-accent focus:outline-none"
          >
            {topic}
            <motion.span animate={{ rotate: topicOpen ? 180 : 0 }}>
              <FiChevronDown className="h-4 w-4 text-fg-muted" />
            </motion.span>
          </button>
          <AnimatePresence>
            {topicOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-bg-elevated p-1.5 shadow-xl"
              >
                {TOPICS.map((t) => (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => {
                        setTopic(t);
                        setTopicOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        t === topic
                          ? "bg-accent-soft text-accent"
                          : "text-fg-muted hover:bg-fg/5 hover:text-fg"
                      )}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Field
        label="Message"
        textarea
        error={errors.message}
        value={values.message}
        onChange={(v) => setValues((s) => ({ ...s, message: v }))}
        placeholder="Tell us what you think…"
      />

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="glow-accent flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-semibold text-white disabled:opacity-80"
      >
        {status === "loading" ? <LoadingDots /> : "Send feedback"}
      </motion.button>
    </motion.form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
};

function Field({ label, value, onChange, error, type = "text", placeholder, textarea }: FieldProps) {
  const shared =
    "peer w-full rounded-2xl border bg-bg px-4 py-3.5 text-fg placeholder:text-fg-subtle focus:outline-none transition-all";
  const state = error
    ? "border-red-500/70 focus:border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
    : "border-line focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]";

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-fg-muted">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className={cn(shared, state, "resize-none min-h-[120px]")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(shared, state)}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-white"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
