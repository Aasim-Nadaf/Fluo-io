import HeroSection from "@/components/hero-section-10";
import FeaturesFive from "@/components/features-5";
import FeaturesSix from "@/components/features-6";
import Content from "@/components/content-2";
import Stats from "@/components/stats-2";
import Pricing from "@/components/pricing-2";
import Integrations from "@/components/integrations-1";

import Footer from "@/components/footer-2";
import ContentSection from "@/components/content-1";

export default function DuskLandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesFive />
      <Content />
      <Integrations />
      <FeaturesSix />
      <Stats />
      <Pricing />
      <ContentSection />

      <Footer />
    </>
  );
}
