"use client";

import { YachtAvailabilityCalendar } from "./YachtAvailabilityCalendar";
import type { PricingSummary } from "@/lib/yacht-pricing";
import type { YachtAvailability } from "@/lib/yacht-content";
import { ArrowRight, CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  yachtId: string;
  name: string;
  pricing: PricingSummary;
  availability: YachtAvailability;
};

// "Plan Your Charter" panel: published CYA rates beside the live availability
// calendar. Only seasons CYA actually prices are shown as priced; unpriced
// seasons display as "Rates on request". Nothing is invented.
export function YachtPricingPanel({ yachtId, pricing, availability }: Props) {
  const [showAllTerms, setShowAllTerms] = useState(false);
  const priced = pricing.seasons.filter((s) => s.price !== null);
  const unpriced = pricing.seasons.filter((s) => s.price === null);

  return (
    <section id="rates" className="scroll-mt-32 py-6 md:py-10">
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#EE9739]">Plan Your Charter</p>
        <h2 className="font-display text-3xl font-normal italic text-[#061625] md:text-4xl">Rates &amp; Availability</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#EE9739]" aria-hidden="true" />
            <div>
              <p className="font-display text-2xl italic text-[#061625]">{pricing.headline}</p>
              <p className="mt-1 text-xs text-[#061625]/60">Indicative weekly rate — subject to confirmation</p>
            </div>
          </div>

          {priced.length > 0 && (
            <dl className="mb-6 space-y-3">
              {priced.map((s) => (
                <div key={s.title + (s.dates ?? "")} className="rounded-lg bg-[#061625]/5 p-4">
                  <dt className="text-sm font-medium text-[#061625]">
                    {s.title}
                    {s.category && <span className="ml-2 text-xs font-normal text-[#061625]/60">{s.category}</span>}
                  </dt>
                  {s.dates && <dd className="mt-0.5 text-xs text-[#061625]/60">{s.dates}</dd>}
                  <dd className="mt-1 text-sm font-medium text-[#061625]">{s.price}</dd>
                  {s.area && <dd className="mt-1 text-xs text-[#061625]/60">{s.area}</dd>}
                </div>
              ))}
            </dl>
          )}

          {unpriced.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-[#061625]">Other seasons</p>
              <dl className="space-y-3">
                {unpriced.map((s) => (
                  <div key={s.title + (s.dates ?? "")} className="rounded-lg bg-[#061625]/5 p-4">
                    <dt className="text-sm font-medium text-[#061625]">{s.title}</dt>
                    {s.dates && <dd className="mt-0.5 text-xs text-[#061625]/60">{s.dates}</dd>}
                    <dd className="mt-1 text-sm italic text-[#061625]/70">Rates on request</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {pricing.seasons.length === 0 && (
            <p className="mb-6 rounded-lg bg-[#061625]/5 p-4 text-sm italic text-[#061625]/70">
              CYA publishes no seasonal rate breakdown for this yacht. Enquire for a personal quotation.
            </p>
          )}

          {pricing.hasTerms && (
            <div>
              <button
                type="button"
                onClick={() => setShowAllTerms((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-[#061625]/10 px-4 py-3 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
                aria-expanded={showAllTerms}
              >
                View Full Charter Rates &amp; Terms
                <ChevronDown className={`h-4 w-4 transition-transform ${showAllTerms ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {showAllTerms && (
                <div className="mt-3 space-y-4">
                  {pricing.seasons
                    .filter((s) => s.terms)
                    .map((s) => (
                      <div key={s.title + "-terms"}>
                        <p className="text-sm font-medium text-[#061625]">{s.title}</p>
                        <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#061625]/70">{s.terms}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <a
            href="#enquire"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#061625] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#061625]/85"
          >
            Enquire About This Yacht <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-[#EE9739]" aria-hidden="true" />
            <div>
              <p className="font-display text-2xl italic text-[#061625]">Live availability</p>
              <p className="mt-1 text-xs text-[#061625]/60">Confirmed bookings and holds from the yacht&apos;s calendar</p>
            </div>
          </div>
          <div id="availability" className="scroll-mt-32">
            <YachtAvailabilityCalendar
              yachtId={yachtId}
              ranges={availability.ranges}
              lastUpdated={availability.lastUpdated}
              hasLiveData={availability.hasLiveData}
            />
          </div>
          <ul className="mt-6 space-y-2 text-xs text-[#061625]/70">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#EE9739]" aria-hidden="true" />
              Confirmed bookings show as booked; active holds show as held.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#061625]/30" aria-hidden="true" />
              Availability is re-checked with you personally before any commitment.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
