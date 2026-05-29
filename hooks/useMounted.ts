"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True only after first client render — guards against hydration mismatches. */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
