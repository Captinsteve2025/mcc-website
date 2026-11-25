"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export type SectionTab = { id: string; label: string };

// Sticky in-page navigation below the yacht intro. Tabs are passed in already
// filtered to sections that contain real data. Smooth-scrolls with the fixed
// header offset; highlights the section in view.
export function YachtSectionNav({ tabs, yachtId }: { tabs: SectionTab[]; yachtId: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const headerOffset = 112;
    const observers: IntersectionObserver[] = [];
    for (const tab of tabs) {
      const el = document.getElementById(tab.id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(tab.id);
          }
        },
        { rootMargin: `-${headerOffset}px 0px -60% 0px` }
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [tabs]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top: y, behavior: "smooth" });
    if (id === "rates") trackEvent("yacht_rates_view", { yacht_id: yachtId });
  };

  return (
    <nav
      aria-label="Yacht sections"
      className="sticky top-16 z-30 mb-6 border-b border-[#061625]/10 bg-[#f8f7f4]/95 backdrop-blur-sm"
    >
      <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-1 [justify-content:safe_center]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => jump(tab.id)}
            aria-current={active === tab.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.id
                ? "bg-[#061625] text-white"
                : "text-[#061625]/70 hover:bg-[#061625]/5 hover:text-[#061625]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            trackEvent("yacht_proposal_click", { yacht_id: yachtId });
            const el = document.getElementById("enquire");
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 104, behavior: "smooth" });
          }}
          className="ml-2 shrink-0 rounded-full bg-[#EE9739] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#061625] transition-colors hover:bg-[#EA6F33]"
        >
          Request a charter proposal
        </button>
      </div>
    </nav>
  );
}
