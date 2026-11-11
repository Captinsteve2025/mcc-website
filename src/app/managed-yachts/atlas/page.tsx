import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreadcrumbSchema, FAQSchema, ServiceSchema } from "@/components/StructuredData";
import { StickyCharterCTA } from "@/components/yacht/StickyCharterCTA";
import { YachtDestinations } from "@/components/yacht/YachtDestinations";
import { YachtEnquirySection } from "@/components/yacht/YachtEnquirySection";
import { YachtFAQ } from "@/components/yacht/YachtFAQ";
import { YachtFeatures } from "@/components/yacht/YachtFeatures";
import { YachtFinalCta } from "@/components/yacht/YachtFinalCta";
import { YachtHero } from "@/components/yacht/YachtHero";
import { YachtIntro } from "@/components/yacht/YachtIntro";
import { YachtPageView } from "@/components/yacht/YachtPageView";
import { YachtPricing } from "@/components/yacht/YachtPricing";
import { YachtWhyMcc } from "@/components/yacht/YachtWhyMcc";
import { atlas, atlasFaqs, MCC_SITE_URL } from "@/lib/managed-yachts";

const pageUrl = `${MCC_SITE_URL}/managed-yachts/atlas`;

export default function AtlasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-20 md:pb-0">
      <Header />
      <YachtPageView eventName="atlas_page_view" yachtSlug={atlas.slug} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: MCC_SITE_URL },
          { name: atlas.name, url: pageUrl },
        ]}
      />
      <ServiceSchema
        name="ATLAS Aquila 54 Private Crewed Charter"
        description="Private crewed charter aboard ATLAS, a 2024 Aquila 54 luxury power catamaran cruising the US and British Virgin Islands, subject to operating permissions."
        url={pageUrl}
        image={`${MCC_SITE_URL}${atlas.shareImage}`}
      />
      <FAQSchema items={atlasFaqs} />

      <div className="flex-1">
        <YachtHero yacht={atlas} />
        <YachtIntro />
        <YachtFeatures />
        <YachtDestinations />
        <YachtPricing yacht={atlas} />
        <YachtWhyMcc yachtName={atlas.name} />
        <YachtEnquirySection yacht={atlas} />
        <YachtFAQ yachtName={atlas.name} faqs={atlasFaqs} />
        <YachtFinalCta yacht={atlas} />
      </div>

      <Footer />
      <StickyCharterCTA yacht={atlas} />
    </div>
  );
}
