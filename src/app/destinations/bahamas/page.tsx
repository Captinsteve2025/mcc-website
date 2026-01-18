import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { yachts } from "@/lib/data";
import { ChevronRight, Anchor, Wind, Sun, Calendar, MapPin, Clock, Ship } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Filter yachts (use available yachts as placeholder)
const bahamasYachts = yachts.slice(0, 3);

const highlights = [
  {
    icon: Anchor,
    title: "700 Islands & Cays",
    description: "Endless exploration from Nassau to the remote Out Islands"
  },
  {
    icon: Wind,
    title: "Crystal Clear Waters",
    description: "Some of the clearest water on Earth with visibility up to 200 feet"
  },
  {
    icon: Sun,
    title: "Swimming Pigs & More",
    description: "Unique wildlife encounters including the famous swimming pigs of Exuma"
  },
];

const anchorages = [
  {
    name: "Exuma Cays",
    image: "/images/bahamas-exumas.jpg",
    description: "365 islands with the famous swimming pigs, nurse sharks, and iguanas"
  },
  {
    name: "Nassau & Paradise Island",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    description: "Vibrant capital with Atlantis resort, dining, and nightlife"
  },
  {
    name: "Harbour Island",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    description: "Famous pink sand beaches and charming colonial village"
  },
  {
    name: "Staniel Cay",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "Home of the swimming pigs and Thunderball Grotto"
  },
  {
    name: "Eleuthera",
    image: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=600&q=80",
    description: "Pristine beaches, pineapple farms, and the Glass Window Bridge"
  },
  {
    name: "Abacos",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
    description: "Colonial charm, excellent sailing, and protected Sea of Abaco"
  },
];

const itinerary = [
  { day: 1, location: "Nassau to Allan's Cay", distance: "35 nm", description: "Depart Nassau, sail to Allan's Cay to meet the famous rock iguanas" },
  { day: 2, location: "Allan's Cay to Staniel Cay", distance: "25 nm", description: "Swim with the pigs at Big Major Cay, explore Thunderball Grotto" },
  { day: 3, location: "Staniel Cay Exploration", distance: "5 nm", description: "Compass Cay nurse sharks, snorkeling, Staniel Cay Yacht Club" },
  { day: 4, location: "Staniel Cay to Warderick Wells", distance: "15 nm", description: "Exuma Cays Land & Sea Park headquarters, incredible snorkeling" },
  { day: 5, location: "Warderick Wells to Shroud Cay", distance: "10 nm", description: "Mangrove creek exploration by dinghy, secluded beaches" },
  { day: 6, location: "Shroud Cay to Highbourne Cay", distance: "12 nm", description: "Full-service marina, beach time, last night in the Exumas" },
  { day: 7, location: "Highbourne Cay to Nassau", distance: "35 nm", description: "Final sail back to Nassau with memories of paradise" },
];

const seasons = [
  {
    name: "High Season",
    months: "December - April",
    weather: "70-80°F, low humidity, excellent visibility",
    pricing: "Peak rates",
    recommendation: "Best weather, book 6-12 months ahead"
  },
  {
    name: "Shoulder Season",
    months: "May - June, November",
    weather: "78-85°F, occasional rain, great conditions",
    pricing: "15-25% savings",
    recommendation: "Excellent value, fewer crowds"
  },
  {
    name: "Summer/Fall Season",
    months: "July - October",
    weather: "80-88°F, afternoon storms possible",
    pricing: "30-40% savings",
    recommendation: "Hurricane season, monitor weather"
  },
];

const faqs = [
  {
    question: "Where are the swimming pigs?",
    answer: "The famous swimming pigs are at Big Major Cay (also called Pig Beach) near Staniel Cay in the Exumas. They're best visited in the morning before crowds arrive."
  },
  {
    question: "Do I need a passport for the Bahamas?",
    answer: "Yes, all visitors need a valid passport. US citizens can stay up to 90 days without a visa."
  },
  {
    question: "What is the best area to charter in the Bahamas?",
    answer: "The Exumas are most popular for their crystal-clear waters and unique wildlife. The Abacos offer excellent protected sailing, and Eleuthera has stunning pink sand beaches."
  },
  {
    question: "Is the Bahamas good for snorkeling?",
    answer: "Exceptional! Thunderball Grotto, the Exuma Cays Land & Sea Park, and countless reefs offer world-class snorkeling with incredible visibility."
  },
  {
    question: "How long does it take to sail from Nassau to the Exumas?",
    answer: "It's about 35-40 nautical miles from Nassau to the northern Exumas, typically a 6-8 hour sail depending on conditions."
  },
];

export default function BahamasDestinationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/bahamas-exumas.jpg"
            alt="Aerial view of the Exuma Cays, Bahamas"
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
              The Bahamas
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-display italic mb-8">
              Island Hopping Paradise - 700 Islands to Explore
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-[#e89d79]" />
                <span>700 Islands & Cays</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5 text-[#e89d79]" />
                <span>Year-Round Destination</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Ship className="w-5 h-5 text-[#e89d79]" />
                <span>36 Yachts Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?destination=bahamas"
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
              Why Charter in the Bahamas?
            </h2>
            <p className="text-lg text-[#061625]/70 leading-relaxed">
              The Bahamas offers an unparalleled island-hopping experience across 700 islands and cays.
              From the famous swimming pigs of Exuma to the pink sand beaches of Harbour Island,
              crystal-clear waters with visibility up to 200 feet, and the protected wilderness of
              the Exuma Cays Land & Sea Park, the Bahamas delivers adventure and beauty at every anchorage.
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
              From the Exumas to the Abacos, discover Bahamian paradise
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
              Best Boats Available in the Bahamas
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              Hand-picked yachts perfect for Bahamian island hopping
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
            {bahamasYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} variant="grid" />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/search?destination=bahamas"
              className="inline-flex items-center gap-2 bg-[#061625] hover:bg-[#0a2540] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              View All Bahamas Yachts
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
              7-Day Exumas Itinerary
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The classic Exuma Cays experience from Nassau to the swimming pigs and back
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
              The Bahamas offers great conditions most of the year
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
              Bahamas Charter FAQs
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
            Plan Your Bahamas Adventure
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Swim with pigs, explore 700 islands, and discover the clearest water on Earth.
            Let our experts plan your perfect Bahamian escape.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?destination=bahamas"
              className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
            >
              Browse Bahamas Yachts
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
