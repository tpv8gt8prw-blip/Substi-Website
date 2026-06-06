"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes injects a blocking <script> to prevent theme flash (FOUC).
 * React 19 warns when that script is rendered during client hydration.
 *
 * Fix: SSR keeps the default executable script (window is undefined).
 * On the client, mark the hydrated script inert so React does not warn.
 * Theme is already applied from the server-rendered HTML.
 */
const themeScriptProps =
  typeof window === "undefined"
    ? undefined
    : ({ type: "application/json" } as const);

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      scriptProps={themeScriptProps}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
