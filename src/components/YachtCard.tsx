"use client";

import Link from "next/link";
import { Heart, Users, BedDouble, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Yacht } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useState } from "react";

interface YachtCardProps {
  yacht: Yacht;
  variant?: "default" | "compact" | "grid";
}

export function YachtCard({ yacht, variant = "default" }: YachtCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const charterTypeLabels: Record<string, string> = { crewed: "Crewed", bareboat: "Bareboat", cabin: "Cabin Charter" };

  if (variant === "compact") {
    return (
      <Link href={`/yacht/${yacht.slug}`} className="group flex-shrink-0 w-[280px] md:w-[320px] luxury-shadow rounded-xl overflow-hidden bg-card hover:luxury-shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${yacht.images[0]}')` }} />
          <div className="absolute top-3 left-3"><Badge className="bg-primary/90 text-white text-xs">{charterTypeLabels[yacht.charterType]}</Badge></div>
          <button onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
            <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{yacht.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3"><MapPin className="w-3.5 h-3.5" /><span>{yacht.destination}</span></div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{yacht.guests}</span>
            <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{yacht.cabins}</span>
          </div>
          <div className="text-foreground font-semibold">{formatPrice(yacht.priceFrom)}<span className="text-muted-foreground font-normal text-sm"> / week</span></div>
        </div>
      </Link>
    );
  }

  if (variant === "grid") {
    return (
      <Link href={`/yacht/${yacht.slug}`} className="group w-full luxury-shadow rounded-xl overflow-hidden bg-card hover:luxury-shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${yacht.images[0]}')` }} />
          <div className="absolute top-3 left-3"><Badge className="bg-primary/90 text-white text-xs">{charterTypeLabels[yacht.charterType]}</Badge></div>
          <button onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
            <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate">{yacht.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{yacht.destination}</span></div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{yacht.guests}</span>
            <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{yacht.cabins}</span>
          </div>
          <div className="text-foreground font-semibold">{formatPrice(yacht.priceFrom)}<span className="text-muted-foreground font-normal text-sm"> / week</span></div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group luxury-shadow rounded-xl overflow-hidden bg-card hover:luxury-shadow-lg transition-all duration-300">
      <Link href={`/yacht/${yacht.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${yacht.images[0]}')` }} />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-primary/90 text-white">{charterTypeLabels[yacht.charterType]}</Badge>
          {yacht.featured && <Badge className="bg-accent/90 text-white">Featured</Badge>}
        </div>
        <button onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
          <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/yacht/${yacht.slug}`}><h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{yacht.name}</h3></Link>
          <span className="text-sm text-muted-foreground">{yacht.length}ft {yacht.type}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4"><MapPin className="w-4 h-4" /><span>{yacht.destination}</span></div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{yacht.guests} guests</span>
          <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" />{yacht.cabins} cabins</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div><span className="text-xl font-semibold text-foreground">{formatPrice(yacht.priceFrom)}</span><span className="text-muted-foreground text-sm"> - {formatPrice(yacht.priceTo)} / week</span></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link href={`/yacht/${yacht.slug}`}>View Details</Link></Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90" asChild><Link href={`/yacht/${yacht.slug}#enquire`}>Enquire</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
