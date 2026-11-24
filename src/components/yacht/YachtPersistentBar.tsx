"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

// Persistent mobile pricing bar. Appears after the visitor scrolls past the
// hero (so the hero band with the same price is not duplicated on screen) and
// hides itself near the enquiry form so it never covers form fields, the
// calendar or the lightbox. Shows the same headline rate as the hero and the
// rates panel — one pricing source throughout.

export function YachtPersistentBar({
  yachtId,
  headline,
  hasRate,
}: {
  yachtId: string;
  headline: string;
  hasRate: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const hero = document.getElementById("yacht-hero");
      const enquire = document.getElementById("enquire");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      let nearEnquire = false;
      if (enquire) {
        const r = enquire.getBoundingClientRect();
        nearEnquire = r.top < window.innerHeight && r.bottom > 0;
      }
      setVisible(heroBottom < 0 && !nearEnquire);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 104, behavior: "smooth" });
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061625]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(6,22,37,0.25)] backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg italic leading-tight text-white">{headline}</p>
          {!hasRate && <p className="text-xs text-white/60">Our team will confirm current rates</p>}
        </div>
        <button
          type="button"
          onClick={() => scrollTo("rates")}
          className="shrink-0 rounded-full border border-white/40 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Rates &amp; Dates
        </button>
        <button
          type="button"
          onClick={() => {
            trackEvent("yacht_proposal_click", { yacht_id: yachtId, source: "persistent_bar" });
            scrollTo("enquire");
          }}
          className="shrink-0 rounded-full bg-[#EE9739] px-4 py-2.5 text-sm font-bold text-[#061625] shadow-lg transition-colors hover:bg-[#EA6F33]"
        >
          Enquire Now
        </button>
      </div>
    </div>
  );
}
