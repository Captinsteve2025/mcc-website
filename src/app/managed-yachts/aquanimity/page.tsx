import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreadcrumbSchema, FAQSchema, ServiceSchema } from "@/components/StructuredData";
import { StickyCharterCTA } from "@/components/yacht/StickyCharterCTA";
import { YachtAbout } from "@/components/yacht/YachtAbout";
import { YachtCrew } from "@/components/yacht/YachtCrew";
import { YachtEnquirySection } from "@/components/yacht/YachtEnquirySection";
import { YachtFAQ } from "@/components/yacht/YachtFAQ";
import { YachtFinalCta } from "@/components/yacht/YachtFinalCta";
import { YachtHero } from "@/components/yacht/YachtHero";
import { YachtNotes } from "@/components/yacht/YachtNotes";
import { YachtPageView } from "@/components/yacht/YachtPageView";
import { YachtPricing } from "@/components/yacht/YachtPricing";
import { YachtWhyMcc } from "@/components/yacht/YachtWhyMcc";
import {
  aquanimity,
  aquanimityAbout,
  aquanimityCrew,
  aquanimityFaqs,
  aquanimityNotes,
  MCC_SITE_URL,
} from "@/lib/managed-yachts";

const pageUrl = `${MCC_SITE_URL}/managed-yachts/aquanimity`;

export default function AquanimityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-20 md:pb-0">
      <Header />
      <YachtPageView eventName="aquanimity_page_view" yachtSlug={aquanimity.slug} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: MCC_SITE_URL },
          { name: aquanimity.name, url: pageUrl },
        ]}
      />
      <ServiceSchema
        name="Aquanimity Dufour 48 Professionally Crewed Charter"
        description="Professionally crewed charter aboard Aquanimity, a 2021 Dufour 48 for up to eight guests in four cabins, cruising the British Virgin Islands."
        url={pageUrl}
        image={`${MCC_SITE_URL}${aquanimity.shareImage}`}
      />
      <FAQSchema items={aquanimityFaqs} />

      <div className="flex-1">
        <YachtHero yacht={aquanimity} />
        <YachtAbout eyebrow={aquanimityAbout.eyebrow} title={aquanimityAbout.title} paragraphs={aquanimityAbout.paragraphs} />
        <YachtCrew members={aquanimityCrew} />
        <YachtNotes notes={aquanimityNotes} />
        <YachtPricing yacht={aquanimity} />
        <YachtWhyMcc yachtName={aquanimity.name} />
        <YachtEnquirySection yacht={aquanimity} />
        <YachtFAQ yachtName={aquanimity.name} faqs={aquanimityFaqs} />
        <YachtFinalCta yacht={aquanimity} />
      </div>

      <Footer />
      <StickyCharterCTA yacht={aquanimity} />
    </div>
  );
}
