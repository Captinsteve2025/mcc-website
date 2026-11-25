"use client";

import { Anchor } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function YachtCtaButtons({
  yachtId,
  hasLiveData = false,
}: {
  yachtId: string;
  hasLiveData?: boolean;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5 lg:mt-0">
      <a
        href="#enquire"
        onClick={() => trackEvent("yacht_proposal_click", { yacht_id: yachtId })}
        className="inline-flex min-h-11 items-center rounded-full bg-[#EE9739] px-5 text-sm font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33] focus-visible:ring-2 focus-visible:ring-white"
      >
        Request a charter proposal
      </a>
      <a
        href="#rates"
        onClick={() => trackEvent("yacht_rates_view", { yacht_id: yachtId, has_records: hasLiveData })}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
      >
        <Anchor className="h-4 w-4" aria-hidden="true" />
        View rates &amp; availability
      </a>
    </div>
  );
}
