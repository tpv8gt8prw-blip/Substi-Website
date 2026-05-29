import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/changelog/Timeline";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every release of Substi, and what's coming next.",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="Shipping, constantly"
        gradientWords={[1]}
        description="A look at how Substi has evolved — and a peek at what's next."
      />
      <Section className="pt-6">
        <Timeline />
      </Section>
    </>
  );
}
