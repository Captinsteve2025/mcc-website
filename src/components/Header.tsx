"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { destinations } from "@/lib/data";

// Charter styles for menu
const charterStylesMenu = [
  { id: "luxury", name: "Luxury Yachts", slug: "luxury" },
  { id: "crewed", name: "Crewed Charters", slug: "crewed" },
  { id: "sail-stay", name: "Sail & Stay Experiences", slug: "sail-stay" },
  { id: "bareboat", name: "Bareboat Charters", slug: "bareboat" },
] as const;

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
  return destinationPages[slug] || `/destinations/${slug}`;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
      role="banner"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2" aria-label="My Caribbean Charters - Home">
            <Logo variant={isScrolled ? "dark" : "light"} />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7F50] rounded-md px-2 py-1 ${isScrolled ? "text-[#061625] hover:text-[#FF7F50]" : "text-white hover:text-white/80"}`}
                aria-haspopup="true"
                aria-expanded="false"
              >
                Charter Styles <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]" role="menu">
                  {charterStylesMenu.map((style) => (
                    <Link
                      key={style.id}
                      href="/#charter-styles"
                      className="block px-4 py-2 text-sm text-[#061625] hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7F50]"
                      role="menuitem"
                    >
                      {style.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7F50] rounded-md px-2 py-1 ${isScrolled ? "text-[#061625] hover:text-[#FF7F50]" : "text-white hover:text-white/80"}`}
                aria-haspopup="true"
                aria-expanded="false"
              >
                Destinations <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white rounded-lg shadow-lg p-4 min-w-[220px]" role="menu">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.id}
                      href={getDestinationLink(dest.slug)}
                      className="block px-4 py-2 text-sm text-[#061625] hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7F50]"
                      role="menuitem"
                    >
                      {dest.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/search"
              className={`text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7F50] rounded-md px-2 py-1 ${isScrolled ? "text-[#061625] hover:text-[#FF7F50]" : "text-white hover:text-white/80"}`}
            >
              Browse Yachts
            </Link>

            <Link
              href="/training"
              className={`text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7F50] rounded-md px-2 py-1 ${isScrolled ? "text-[#061625] hover:text-[#FF7F50]" : "text-white hover:text-white/80"}`}
            >
              Training
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:+1-786-520-1558"
              className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7F50] rounded-md px-2 py-1 ${isScrolled ? "text-[#061625] hover:text-[#FF7F50]" : "text-white hover:text-white/80"}`}
              aria-label="Call us at +1 786 520 1558"
            >
              <Phone className="w-4 h-4" aria-hidden="true" /> +1 (786) 520-1558
            </a>
            <Button asChild className="hidden sm:inline-flex">
              <Link href="#enquire">Enquire Now</Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <button
                  className={`p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7F50] ${isScrolled ? "text-[#061625]" : "text-white"}`}
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                >
                  <Menu className="w-6 h-6" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Logo variant="dark" />
                  </div>
                  <nav className="flex-1 p-6 space-y-6" role="navigation" aria-label="Mobile navigation">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Charter Styles</h3>
                      {charterStylesMenu.map((style) => (
                        <Link
                          key={style.id}
                          href="/#charter-styles"
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-[#061625] hover:text-[#FF7F50] transition-colors focus:outline-none focus-visible:underline"
                        >
                          {style.name}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Destinations</h3>
                      {destinations.map((dest) => (
                        <Link
                          key={dest.id}
                          href={getDestinationLink(dest.slug)}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-[#061625] hover:text-[#FF7F50] transition-colors focus:outline-none focus-visible:underline"
                        >
                          {dest.name}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <Link
                        href="/training"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-[#061625] hover:text-[#FF7F50] transition-colors font-semibold focus:outline-none focus-visible:underline"
                      >
                        Sailing Training
                      </Link>
                    </div>
                  </nav>
                  <div className="p-6 border-t space-y-4">
                    <a
                      href="tel:+1-786-520-1558"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#061625] focus:outline-none focus-visible:underline"
                      aria-label="Call us at +1 786 520 1558"
                    >
                      <Phone className="w-4 h-4" aria-hidden="true" /> +1 (786) 520-1558
                    </a>
                    <Button asChild className="w-full">
                      <Link href="#enquire" onClick={() => setIsOpen(false)}>Enquire Now</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
