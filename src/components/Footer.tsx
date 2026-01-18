"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { destinations, charterStyles } from "@/lib/data";

const accentColor = "#e89d79"; // MCC coral/orange color

// Authority badges - local images
const authorityBadges = [
  {
    name: "IYBA - International Yacht Brokers Association",
    image: "/images/badge-iyba.png",
    url: "https://www.iyba.org/",
  },
  {
    name: "VIPCA - Virgin Islands Professional Charter Association",
    image: "/images/badge-vipca.png",
    url: "https://www.vipca.org/",
  },
  {
    name: "BVI Charter Yacht Society - Accredited Broker 2025",
    image: "/images/badge-bvi-charter-white.png",
    url: "https://www.bvicrewedyachts.com/",
  },
  {
    name: "Maritime Training",
    image: "/images/badge-maritime-training.png",
    url: "#",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#061625] text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo variant="light" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">Expert yacht charter services in the Caribbean. Your trusted partner for unforgettable sailing experiences.</p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com/mycaribbeancharters" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/mycaribbeancharters/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/channel/UCeJnv0OcnQ8cFG_lv2ew0Lg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Charter Styles</h4>
            <ul className="space-y-2">{charterStyles.map((style) => <li key={style.id}><Link href={`/search?type=${style.slug}`} className="text-white/70 hover:text-white text-sm transition-colors">{style.name}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Destinations</h4>
            <ul className="space-y-2">{destinations.map((dest) => <li key={dest.id}><Link href={`/search?destination=${dest.slug}`} className="text-white/70 hover:text-white text-sm transition-colors">{dest.name}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:bookings@mycaribbeancharters.com" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors">
                  <Mail className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>bookings@mycaribbeancharters.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                <span>Tortola, British Virgin Islands</span>
              </li>
              <li>
                <a href="tel:+1-786-520-1558" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors">
                  <Phone className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>+1 786-520-1558 - Cell/WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="tel:+1-284-342-3268" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors">
                  <Phone className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>+1 284 342 3268 - Office</span>
                </a>
              </li>
              <li>
                <a href="tel:+1-786-246-0809" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors">
                  <Phone className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>+1 786-246-0809 (US)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Proud Members / Authority Badges Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center gap-6">
            <h4 className="font-semibold text-lg">Proud Members</h4>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {authorityBadges.map((badge) => (
                <a
                  key={badge.name}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block opacity-90 hover:opacity-100 transition-opacity"
                  title={badge.name}
                >
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    width={160}
                    height={60}
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} My Caribbean Charters. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
