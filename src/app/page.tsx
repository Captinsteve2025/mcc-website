import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AuthoritySection } from "@/components/AuthoritySection";
import { CharterStyles } from "@/components/CharterStyles";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { Destinations } from "@/components/Destinations";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { EnquiryCTA } from "@/components/EnquiryCTA";
import { Footer } from "@/components/Footer";
import { ServiceSchema, FAQSchema } from "@/components/StructuredData";

// Homepage FAQ for rich snippets
const homepageFAQs = [
  {
    question: "What types of yacht charters do you offer in the Caribbean?",
    answer: "We offer crewed luxury charters, bareboat rentals, and cabin charters across the British Virgin Islands, US Virgin Islands, St. Martin, Bahamas, Antigua, and the Grenadines.",
  },
  {
    question: "Do I need sailing experience for a bareboat charter?",
    answer: "Yes, bareboat charters require proof of sailing competency. We offer ASA and NauticEd certified training programs to help you get qualified.",
  },
  {
    question: "What is included in a crewed yacht charter?",
    answer: "Crewed charters include a professional captain and chef, all meals, beverages, water toys, and use of the yacht. You just show up and enjoy.",
  },
  {
    question: "How far in advance should I book a Caribbean yacht charter?",
    answer: "We recommend booking 6-12 months in advance for peak season (December-April). Last-minute bookings may be available during shoulder seasons.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Page-specific Structured Data */}
      <ServiceSchema
        name="Crewed Yacht Charter"
        description="Luxury crewed yacht charters in the Caribbean with professional captain and chef. All-inclusive sailing vacations in the BVI, USVI, and beyond."
        url="https://mycaribbeancharters.com/#crewed-charters"
        priceRange="$$$$"
      />
      <ServiceSchema
        name="Bareboat Charter"
        description="Rent a yacht and captain it yourself. Bareboat charters available throughout the Caribbean for qualified sailors."
        url="https://mycaribbeancharters.com/#bareboat-charters"
        priceRange="$$$"
      />
      <ServiceSchema
        name="Sailing Training"
        description="ASA and NauticEd certified sailing courses in the British Virgin Islands and St. Martin. Get your bareboat charter master certification."
        url="https://mycaribbeancharters.com/training"
        priceRange="$$$"
      />
      <FAQSchema items={homepageFAQs} />

      <Header />
      <Hero />
      <CharterStyles />
      <AuthoritySection />
      <FeaturedCollections />
      <Destinations />
      <HowItWorks />
      <Testimonials />
      <EnquiryCTA />
      <Footer />
    </main>
  );
}
