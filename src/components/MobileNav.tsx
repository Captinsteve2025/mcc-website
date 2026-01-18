"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";

interface MobileNavProps {
  currentPage?: string;
  variant?: "light" | "dark";
}

export function MobileNav({ currentPage, variant = "light" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Charter Styles", href: "/#charter-styles" },
    { name: "Destinations", href: "/#destinations" },
    { name: "Training", href: "/training" },
    { name: "Browse Yachts", href: "/search" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <button className={`p-2 ${variant === "light" ? "text-white" : "text-foreground"}`}>
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Logo variant="dark" />
          </div>
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-lg font-medium transition-colors ${
                  currentPage === item.name
                    ? "text-[#e89d79]"
                    : "text-foreground hover:text-[#e89d79]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t space-y-4">
            <a
              href="tel:+1-786-520-1558"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="w-4 h-4" /> +1 (786) 520-1558
            </a>
            <Button asChild className="w-full bg-[#e89d79] hover:bg-[#e89d79]/90 text-white">
              <Link href="#contact" onClick={() => setIsOpen(false)}>
                Enquire Now
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
