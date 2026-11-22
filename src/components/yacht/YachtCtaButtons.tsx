"use client";

import { Anchor } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Primary and secondary CTAs beside the yacht name. The secondary button only
// scrolls to the public availability calendar — never the enquiry form. When
// live calendar data is unavailable the secondary action reads "Check Dates"
// and scrolls to the availability block (compact message + enquiry action).
/* Hero CTAs: full buttons on desktop; an understated text link on mobile,
 * where the fixed bottom bar already carries both actions. */
export function YachtCtaButtons({
  yachtId,
  hasLiveData = false,
}: {
  yachtId: string;
  hasLiveData?: boolean;
}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 104, behavior: "smooth" });
  };

  return (
    <div className="mt-6">
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => {
            trackEvent("yacht_proposal_click", { yacht_id: yachtId });
            scrollTo("enquire");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#EE9739] px-7 py-3.5 text-base font-bold uppercase tracking-wide text-[#061625] shadow-xl transition-colors hover:bg-[#EA6F33]"
        >
          Get My Charter Proposal
        </button>
        <button
          type="button"
          onClick={() => scrollTo("availability")}
          className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
        >
          <Anchor className="h-4 w-4" aria-hidden="true" />
          {hasLiveData ? "View Availability" : "Check Dates"}
        </button>
      </div>
      <a
        href="#availability"
        onClick={() => trackEvent("yacht_availability_view", { yacht_id: yachtId, has_records: hasLiveData })}
        className="text-sm font-medium text-[#EE9739] underline underline-offset-4 transition-colors hover:text-white md:hidden"
      >
        {hasLiveData ? "View live availability below" : "Check available dates below"}
      </a>
    </div>
  );
}

// Mobile sticky bottom bar: availability browsing and the primary proposal
// action, without obscuring the form fields (auto-hidden while the enquiry
// form's fields are in view via CSS is out of scope; the bar sits above the
// safe area and the form adds bottom padding).
export function YachtMobileActionBar({ yachtId, hasLiveData = false }: { yachtId: string; hasLiveData?: boolean }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 104, behavior: "smooth" });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061625]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(6,22,37,0.25)] backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => scrollTo("availability")}
          className="flex-1 rounded-full border border-white/40 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          {hasLiveData ? "View Availability" : "Check Dates"}
        </button>
        <button
          type="button"
          onClick={() => {
            trackEvent("yacht_proposal_click", { yacht_id: yachtId });
            scrollTo("enquire");
          }}
          className="flex-1 rounded-full bg-[#EE9739] px-4 py-2.5 text-sm font-bold text-[#061625] shadow-lg transition-colors hover:bg-[#EA6F33]"
        >
          Get My Proposal
        </button>
      </div>
    </div>
  );
}
