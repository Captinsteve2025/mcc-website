"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Ruler } from "lucide-react";

type Props = {
  yachtId: string;
  headline: string;
  hasRate: boolean;
};

// Sticky bar that appears once the hero has scrolled away and hides again
// when the enquiry form is on screen (enquiry CTA would be redundant there).
export function YachtPersistentBar({ yachtId, headline, hasRate }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("yacht-hero");
    const enquire = document.getElementById("enquire");
    const onScroll = () => {
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      let enquireVisible = false;
      if (enquire) {
        const rect = enquire.getBoundingClientRect();
        enquireVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setVisible(heroBottom < 0 && !enquireVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061625] text-white transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Ruler className="h-5 w-5 shrink-0 text-[#EE9739]" aria-hidden="true" />
          <p className="truncate text-sm">
            {hasRate ? <span className="font-display italic text-[#EE9739]">{headline}</span> : <span className="text-white/80">Rates on request</span>}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a href="#rates" className="hidden rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 sm:inline-flex">
            Rates &amp; Dates
          </a>
          <a href="#enquire" className="inline-flex items-center gap-1.5 rounded-full bg-[#EE9739] px-4 py-2 text-xs font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33]">
            Enquire Now <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
