"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YachtCard } from "@/components/YachtCard";
import { collections, getYachtsByCollection } from "@/lib/data";
import Link from "next/link";

export function FeaturedCollections() {
  return (
    <section className="py-20 md:py-28 bg-[#f8f7f4]">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#e89d79] mb-4 font-medium">Curated For You</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal italic text-[#061625] mb-6">Featured Yacht Collections</h2>
          <div className="w-16 h-px bg-[#e89d79] mx-auto mb-6" />
          <p className="text-[#061625]/70 text-lg max-w-2xl mx-auto">Expertly curated collections to help you find the perfect yacht for your Caribbean adventure.</p>
        </div>
      </div>
      {collections.map((collection) => {
        const collectionYachts = getYachtsByCollection(collection.slug);
        if (collectionYachts.length === 0) return null;
        return <CollectionRow key={collection.id} title={collection.name} description={collection.description} slug={collection.slug} yachts={collectionYachts} />;
      })}
    </section>
  );
}

function CollectionRow({ title, description, slug, yachts }: { title: string; description: string; slug: string; yachts: ReturnType<typeof getYachtsByCollection> }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <div className="mb-16 last:mb-0">
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-normal italic text-[#061625]">{title}</h3>
            <p className="text-[#061625]/60 text-sm mt-2">{description}</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full border-[#061625]/20 hover:bg-[#061625]/5 hover:border-[#061625]/40"><ChevronLeft className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full border-[#061625]/20 hover:bg-[#061625]/5 hover:border-[#061625]/40"><ChevronRight className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-5 md:gap-6 overflow-x-auto hide-scrollbar px-4 md:px-8 lg:px-16 pb-6">
        {yachts.map((yacht) => <YachtCard key={yacht.id} yacht={yacht} variant="compact" />)}
        <Link href={`/search?collection=${slug}`} className="flex-shrink-0 w-[280px] md:w-[320px] rounded-xl overflow-hidden bg-white border-2 border-dashed border-[#e89d79]/40 hover:border-[#e89d79] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center aspect-[4/3]">
          <span className="font-display text-xl font-normal italic text-[#e89d79] mb-2">View All</span>
          <span className="text-[#061625]/50 text-sm">See full collection</span>
        </Link>
      </div>
    </div>
  );
}
