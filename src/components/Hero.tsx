"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Play, Search, MapPin, Calendar, Ship, Users } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { destinations } from "@/lib/data";

const VIDEO_URL = "https://www.mycaribbeancharters.com/wp-content/uploads/2025/09/BP-clipped-1080.mp4";

const yachtTypes = [
  { value: "", label: "Choose yours" },
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
  const [dates, setDates] = useState("");
  const [yachtType, setYachtType] = useState("");
  const [guests, setGuests] = useState("");

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

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (yachtType) params.set("type", yachtType);
    if (guests) params.set("guests", guests);
    window.location.href = `/search?${params.toString()}`;
  };

  const scrollToContent = () => {
    const element = document.getElementById("charter-styles");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen min-h-[700px] max-h-[1000px] flex items-center justify-center overflow-hidden">
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

        {videoLoaded && !isPlaying && !videoError && (
          <button
            onClick={handlePlayClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors group"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
          </button>
        )}


      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-white/80 font-medium">Caribbean Yacht Charters</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-normal italic mb-6 leading-tight">Sail Into Luxury</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Discover the ultimate Caribbean yacht experience. Crewed charters, bareboat adventures, and cabin cruises in the British Virgin Islands, Grenadines, St Martin, and beyond.
        </p>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 md:p-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3">
              {/* Where to charter */}
              <div className="relative">
                <label className="absolute -top-6 left-2 text-xs text-white/70 font-medium">Where to charter</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#061625] text-white">All Destinations</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.slug} className="bg-[#061625] text-white">
                        {dest.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              {/* When */}
              <div className="relative">
                <label className="absolute -top-6 left-2 text-xs text-white/70 font-medium">When</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Choose dates"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Yacht type */}
              <div className="relative">
                <label className="absolute -top-6 left-2 text-xs text-white/70 font-medium">Yacht type</label>
                <div className="relative">
                  <Ship className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <select
                    value={yachtType}
                    onChange={(e) => setYachtType(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                  >
                    {yachtTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-[#061625] text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="absolute -top-6 left-2 text-xs text-white/70 font-medium">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="How many"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="h-12 bg-[#e89d79] hover:bg-[#d88a66] rounded-md flex items-center justify-center transition-colors"
                aria-label="Search yachts"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-base">
            <Link href="/search">Explore Yachts</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 px-8 py-6 text-base bg-transparent">
            <Link href="#enquire">Get Expert Advice</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button onClick={scrollToContent} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce" aria-label="Scroll to content">
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
