"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Users, Anchor, Crown, Compass } from "lucide-react";

const charterStylesData = [
  {
    id: "luxury",
    name: "Luxury Yachts",
    slug: "luxury",
    tagline: "Ultimate Elegance",
    description: "Experience the pinnacle of yachting with world-class superyachts and mega catamarans. Unparalleled sophistication, service, and style.",
    image: "/images/luxury-yacht-superyacht.webp",
    icon: Crown,
    features: ["Superyachts", "5-Star Service", "Exclusive Destinations", "Bespoke Experiences"],
    color: "#c9a962",
  },
  {
    id: "crewed",
    name: "Crewed Charters",
    slug: "crewed",
    tagline: "All-Inclusive Luxury",
    description: "Relax while your professional captain and chef create an unforgettable experience. Gourmet meals, premium drinks, and personalized service included.",
    image: "/images/crewed-charter-catamaran.webp",
    icon: Users,
    features: ["Captain & Chef", "All Meals Included", "Premium Bar", "Water Toys"],
    color: "#e89d79",
  },
  {
    id: "sail-stay",
    name: "Sail & Stay Experiences",
    slug: "sail-stay",
    tagline: "Sea Meets Shore",
    description: "The perfect blend of sailing adventure and land-based luxury. Split your time between yacht and villa for the ultimate Caribbean escape.",
    image: "/images/sail-stay-villa.jpg",
    icon: Compass,
    features: ["Yacht + Villa", "Island Hopping", "Beach Resorts", "Flexible Itinerary"],
    color: "#6bb5a2",
  },
  {
    id: "bareboat",
    name: "Bareboat Charters",
    slug: "bareboat",
    tagline: "Captain Your Adventure",
    description: "For certified sailors ready to explore at their own pace. Full freedom to chart your course through paradise.",
    image: "/images/bareboat-catamaran.webp",
    icon: Anchor,
    features: ["Full Independence", "Flexible Itinerary", "Cost Effective", "Sailing Freedom"],
    color: "#5a9fd4",
  },
];

export function CharterStyles() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="charter-styles"
      className="py-20 md:py-32 overflow-hidden relative bg-[#f8f7f4]"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#061625] uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Your Perfect Charter Awaits
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal italic text-[#061625] mb-6">
            Choose Your Style
          </h2>
          <p className="text-[#061625]/80 text-lg max-w-2xl mx-auto">
            From fully-crewed luxury to captain-your-own adventures, discover the perfect way to experience the Caribbean.
          </p>
        </div>

        {/* Charter Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {charterStylesData.map((style, index) => {
            const Icon = style.icon;
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={style.id}
                href={`/search?type=${style.slug}`}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`relative h-[336px] rounded-2xl overflow-hidden transition-all duration-500 ${isHovered ? 'scale-[1.02]' : 'scale-100'}`}>
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                    style={{
                      backgroundImage: `url('${style.image}')`,
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-70'}`}
                    style={{
                      background: `linear-gradient(to top, ${style.color}ee 0%, ${style.color}99 30%, transparent 70%)`
                    }}
                  />

                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Top - Icon */}
                    <div className={`self-start transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'}`}>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{ backgroundColor: `${style.color}40` }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Bottom - Text Content */}
                    <div>
                      {/* Tagline */}
                      <span
                        className={`inline-block text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-500 ${isHovered ? 'opacity-100 scale-105' : 'opacity-95'}`}
                        style={{
                          backgroundColor: `${style.color}cc`,
                          color: '#ffffff',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {style.tagline}
                      </span>

                      {/* Title */}
                      <h3 className="font-display text-2xl md:text-3xl font-normal italic text-white mb-3">
                        {style.name}
                      </h3>

                      {/* Description - shows on hover */}
                      <div className={`transition-all duration-500 overflow-hidden ${isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                          {style.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {style.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/90"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className={`flex items-center gap-2 transition-all duration-500 ${isHovered ? 'translate-x-2 opacity-100' : 'translate-x-0 opacity-70'}`}>
                        <span className="text-sm font-medium text-white">Explore</span>
                        <ArrowRight className={`w-4 h-4 text-white transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Animated border on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl border-2 transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{ borderColor: style.color }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#061625]/60 text-base mb-5">Not sure which style is right for you?</p>
          <Link
            href="#enquire"
            className="inline-flex items-center gap-3 bg-[#e89d79] hover:bg-[#d88a66] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <span>Let our experts guide you</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
