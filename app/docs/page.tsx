import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { DocsContent } from "@/components/docs/DocsContent";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Everything you need to set up and master Substi.",
};

export default function DocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Docs"
        title="Set up Substi in minutes"
        gradientWords={[3]}
        description="From connecting WebUntis to mastering predictions — here's everything."
      />
      <Section className="pt-6">
        <DocsContent />
      </Section>
    </>
  );
}
