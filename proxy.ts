import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 "proxy" convention (formerly middleware). next-intl detects the
// locale (cookie → Accept-Language → default) and rewrites requests to the
// matching `/[locale]` route.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for static assets, API routes and internals.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
