import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { yachts } from "@/lib/data";
import { ChevronRight, Anchor, Wind, Sun, Calendar, MapPin, Clock, Ship } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Filter yachts available in USVI
const usviYachts = yachts.filter(yacht => yacht.destinationSlug === "us-virgin-islands" || yacht.destinationSlug === "british-virgin-islands").slice(0, 3);

const highlights = [
  {
    icon: Anchor,
    title: "3 Major Islands",
    description: "St. Thomas, St. John, and St. Croix each offer unique experiences and adventures"
  },
  {
    icon: Wind,
    title: "US Territory",
    description: "No passport needed for US citizens, familiar currency and infrastructure"
  },
  {
    icon: Sun,
    title: "National Park Waters",
    description: "Two-thirds of St. John is protected Virgin Islands National Park"
  },
];

const anchorages = [
  {
    name: "Trunk Bay, St. John",
    image: "/images/usvi-snorkeling.jpg",
    description: "World-famous underwater snorkel trail through pristine coral gardens"
  },
  {
    name: "Magens Bay, St. Thomas",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    description: "Heart-shaped bay consistently rated among the world&apos;s most beautiful beaches"
  },
  {
    name: "Cruz Bay, St. John",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    description: "Charming town with excellent restaurants, shops, and easy ferry access"
  },
  {
    name: "Buck Island, St. Croix",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "National monument with an underwater trail and pristine reef ecosystem"
  },
  {
    name: "Charlotte Amalie, St. Thomas",
    image: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=600&q=80",
    description: "Historic harbor town with duty-free shopping and vibrant nightlife"
  },
  {
    name: "Honeymoon Beach, St. John",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
    description: "Secluded paradise accessible by boat or scenic hiking trail"
  },
];

const itinerary = [
  { day: 1, location: "St. Thomas to St. John", distance: "8 nm", description: "Depart Charlotte Amalie, sail to Cruz Bay for lunch and exploring" },
  { day: 2, location: "St. John North Shore", distance: "5 nm", description: "Snorkel Trunk Bay, anchor at Cinnamon Bay for beach time" },
  { day: 3, location: "St. John to Lovango Cay", distance: "4 nm", description: "Private island dining experience, excellent snorkeling" },
  { day: 4, location: "Lovango to Jost Van Dyke (BVI)", distance: "10 nm", description: "Cross to BVI for famous Soggy Dollar Bar experience" },
  { day: 5, location: "Return to St. John", distance: "10 nm", description: "Sail back to Caneel Bay, hike to Honeymoon Beach" },
  { day: 6, location: "St. John to St. Thomas", distance: "6 nm", description: "Morning swim at Magens Bay, afternoon in Charlotte Amalie" },
  { day: 7, location: "St. Thomas", distance: "2 nm", description: "Final morning snorkel, leisurely return to marina" },
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
    question: "Do US citizens need a passport for the USVI?",
    answer: "No, US citizens do not need a passport to visit the US Virgin Islands. A valid government-issued photo ID is sufficient."
  },
  {
    question: "Can I combine USVI and BVI in one charter?",
    answer: "Yes! Many charters include both territories. You will need to clear customs when crossing between USVI and BVI."
  },
  {
    question: "What is the best island for first-time visitors?",
    answer: "St. John is perfect for nature lovers with its National Park, while St. Thomas offers more amenities and nightlife."
  },
  {
    question: "Is the USVI good for snorkeling?",
    answer: "Excellent! Trunk Bay has an underwater snorkel trail, and Buck Island offers pristine reef ecosystems."
  },
  {
    question: "What currency is used in the USVI?",
    answer: "The US Dollar is the official currency, and most US credit cards are widely accepted."
  },
];

export default function USVIDestinationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/usvi-snorkeling.jpg"
            alt="Snorkeling in the US Virgin Islands"
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
              US Virgin Islands
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-display italic mb-8">
              America&apos;s Caribbean Paradise
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-[#e89d79]" />
                <span>3 Major Islands</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5 text-[#e89d79]" />
                <span>No Passport Required</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Ship className="w-5 h-5 text-[#e89d79]" />
                <span>32 Yachts Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?destination=us-virgin-islands"
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
              Why Charter in the US Virgin Islands?
            </h2>
            <p className="text-lg text-[#061625]/70 leading-relaxed">
              The US Virgin Islands combine Caribbean beauty with American convenience. No passport required
              for US citizens, familiar currency and infrastructure, yet completely tropical. With St. Thomas&apos;s
              vibrant harbor, St. John&apos;s protected national park waters, and St. Croix&apos;s rich history,
              the USVI offers diverse experiences in one unforgettable charter.
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
              From world-famous beaches to protected national park waters
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
              Best Boats Available in the USVI
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              Hand-picked yachts perfect for exploring the US Virgin Islands
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
            {usviYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} variant="grid" />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/search?destination=us-virgin-islands"
              className="inline-flex items-center gap-2 bg-[#061625] hover:bg-[#0a2540] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              View All USVI Yachts
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
              Explore the best of the US Virgin Islands with an optional BVI crossing
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
              The USVI offers excellent sailing conditions year-round
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
              USVI Charter FAQs
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
            Plan Your USVI Adventure
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Our Caribbean experts know the USVI intimately. Let us help you plan
            the perfect American Caribbean charter experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?destination=us-virgin-islands"
              className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
            >
              Browse USVI Yachts
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
