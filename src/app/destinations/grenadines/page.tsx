import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { yachts } from "@/lib/data";
import { ChevronRight, Anchor, Wind, Sun, Calendar, MapPin, Clock, Ship } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Filter yachts (use available yachts as placeholder)
const grenadinesYachts = yachts.slice(0, 3);

const highlights = [
  {
    icon: Anchor,
    title: "32 Unspoiled Islands",
    description: "A chain of pristine islands stretching from St. Vincent to Grenada"
  },
  {
    icon: Wind,
    title: "Off the Beaten Path",
    description: "Authentic Caribbean without the crowds - the way the islands used to be"
  },
  {
    icon: Sun,
    title: "World-Class Diving",
    description: "Tobago Cays Marine Park offers some of the best snorkeling in the Caribbean"
  },
];

const anchorages = [
  {
    name: "Tobago Cays",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "Protected marine park with sea turtles, pristine reefs, and deserted beaches"
  },
  {
    name: "Bequia",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    description: "Charming island with boat-building heritage, great restaurants, and friendly locals"
  },
  {
    name: "Mustique",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    description: "Private island playground of celebrities with Basil&apos;s Bar and beautiful beaches"
  },
  {
    name: "Mayreau",
    image: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=600&q=80",
    description: "Smallest inhabited Grenadine with stunning Salt Whistle Bay"
  },
  {
    name: "Union Island",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
    description: "Dramatic peaks, kiteboarding paradise, and gateway to the Tobago Cays"
  },
  {
    name: "Petit St. Vincent",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "Exclusive private island resort with pristine beaches and ultimate privacy"
  },
];

const itinerary = [
  { day: 1, location: "St. Vincent to Bequia", distance: "9 nm", description: "Depart Kingstown, sail to Admiralty Bay, explore charming Port Elizabeth" },
  { day: 2, location: "Bequia to Mustique", distance: "8 nm", description: "Sail to glamorous Mustique, sundowner at Basil&apos;s Bar" },
  { day: 3, location: "Mustique to Canouan", distance: "12 nm", description: "Beautiful anchorage at Canouan, beach time and snorkeling" },
  { day: 4, location: "Canouan to Tobago Cays", distance: "8 nm", description: "Arrive at spectacular Tobago Cays Marine Park, swim with turtles" },
  { day: 5, location: "Tobago Cays", distance: "2 nm", description: "Full day exploring the marine park, snorkeling, and beach barbecue" },
  { day: 6, location: "Tobago Cays to Mayreau", distance: "3 nm", description: "Short sail to Salt Whistle Bay, one of the Caribbean's most beautiful beaches" },
  { day: 7, location: "Mayreau to Union Island", distance: "5 nm", description: "Final sail to Clifton Harbour, explore before returning or extending" },
];

const seasons = [
  {
    name: "High Season",
    months: "December - April",
    weather: "75-85°F, dry, consistent trade winds 15-20 knots",
    pricing: "Peak rates",
    recommendation: "Best conditions, book 6+ months ahead"
  },
  {
    name: "Shoulder Season",
    months: "May - June, November",
    weather: "80-88°F, occasional showers, good winds",
    pricing: "20-30% savings",
    recommendation: "Excellent value, great sailing"
  },
  {
    name: "Summer Season",
    months: "July - October",
    weather: "82-90°F, more rain, variable winds",
    pricing: "30-40% savings",
    recommendation: "Budget-friendly, hurricane awareness"
  },
];

const faqs = [
  {
    question: "Where are the Grenadines located?",
    answer: "The Grenadines are a chain of 32 islands stretching between St. Vincent in the north and Grenada in the south, in the southern Caribbean."
  },
  {
    question: "What makes the Tobago Cays special?",
    answer: "Tobago Cays Marine Park is a protected area with crystal-clear waters, sea turtles, pristine coral reefs, and five uninhabited islands surrounded by a horseshoe reef."
  },
  {
    question: "Can I visit Mustique?",
    answer: "Yes! While Mustique is a private island, yachts can anchor and visitors can enjoy the beach, swim, and visit the famous Basil&apos;s Bar."
  },
  {
    question: "Do I need a passport for the Grenadines?",
    answer: "Yes, a valid passport is required. The islands are part of St. Vincent and the Grenadines, an independent nation."
  },
  {
    question: "Is the Grenadines good for beginners?",
    answer: "The Grenadines offer excellent sailing with consistent trade winds and relatively short passages between islands, suitable for various skill levels."
  },
];

export default function GrenadinesDestinationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
            alt="The Grenadines pristine beach"
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
              The Grenadines
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-display italic mb-8">
              Unspoiled Caribbean Paradise - 32 Islands of Pure Beauty
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-[#e89d79]" />
                <span>32 Pristine Islands</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5 text-[#e89d79]" />
                <span>Marine Park Protected</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Ship className="w-5 h-5 text-[#e89d79]" />
                <span>18 Yachts Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?destination=grenadines"
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
              Why Charter in the Grenadines?
            </h2>
            <p className="text-lg text-[#061625]/70 leading-relaxed">
              The Grenadines offer the Caribbean of your dreams - unspoiled islands, empty beaches,
              crystal-clear waters, and authentic local culture. From the world-famous Tobago Cays Marine Park
              where you swim with sea turtles, to glamorous Mustique and charming Bequia, each island offers
              a unique experience. This is off-the-beaten-path sailing at its finest.
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
              From marine parks to private islands, discover Grenadine magic
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
              Best Boats for the Grenadines
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              Hand-picked yachts perfect for island-hopping through the Grenadines
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
            {grenadinesYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} variant="grid" />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/search?destination=grenadines"
              className="inline-flex items-center gap-2 bg-[#061625] hover:bg-[#0a2540] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              View All Grenadines Yachts
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
              A classic route through the heart of the Grenadines
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
              The Grenadines enjoy excellent trade winds and warm weather year-round
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
              Grenadines Charter FAQs
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
            Plan Your Grenadines Adventure
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Discover the unspoiled Caribbean of your dreams. From the Tobago Cays to Mustique,
            let our experts craft your perfect island-hopping itinerary.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?destination=grenadines"
              className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
            >
              Browse Grenadines Yachts
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
