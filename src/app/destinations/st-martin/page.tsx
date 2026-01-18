import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { yachts } from "@/lib/data";
import { ChevronRight, Anchor, Wind, Sun, Calendar, MapPin, Clock, Ship } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Filter yachts (use BVI yachts as placeholder since St. Martin may not have dedicated yachts)
const stMartinYachts = yachts.slice(0, 3);

const highlights = [
  {
    icon: Anchor,
    title: "Two Nations, One Island",
    description: "French St. Martin and Dutch Sint Maarten offer distinct cultures and experiences"
  },
  {
    icon: Wind,
    title: "Culinary Capital",
    description: "Over 300 restaurants make this the gastronomic heart of the Caribbean"
  },
  {
    icon: Sun,
    title: "Island Hopping Hub",
    description: "Perfect base for exploring Anguilla, St. Barths, and surrounding islands"
  },
];

const anchorages = [
  {
    name: "Marigot, French Side",
    image: "/images/st-martin-swimming.jpg",
    description: "Charming French harbor town with open-air markets and bistros"
  },
  {
    name: "Philipsburg, Dutch Side",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    description: "Duty-free shopping, casinos, and the famous Maho Beach"
  },
  {
    name: "Anguilla",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    description: "Short sail to pristine beaches and world-class resorts"
  },
  {
    name: "St. Barthélemy",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "Glamorous French island with designer boutiques and gourmet dining"
  },
  {
    name: "Tintamarre Island",
    image: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=600&q=80",
    description: "Uninhabited nature reserve with pristine snorkeling"
  },
  {
    name: "Pinel Island",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
    description: "Idyllic beach paradise just off the French coast"
  },
];

const itinerary = [
  { day: 1, location: "Simpson Bay to Marigot", distance: "6 nm", description: "Explore French side, enjoy waterfront dining and local markets" },
  { day: 2, location: "Marigot to Anguilla", distance: "8 nm", description: "Sail to Anguilla, beach time at Shoal Bay, upscale dining" },
  { day: 3, location: "Anguilla to St. Barths", distance: "18 nm", description: "Cross to glamorous Gustavia, explore boutiques and harbor" },
  { day: 4, location: "St. Barths Exploration", distance: "5 nm", description: "Beach hop around St. Barths, Shell Beach, Colombier" },
  { day: 5, location: "St. Barths to Tintamarre", distance: "12 nm", description: "Return toward St. Martin, anchor at uninhabited Tintamarre" },
  { day: 6, location: "Tintamarre to Pinel Island", distance: "4 nm", description: "Snorkeling and beach barbecue at Pinel Island" },
  { day: 7, location: "Pinel to Simpson Bay", distance: "8 nm", description: "Final sail along coast, watch planes at Maho Beach" },
];

const seasons = [
  {
    name: "High Season",
    months: "December - April",
    weather: "77-84°F, low humidity, consistent trade winds",
    pricing: "Peak rates",
    recommendation: "Book well in advance for holidays"
  },
  {
    name: "Shoulder Season",
    months: "May - June, November",
    weather: "80-86°F, brief showers, good sailing",
    pricing: "20-30% savings",
    recommendation: "Great value, fewer crowds"
  },
  {
    name: "Summer Season",
    months: "July - October",
    weather: "82-88°F, afternoon showers possible",
    pricing: "30-40% savings",
    recommendation: "Budget-friendly, monitor weather"
  },
];

const faqs = [
  {
    question: "What is the difference between French and Dutch sides?",
    answer: "French St. Martin offers European charm, gourmet dining, and clothing-optional beaches. Dutch Sint Maarten has casinos, duty-free shopping, and more nightlife."
  },
  {
    question: "Do I need a passport for St. Martin?",
    answer: "Yes, a valid passport is required. The island is divided between France and the Netherlands, but there is no border control between the two sides."
  },
  {
    question: "Can I visit St. Barths on a day trip?",
    answer: "Absolutely! St. Barths is only 15 nautical miles away, making it perfect for a day sail or overnight stay."
  },
  {
    question: "What is St. Martin known for?",
    answer: "St. Martin is famous for its incredible dining scene (300+ restaurants), Maho Beach where planes land overhead, and its dual French-Dutch culture."
  },
  {
    question: "Is St. Martin good for beginners?",
    answer: "Yes! The waters are relatively calm, distances between islands are short, and there are plenty of protected anchorages."
  },
];

export default function StMartinDestinationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/st-martin-swimming.jpg"
            alt="Crystal clear waters of St. Martin"
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
              St. Martin / Sint Maarten
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-display italic mb-8">
              The Friendly Island - Two Nations, One Paradise
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-[#e89d79]" />
                <span>French & Dutch Cultures</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5 text-[#e89d79]" />
                <span>300+ Restaurants</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Ship className="w-5 h-5 text-[#e89d79]" />
                <span>24 Yachts Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?destination=st-martin"
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
              Why Charter from St. Martin?
            </h2>
            <p className="text-lg text-[#061625]/70 leading-relaxed">
              St. Martin is the smallest island in the world shared by two nations - France and the Netherlands.
              This unique dual heritage creates an incredible fusion of cultures, cuisines, and experiences.
              As the culinary capital of the Caribbean with over 300 restaurants, and a perfect hub for
              island hopping to Anguilla, St. Barths, and beyond, St. Martin offers the ultimate charter base.
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
              Explore two cultures on one island, plus nearby gems
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
              Best Boats Available in St. Martin
            </h2>
            <p className="text-[#061625]/70 max-w-2xl mx-auto">
              Hand-picked yachts perfect for exploring St. Martin and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
            {stMartinYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} variant="grid" />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/search?destination=st-martin"
              className="inline-flex items-center gap-2 bg-[#061625] hover:bg-[#0a2540] text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              View All St. Martin Yachts
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
              Explore St. Martin, Anguilla, and St. Barths in one incredible week
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
              St. Martin enjoys excellent weather year-round
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
              St. Martin Charter FAQs
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
            Plan Your St. Martin Adventure
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Experience the best of French and Dutch Caribbean culture.
            Let our experts create your perfect island-hopping itinerary.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search?destination=st-martin"
              className="inline-flex items-center gap-2 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
            >
              Browse St. Martin Yachts
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
