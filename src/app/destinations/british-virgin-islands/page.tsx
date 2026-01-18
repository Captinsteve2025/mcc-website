import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { yachts } from "@/lib/data";
import { ChevronRight, Anchor, Wind, Sun, Calendar, MapPin, Clock, Ship } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Filter yachts available in BVI
const bviYachts = yachts.filter(yacht => yacht.destinationSlug === "british-virgin-islands").slice(0, 3);

const highlights = [
  {
    icon: Anchor,
    title: "60+ Islands",
    description: "Explore secluded cays, pristine anchorages, and world-famous beach bars"
  },
  {
    icon: Wind,
    title: "Perfect Trade Winds",
    description: "Consistent 15-20 knot easterly winds for ideal sailing conditions"
  },
  {
    icon: Sun,
    title: "Year-Round Sunshine",
    description: "Average 85°F temperatures with warm, crystal-clear waters"
  },
];

const anchorages = [
  {
    name: "The Baths, Virgin Gorda",
    image: "/images/bvi-the-baths.jpg",
    description: "Iconic boulder formations and hidden grottoes create a magical snorkeling experience"
  },
  {
    name: "Jost Van Dyke",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    description: "Home to the famous Soggy Dollar Bar and pristine White Bay beach"
  },
  {
    name: "Norman Island",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    description: "The inspiration for Treasure Island, featuring caves perfect for snorkeling"
  },
  {
    name: "Anegada",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "A flat coral island with miles of deserted beaches and famous lobster"
  },
  {
    name: "Cooper Island",
    image: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=600&q=80",
    description: "Eco-resort with craft brewery, pristine reef, and sustainable dining"
  },
  {
    name: "Peter Island",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
    description: "Private island paradise with beautiful Deadman's Bay beach"
  },
];

const itinerary = [
  { day: 1, location: "Tortola to Norman Island", distance: "10 nm", description: "Depart Road Town, sail to The Bight for lunch, snorkel The Caves" },
  { day: 2, location: "Norman Island to Peter Island", distance: "5 nm", description: "Morning sail to Deadman's Bay, afternoon relaxation on pristine beach" },
  { day: 3, location: "Peter Island to Cooper Island", distance: "4 nm", description: "Short sail to Cooper Island Beach Club, enjoy craft beer and reef snorkeling" },
  { day: 4, location: "Cooper Island to Virgin Gorda", distance: "8 nm", description: "Sail to The Baths, explore boulder formations, dinner at Spanish Town" },
  { day: 5, location: "Virgin Gorda to Anegada", distance: "15 nm", description: "Adventure sail to the flat coral island, famous lobster dinner" },
  { day: 6, location: "Anegada to Jost Van Dyke", distance: "20 nm", description: "Longest sail, arrive at White Bay, Soggy Dollar Bar painkillers" },
  { day: 7, location: "Jost Van Dyke to Tortola", distance: "12 nm", description: "Final morning swim, leisurely sail back to Road Town" },
];

const seasons = [
  {
    name: "High Season",
    months: "December - April",
    weather: "75-85°F, low humidity, steady trade winds",
    pricing: "Peak rates",
    recommendation: "Book 6-12 months ahead"
  },
  {
    name: "Shoulder Season",
    months: "May - June, November",
    weather: "80-88°F, occasional showers, good winds",
    pricing: "15-25% savings",
    recommendation: "Excellent value with great weather"
  },
  {
    name: "Summer Season",
    months: "July - October",
    weather: "85-90°F, higher humidity, variable winds",
    pricing: "30-40% savings",
    recommendation: "Budget-friendly, watch weather forecasts"
  },
];

const faqs = [
  {
    question: "Do I need a passport to visit the BVI?",
    answer: "Yes, a valid passport is required for all visitors. US citizens do not need a visa for stays under 30 days."
  },
  {
    question: "What is the best yacht type for the BVI?",
    answer: "Catamarans are extremely popular due to their stability, space, and shallow draft for accessing secluded anchorages. However, monohulls offer a more traditional sailing experience."
  },
  {
    question: "Can I bareboat charter in the BVI?",
    answer: "Yes, if you have sailing certifications (ASA 104+ or equivalent) and experience. Otherwise, crewed charters are available with professional captain and chef."
  },
  {
    question: "What should I pack for a BVI charter?",
    answer: "Light, casual clothing, swimwear, reef-safe sunscreen, hat, sunglasses, and a light jacket for evening. Dress code is very relaxed throughout the islands."
  },
  {
    question: "Are provisions included on a crewed charter?",
    answer: "Yes, crewed charters are all-inclusive with gourmet meals, premium beverages, and water toys. Bareboat charterers can arrange provisioning services."
  },
];

