import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/interactive/ScrollProgress";
import { BackToTop } from "@/components/interactive/BackToTop";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Substi — Your schedule, gamified",
    template: "%s · Substi",
  },
  description:
    "Substi turns your school timetable into a game. Track classes, predict substitutions, and climb the leaderboard — beautifully designed for iOS.",
  keywords: [
    "Substi",
    "school schedule",
    "timetable",
    "WebUntis",
    "prediction game",
    "iOS app",
  ],
  openGraph: {
    title: "Substi — Your schedule, gamified",
    description:
      "Track classes, predict substitutions, and climb the leaderboard.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} min-h-screen bg-bg text-fg antialiased`}
      >
        <ThemeProvider>
          <ScrollProgress />
          <Header />
          <main className="relative">{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
