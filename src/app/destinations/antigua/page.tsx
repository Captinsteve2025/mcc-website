import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { yachts } from "@/lib/data";
import { ChevronRight, Anchor, Wind, Sun, Calendar, MapPin, Clock, Ship } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Filter yachts (use available yachts as placeholder)
const antiguaYachts = yachts.slice(0, 3);

const highlights = [
  {
    icon: Anchor,
    title: "365 Beaches",
    description: "One beach for every day of the year - from secluded coves to lively beach bars"
  },
  {
    icon: Wind,
    title: "Sailing Week Host",
    description: "Home to the world-famous Antigua Sailing Week regatta every April"
  },
  {
    icon: Sun,
    title: "Historic Nelson&apos;s Dockyard",
    description: "UNESCO World Heritage Site and only working Georgian dockyard in the world"
  },
];

const anchorages = [
  {
    name: "English Harbour",
    image: "/images/antigua-beach.jpg",
    description: "Historic Nelson&apos;s Dockyard with restaurants, bars, and maritime heritage"
  },
  {
    name: "Jolly Harbour",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    description: "Modern marina village with golf course, shops, and beach access"
  },
  {
    name: "Barbuda",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    description: "Sister island with pristine pink sand beaches and frigate bird sanctuary"
  },
  {
    name: "Green Island",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "Protected reef and crystal-clear snorkeling just off the east coast"
  },
  {
    name: "Dickenson Bay",
    image: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=600&q=80",
    description: "Popular beach with water sports, resorts, and beachfront dining"
  },
  {
    name: "Half Moon Bay",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
    description: "Atlantic-facing crescent beach with dramatic waves and wild beauty"
  },
];

const itinerary = [
  { day: 1, location: "Jolly Harbour to Deep Bay", distance: "5 nm", description: "Easy first sail, snorkel the wreck of the Andes, sunset at beach bar" },
  { day: 2, location: "Deep Bay to Barbuda", distance: "30 nm", description: "Sail to sister island, anchor at pristine 17-mile beach" },
  { day: 3, location: "Barbuda Exploration", distance: "5 nm", description: "Visit frigate bird sanctuary, explore pink sand beaches" },
  { day: 4, location: "Barbuda to Green Island", distance: "28 nm", description: "Return sail, anchor at Green Island for excellent snorkeling" },
  { day: 5, location: "Green Island to English Harbour", distance: "8 nm", description: "Historic Nelson&apos;s Dockyard, dinner at Admiral&apos;s Inn" },
  { day: 6, location: "English Harbour to Carlisle Bay", distance: "6 nm", description: "Beautiful bay, beach clubs, and water sports" },
  { day: 7, location: "Carlisle Bay to Jolly Harbour", distance: "10 nm", description: "Final sail along southwest coast back to base" },
];

const seasons = [
  {
    name: "High Season",
    months: "December - April",
    weather: "75-85°F, dry, consistent trade winds",
    pricing: "Peak rates, Sailing Week in April",
    recommendation: "Book early for Sailing Week"
  },
  {
    name: "Shoulder Season",
    months: "May - June, November",
    weather: "80-88°F, occasional showers, good winds",
    pricing: "20-30% savings",
    recommendation: "Great sailing, fewer crowds"
  },
  {
    name: "Summer Season",
    months: "July - October",
    weather: "82-90°F, tropical showers possible",
    pricing: "30-40% savings",
    recommendation: "Budget-friendly, monitor weather"
  },
];

const faqs = [
  {
    question: "Is it true Antigua has 365 beaches?",
    answer: "Yes! Antigua is famous for having a beach for every day of the year. Each offers something unique, from party vibes to secluded paradise."
  },
  {
    question: "Can I visit Barbuda on a charter?",
    answer: "Absolutely! Barbuda is about 30 nautical miles north and offers pristine beaches, a frigate bird sanctuary, and very few tourists."
  },
  {
    question: "What is Antigua Sailing Week?",
    answer: "Held every late April, it is one of the top regattas in the world, attracting sailors globally. English Harbour transforms into a massive sailing celebration."
  },
  {
    question: "Do I need a passport for Antigua?",
    answer: "Yes, all visitors need a valid passport. US, UK, and EU citizens do not need a visa for stays under 6 months."
  },
  {
    question: "What makes English Harbour special?",
    answer: "Nelson&apos;s Dockyard is a UNESCO World Heritage Site and the only continuously working Georgian dockyard in the world, dating back to the 18th century."
  },
];

export default function AntiguaDestinationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/antigua-beach.jpg"
            alt="Beautiful beach in Antigua"
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
              Antigua & Barbuda
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-display italic mb-8">
              365 Beaches - One for Every Day of the Year
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-[#e89d79]" />
                <span>365 Beaches</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5 text-[#e89d79]" />
                <span>Sailing Week Host</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Ship className="w-5 h-5 text-[#e89d79]" />
                <span>22 Yachts Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?destination=antigua"
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
              Why Charter in Antigua?
            </h2>
            <p className="text-lg text-[#061625]/70 leading-relaxed">
              Antigua is a sailor&apos;s paradise with reliable trade winds, protected harbors, and the legendary
              Nelson&apos;s Dockyard - the only working Georgian dockyard in the world. With 365 beaches to explore,
              the unspoiled sister island of Barbuda, and world-class events like Antigua Sailing Week,
              this island offers the perfect blend of sailing heritage and Caribbean beauty.
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
              From historic harbors to pristine sister island beaches
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
              Best Boats Available in Antigua
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              Hand-picked yachts perfect for exploring Antigua and Barbuda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
            {antiguaYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} variant="grid" />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/search?destination=antigua"
              className="inline-flex items-center gap-2 bg-[#061625] hover:bg-[#0a2540] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              View All Antigua Yachts
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
              Explore Antigua and Barbuda with this classic sailing route
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
              Antigua offers excellent sailing year-round with reliable trade winds
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
              Antigua Charter FAQs
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
            Plan Your Antigua Adventure
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Discover 365 beaches, historic harbors, and the unspoiled beauty of Barbuda.
            Let our experts create your perfect sailing itinerary.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?destination=antigua"
              className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
            >
              Browse Antigua Yachts
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
