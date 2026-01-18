"use client";

import Link from "next/link";
import { destinations } from "@/lib/data";
import { ChevronRight } from "lucide-react";

// Map destination slugs to their dedicated page URLs
const destinationPages: Record<string, string> = {
  "british-virgin-islands": "/destinations/british-virgin-islands",
  "us-virgin-islands": "/destinations/us-virgin-islands",
  "st-martin": "/destinations/st-martin",
  "bahamas": "/destinations/bahamas",
  "antigua": "/destinations/antigua",
  "grenadines": "/destinations/grenadines",
};

function getDestinationLink(slug: string): string {
  return destinationPages[slug] || `/search?destination=${slug}`;
}

export function Destinations() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-normal italic text-foreground mb-4">Top Charter Destinations</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From the sailing paradise of the BVI to the pristine waters of the Bahamas.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Link href="/destinations/british-virgin-islands" className="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 aspect-[16/9] lg:aspect-auto rounded-xl overflow-hidden luxury-shadow hover:luxury-shadow-lg transition-all">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${destinations[0].image}')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2"><span>{destinations[0].yachtCount} yachts available</span></div>
              <h3 className="font-display text-2xl md:text-4xl font-normal italic text-white mb-2">{destinations[0].name}</h3>
              <p className="text-white/80 text-sm md:text-base max-w-md mb-4">{destinations[0].description}</p>
              <div className="flex items-center text-white font-medium text-sm gap-1 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span>Explore destination</span><ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
          {destinations.slice(1).map((destination) => (
            <Link key={destination.id} href={getDestinationLink(destination.slug)} className="group relative aspect-[4/3] rounded-xl overflow-hidden luxury-shadow hover:luxury-shadow-lg transition-all">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${destination.image}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="text-accent text-xs font-medium mb-1">{destination.yachtCount} yachts</div>
                <h3 className="font-display text-xl font-semibold text-white mb-1">{destination.name}</h3>
                <p className="text-white/70 text-sm line-clamp-1">{destination.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