export default function BVIDestinationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/bvi-the-baths.jpg"
            alt="The Baths, British Virgin Islands"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061625] via-[#061625]/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 pb-16 relative z-10">
          <div className="max-w-4xl">
            <p className="text-[#e89d79] uppercase tracking-[0.3em] text-sm font-medium mb-4">Caribbean Destination</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal italic text-white mb-4">
              British Virgin Islands
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-display italic mb-8">
              The Sailing Capital of the Caribbean
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-[#e89d79]" />
                <span>60+ Islands & Cays</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5 text-[#e89d79]" />
                <span>Year-Round Sailing</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Ship className="w-5 h-5 text-[#e89d79]" />
                <span>48 Yachts Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?destination=british-virgin-islands"
                className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
              >
                View Available Yachts
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="#enquire"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium transition-all duration-300 border border-white/30"
              >
                Get Expert Advice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-[#f8f7f4]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-normal italic text-[#061625] mb-6">
              Why Charter in the British Virgin Islands?
            </h2>
            <p className="text-lg text-[#061625]/70 leading-relaxed">
              The British Virgin Islands offer the perfect blend of world-class sailing conditions,
              stunning natural beauty, and laid-back Caribbean charm. With over 60 islands scattered
              across calm, protected waters, short sailing distances between anchorages, and reliable
              trade winds, the BVI is consistently rated as one of the best sailing destinations on Earth.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-[#061625] flex items-center justify-center mx-auto mb-5">
                  <highlight.icon className="w-8 h-8 text-[#e89d79]" />
                </div>
                <h3 className="font-display text-xl font-normal italic text-[#061625] mb-3">
                  {highlight.title}
                </h3>
                <p className="text-[#061625]/60 text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Anchorages Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Must-Visit Destinations</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal italic text-[#061625] mb-4">
              Top Anchorages & Experiences
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              From iconic landmarks to hidden gems, discover the best the BVI has to offer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {anchorages.map((spot, index) => (
              <div key={index} className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${spot.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061625]/90 via-[#061625]/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-display text-xl font-normal italic text-white mb-2">
                    {spot.name}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Boats Section */}
      <section className="py-16 md:py-24 bg-[#f8f7f4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Featured Yachts</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal italic text-[#061625] mb-4">
              Best Boats Available in the BVI
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              Hand-picked yachts from our fleet, perfect for exploring the British Virgin Islands
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
            {bviYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} variant="grid" />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/search?destination=british-virgin-islands"
              className="inline-flex items-center gap-2 bg-[#061625] hover:bg-[#0a2540] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              View All BVI Yachts
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sample Itinerary Section */}
      <section className="py-16 md:py-24 bg-[#061625]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Plan Your Journey</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal italic text-white mb-4">
              7-Day Sample Itinerary
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              A classic route through the British Virgin Islands, customizable to your preferences
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {itinerary.map((day, index) => (
              <div key={index} className="flex gap-6 mb-6 last:mb-0">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#e89d79] flex items-center justify-center">
                  <span className="font-display text-xl italic text-white">Day {day.day}</span>
                </div>
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h3 className="font-display text-lg font-normal italic text-white">
                      {day.location}
                    </h3>
                    <span className="text-[#e89d79] text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {day.distance}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Time to Visit Section */}
      <section className="py-16 md:py-24 bg-[#f8f7f4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">When to Go</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal italic text-[#061625] mb-4">
              Best Time to Visit
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              The BVI offers great sailing year-round, with each season bringing its own advantages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {seasons.map((season, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-xl font-normal italic text-[#061625] mb-2">
                  {season.name}
                </h3>
                <p className="text-[#e89d79] font-medium text-sm mb-4">{season.months}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-[#061625]/40 mt-0.5" />
                    <span className="text-[#061625]/70">{season.weather}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#061625]/40">$</span>
                    <span className="text-[#061625]/70">{season.pricing}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#061625]/40 mt-0.5" />
                    <span className="text-[#061625]/70">{season.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Common Questions</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal italic text-[#061625] mb-4">
              BVI Charter FAQs
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#f8f7f4] rounded-xl p-6">
                <h3 className="font-display text-lg font-normal italic text-[#061625] mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#061625]/70 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#061625]" id="enquire">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Ready to Explore?</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal italic text-white mb-6">
            Plan Your BVI Adventure
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Our Caribbean experts have sailed every anchorage and know the BVI intimately.
            Let us help you plan the perfect charter experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?destination=british-virgin-islands"
              className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
            >
              Browse BVI Yachts
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/#enquire"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 border border-white/30"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
