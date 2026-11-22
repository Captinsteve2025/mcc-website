"use client";

import { ChevronDown, Search, MapPin, Calendar, Ship, Users } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { destinations } from "@/lib/data";
import { YachtNameSearch } from "@/components/yacht/YachtNameSearch";

const VIDEO_URL = "https://www.mycaribbeancharters.com/wp-content/uploads/2025/09/BP-clipped-1080.mp4";

const yachtTypes = [
  { value: "", label: "All Yacht Types" },
  { value: "catamaran", label: "Catamaran" },
  { value: "monohull", label: "Monohull" },
  { value: "motor", label: "Motor Yacht" },
  { value: "power-catamaran", label: "Power Catamaran" },
  { value: "gulet", label: "Gulet" },
  { value: "classic", label: "Classic" },
];

export function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Search form state
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [yachtType, setYachtType] = useState("");
  const [guests, setGuests] = useState("");

  const searchParams = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (startDate) params.set("start", startDate);
    if (endDate) params.set("end", endDate);
    if (yachtType) params.set("type", yachtType);
    if (guests) params.set("guests", guests);
    return params.toString();
  };

  const handleSearch = () => {
    window.location.href = `/charter-yachts?${searchParams()}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsPlaying(true);
        setVideoLoaded(true);
      }).catch(() => {
        setVideoLoaded(true);
      });
    }
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById("charter-styles");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const selectClass =
    "w-full h-12 pl-10 pr-4 bg-white/95 border border-white/20 rounded-md text-[#061625] text-sm focus:outline-none focus:ring-2 focus:ring-[#EE9739] appearance-none cursor-pointer";
  const inputClass =
    "w-full h-12 px-3 bg-white/95 border border-white/20 rounded-md text-[#061625] text-sm focus:outline-none focus:ring-2 focus:ring-[#EE9739] [color-scheme:light]";

  return (
    <section className="relative min-h-[640px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Layer - Navy base color with video */}
      <div className="absolute inset-0 bg-[#061625]">
        {!videoError && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            onPlay={() => setIsPlaying(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded && isPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full container mx-auto px-4 py-24 text-center text-white">
        <p className="text-xs md:text-base uppercase tracking-[0.3em] mb-3 text-white/80 font-medium">Caribbean Yacht Charters</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-normal italic mb-4 leading-tight">Sail Into Luxury</h1>
        {/* Short mobile paragraph, full paragraph from md up */}
        <p className="hidden md:block text-lg text-white/90 max-w-2xl mx-auto mb-10">
          Discover the ultimate Caribbean yacht experience. Crewed charters, bareboat adventures, and cabin cruises in the British Virgin Islands, Grenadines, St Martin, and beyond.
        </p>
        <p className="md:hidden text-sm text-white/90 max-w-md mx-auto mb-8">
          Crewed charters, bareboat adventures and cabin cruises across the Caribbean.
        </p>

        {/* Search form — labels sit above their fields in a responsive grid */}
        <div className="max-w-5xl mx-auto mb-8 md:mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-5 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Yacht name — full-width with autocomplete */}
              <div className="md:col-span-12">
                <label htmlFor="hero-yacht-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/80">
                  Yacht Name
                </label>
                <YachtNameSearch defaultValue="" basePath="/charter-yachts" />
              </div>

              {/* Destination — full-width */}
              <div className="md:col-span-6">
                <label htmlFor="hero-destination" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/80">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#061625]/40" aria-hidden="true" />
                  <select
                    id="hero-destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All Destinations</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.slug}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#061625]/40 pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Yacht type */}
              <div className="md:col-span-6">
                <label htmlFor="hero-yacht-type" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/80">
                  Yacht Type
                </label>
                <div className="relative">
                  <Ship className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#061625]/40" aria-hidden="true" />
                  <select
                    id="hero-yacht-type"
                    value={yachtType}
                    onChange={(e) => setYachtType(e.target.value)}
                    className={selectClass}
                  >
                    {yachtTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#061625]/40 pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Travel dates — two-up where space permits */}
              <div className="grid grid-cols-2 gap-3 md:col-span-8">
                <div>
                  <label htmlFor="hero-start" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/80">
                    Travel Dates
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#061625]/40" aria-hidden="true" />
                    <input
                      id="hero-start"
                      type="date"
                      aria-label="Charter start date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hero-end" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/80 invisible" aria-hidden="true">
                    Travel Dates
                  </label>
                  <input
                    id="hero-end"
                    type="date"
                    aria-label="Charter end date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="md:col-span-4">
                <label htmlFor="hero-guests" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/80">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#061625]/40" aria-hidden="true" />
                  <input
                    id="hero-guests"
                    type="number"
                    min={1}
                    max={12}
                    inputMode="numeric"
                    placeholder="How many"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={`${inputClass} pl-9 placeholder:text-[#061625]/45`}
                  />
                </div>
              </div>
            </div>

            {/* One prominent submission button */}
            <button
              type="submit"
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[#EE9739] text-base font-semibold text-white transition-colors hover:bg-[#EA6F33]"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Search Yachts
            </button>
          </form>
        </div>

        {/* Secondary action only — the search button above is the primary CTA */}
        <div className="flex justify-center">
          <Link
            href="#enquire"
            className="rounded-full border border-white/50 px-8 py-3 text-base text-white transition-colors hover:bg-white/10"
          >
            Get Expert Advice
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button onClick={scrollToContent} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce" aria-label="Scroll to content">
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
