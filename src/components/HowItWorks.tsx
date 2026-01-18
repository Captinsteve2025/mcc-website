"use client";

import { MessageSquare, Ship, Search, Shield, Anchor, ArrowRight } from "lucide-react";
import { bookingSteps } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Ship: <Ship className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Anchor: <Anchor className="w-6 h-6" />,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-normal italic mb-4">How Charter Booking Works</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Our concierge team handles every detail, from finding your perfect yacht to planning your itinerary.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4">
          {bookingSteps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {index < bookingSteps.length - 1 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-white/20" />}
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">{iconMap[step.icon]}</div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center">{step.step}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <p className="text-white/90 text-lg font-medium">Ready to start your Caribbean adventure?</p>
              <p className="text-white/60 text-sm">Our experts respond within 24 hours</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white px-8">
                <Link href="#enquire">
                  Start Planning
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Link href="/search">Browse Yachts</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
