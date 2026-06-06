import type { ReactNode } from "react";

// The real <html>/<body> shell lives in `app/[locale]/layout.tsx` so the
// `lang` attribute and providers can depend on the active locale. This root
// layout is an intentional pass-through required by the App Router.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
