import { CTASection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { Page } from "@/components/layouts/page";

export default function HomePage() {
  return (
    <Page className="p-0">
      <HeroSection />
      <ShowcaseSection />
      <FeaturesSection />
      <CTASection />
    </Page>
  );
}
