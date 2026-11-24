"use client";

import { Anchor } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Hero CTAs: primary "Enquire About This Yacht" (peach) scrolls to the
// enquiry form; secondary outlined "View Rates & Availability" scrolls to the
// rates panel. On mobile the actions live in the text link plus the persistent
// bottom bar, so the hero keeps a single understated link.

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
    <div className="mt-3 lg:mt-0">
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => {
            trackEvent("yacht_proposal_click", { yacht_id: yachtId });
            scrollTo("enquire");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#EE9739] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#061625] shadow-xl transition-colors hover:bg-[#EA6F33]"
        >
          Enquire About This Yacht
        </button>
        <button
          type="button"
          onClick={() => {
            trackEvent("yacht_rates_view", { yacht_id: yachtId });
            scrollTo("rates");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
        >
          <Anchor className="h-4 w-4" aria-hidden="true" />
          View Rates &amp; Availability
        </button>
      </div>
      <a
        href="#rates"
        onClick={() => trackEvent("yacht_rates_view", { yacht_id: yachtId, has_records: hasLiveData })}
        className="text-sm font-medium text-[#EE9739] underline underline-offset-4 transition-colors hover:text-white md:hidden"
      >
        See rates and live availability below
      </a>
    </div>
  );
}
