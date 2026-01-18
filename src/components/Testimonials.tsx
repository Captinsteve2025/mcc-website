"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Display 3 reviews at a time on desktop, 1 on mobile
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / reviewsPerPage);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, totalPages]);

  const visibleReviews = testimonials.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  );

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#e89d79] text-[#e89d79]" />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">5.0 Rating</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-normal italic text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real reviews from families, couples, and groups who trusted us with their Caribbean charter experience.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {visibleReviews.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-xl p-6 md:p-8 luxury-shadow transition-all duration-500"
              >
                <Quote className="w-8 h-8 text-[#e89d79]/30 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${testimonial.id}-${i}`}
                      className={`w-4 h-4 ${i < testimonial.rating ? "fill-[#e89d79] text-[#e89d79]" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed text-sm md:text-base line-clamp-5">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary">{testimonial.yacht}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs text-muted-foreground">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-[#e89d79] w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 md:mt-16 pt-12 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <TrustBadge title="15+ Years" subtitle="Caribbean Experience" />
            <TrustBadge title="500+" subtitle="Happy Charters" />
            <TrustBadge title="5.0" subtitle="Google Rating" />
            <TrustBadge title="24/7" subtitle="Concierge Support" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl md:text-3xl font-normal italic text-primary">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
