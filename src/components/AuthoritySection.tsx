"use client";

import { Anchor, Compass, Users, Award, Ship, MapPin } from "lucide-react";
import Image from "next/image";

const stats = [
  { value: "50+", label: "Years Combined Experience", icon: Award },
  { value: "500+", label: "Charters Arranged", icon: Ship },
  { value: "30+", label: "Caribbean Destinations", icon: MapPin },
];

const pillars = [
  {
    title: "Experienced",
    description: "Real sailors who've walked the docks and sailed every anchorage",
    icon: Compass
  },
  {
    title: "Authentic",
    description: "Caribbean residents who live and breathe island life",
    icon: Anchor
  },
  {
    title: "Dedicated",
    description: "Your trusted partner from first inquiry to final sunset",
    icon: Users
  },
];

export function AuthoritySection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Decorative top wave - overlaps section above */}
      <div className="absolute -top-1 left-0 right-0 h-24 md:h-32 z-20 drop-shadow-[0_8px_16px_rgba(6,22,37,0.15)]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full rotate-180">
          <path
            d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
            className="fill-[#f8f7f4]"
          />
        </svg>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/caribbean-water-bg.webp"
          alt="Caribbean water background"
          fill
          className="object-cover"
          priority
        />
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-white/[0.08]" />
      </div>

      {/* Decorative top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#e89d79] to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Why Choose Us</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal italic text-[#061625] mb-6 leading-tight">
            Caribbean Experts. Crew Inspired.<br className="hidden md:block" /> Client Focused.
          </h2>
          <div className="w-16 h-px bg-[#e89d79] mx-auto mb-6" />
          <p className="text-lg md:text-xl text-[#061625]/70 italic">
            Real people. Real experience. Real charters that exceed expectations.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-lg border border-[#061625]/[0.08] hover:border-[#e89d79]/40 hover:bg-white/90 transition-all duration-300 group shadow-sm"
            >
              <stat.icon className="w-8 h-8 text-[#e89d79] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-display text-4xl md:text-5xl font-normal italic text-[#061625] mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-[#061625]/60 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main content - two column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto mb-16">
          {/* Left column - main narrative */}
          <div className="space-y-6">
            <p className="text-lg text-[#061625]/80 leading-relaxed">
              At My Caribbean Charters we are not a travel startup run by algorithms. We are experienced sailors, former yacht crew, charter captains, and Caribbean residents who live and breathe everything about sailing, cruising, and exploring the islands.
            </p>
            <p className="text-lg text-[#061625]/80 leading-relaxed">
              With over <span className="text-[#e89d79] font-semibold">50 years of combined hands-on experience</span> in the Caribbean yacht industry, we know what makes a charter unforgettable, and what makes it frustrating. We have walked the docks, sailed the anchorages, answered questions under the sun, and handled every kind of itinerary challenge imaginable.
            </p>
          </div>

          {/* Right column - continuation and emphasis */}
          <div className="space-y-6">
            <p className="text-lg text-[#061625]/80 leading-relaxed">
              That history gives us a clear advantage: we don&apos;t just sell charters, we guide you to the best boats, best destinations, and best experiences based on real lessons learned at sea, not just data points.
            </p>
            <p className="text-lg text-[#061625]/80 leading-relaxed">
              Whether you are planning your first Caribbean sail or you are a seasoned yachtsman looking for the perfect crewed getaway, we are your trusted partner from start to finish.
            </p>
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="relative text-center p-8 group"
            >
              {/* Connecting line between pillars (hidden on mobile) */}
              {index < pillars.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-transparent via-[#061625]/10 to-transparent translate-x-1/2" />
              )}

              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#061625] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#e89d79] transition-colors duration-300 shadow-lg">
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-2xl font-normal italic text-[#061625] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#061625]/60 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final tagline */}
        <div className="text-center pt-8 border-t border-[#061625]/10 max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.25em] text-[#061625]/50 mb-3">My Caribbean Charters</p>
          <p className="font-display text-2xl md:text-3xl font-normal italic text-[#061625]">
            <span className="text-[#e89d79]">Experienced.</span> Authentic. <span className="text-[#e89d79]">Dedicated</span> to your best charter yet.
          </p>
        </div>
      </div>

      {/* Decorative bottom wave - overflows onto next section */}
      <div className="absolute -bottom-1 left-0 right-0 h-24 md:h-32 z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
            className="fill-[#f8f7f4]"
          />
        </svg>
      </div>
    </section>
  );
}
