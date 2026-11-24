import { CalendarDays, ChevronDown, Check, FileText } from "lucide-react";
import { YachtAvailabilityCalendar } from "@/components/yacht/YachtAvailabilityCalendar";
import type { AvailabilityRange } from "@/lib/yacht-content";
import type { PricingSummary } from "@/lib/yacht-pricing";

// "Plan Your Charter — Rates & Availability" panel. Desktop: pricing left,
// live calendar right, shared actions below. Mobile: stacked in the same
// order the brief prescribes (headline rate, seasonal summary, calendar,
// expandable terms, CTA). Only CYA-supplied data renders; a season without a
// price still shows its dates and terms rather than an invented figure.

export type YachtPricingPanelProps = {
  yachtId: string;
  name: string;
  pricing: PricingSummary;
  availability: {
    ranges: AvailabilityRange[];
    lastUpdated: string | null;
    hasLiveData: boolean;
  };
};

export function YachtPricingPanel({ yachtId, name, pricing, availability }: YachtPricingPanelProps) {
  const { headline, hasRate, seasons, hasTerms } = pricing;
  const pricedSeasons = seasons.filter((s) => s.price !== null);
  const unpricedSeasons = seasons.filter((s) => s.price === null);
  const hasContent = seasons.length > 0 || hasRate;

  return (
    <section id="rates" className="mt-14 scroll-mt-32">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#EE9739]">Plan Your Charter</p>
      <h2 className="mb-6 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Rates &amp; Availability
      </h2>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#061625]/5">
        <div className="grid lg:grid-cols-2">
          {/* Pricing column */}
          <div className="border-b border-[#061625]/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#061625]/60">
              {name} — indicative weekly rate
            </p>
            <p className="mt-2 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">{headline}</p>
            <p className="mt-2 text-sm text-[#061625]/60">
              Indicative only, subject to confirmation. Your final quotation depends on dates, guest count and
              charter terms.
            </p>

            {pricedSeasons.length > 0 && (
              <dl className="mt-6 space-y-3">
                {pricedSeasons.map((season, i) => (
                  <div key={`priced-${i}`} className="rounded-xl bg-[#f8f7f4] p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <dt className="font-display text-lg italic text-[#061625]">{season.title}</dt>
                      <dd className="font-medium text-[#061625]">{season.price}</dd>
                    </div>
                    {season.dates && <p className="mt-0.5 text-xs text-[#061625]/60">{season.dates}</p>}
                    {(season.basePort || season.charterType) && (
                      <p className="mt-1 text-xs text-[#061625]/60">
                        {[season.charterType, season.basePort ? `From ${season.basePort}` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </dl>
            )}

            {unpricedSeasons.length > 0 && (
              <div className="mt-4 space-y-2">
                {unpricedSeasons.map((season, i) => (
                  <details key={`unpriced-${i}`} className="group rounded-xl bg-[#f8f7f4] p-4">
                    <summary className="flex cursor-pointer items-center justify-between gap-3">
                      <span>
                        <span className="font-display text-lg italic text-[#061625]">{season.title}</span>
                        {season.dates && <span className="mt-0.5 block text-xs text-[#061625]/60">{season.dates}</span>}
                      </span>
                      <span className="shrink-0 text-sm font-medium text-[#EE9739]">Rates on request</span>
                    </summary>
                    {(season.charterType || season.basePort || season.terms) && (
                      <div className="mt-3 border-t border-[#061625]/10 pt-3 text-sm text-[#061625]/80">
                        {season.terms && <p className="whitespace-pre-line">{season.terms}</p>}
                      </div>
                    )}
                  </details>
                ))}
              </div>
            )}

            {/* Expandable full terms — no duplication of the seasonal summary above */}
            {(hasTerms || pricedSeasons.some((s) => s.terms || s.area || s.pickup)) && (
              <details className="group mt-5 rounded-xl border border-[#061625]/10 p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#061625]">
                    <FileText className="h-4 w-4 text-[#EE9739]" aria-hidden="true" />
                    View Full Charter Rates &amp; Terms
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-[#EE9739] transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-4 space-y-4 border-t border-[#061625]/10 pt-4">
                  {seasons.map((season, i) =>
                    season.terms || season.area || season.pickup || season.details ? (
                      <div key={`terms-${i}`}>
                        <p className="font-display text-base italic text-[#061625]">{season.title}</p>
                        <dl className="mt-1.5 space-y-1.5 text-sm">
                          {season.area && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-[#061625]/60">Cruising region</dt>
                              <dd className="text-right text-[#061625]">{season.area}</dd>
                            </div>
                          )}
                          {season.pickup && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-[#061625]/60">Preferred pickup</dt>
                              <dd className="text-right text-[#061625]">{season.pickup}</dd>
                            </div>
                          )}
                          {season.terms && (
                            <div>
                              <dt className="text-[#061625]/60">Terms</dt>
                              <dd className="mt-1 whitespace-pre-line text-[#061625]">{season.terms}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    ) : null
                  )}
                </div>
              </details>
            )}

            {!hasContent && (
              <p className="mt-6 rounded-xl bg-[#f8f7f4] p-4 text-sm text-[#061625]/75">
                Full rate details for {name} are not published in our live feed yet. Enquire and our charter team
                will prepare the complete rate schedule for your dates.
              </p>
            )}

            <a
              href="#enquire"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#EE9739] px-7 py-3.5 text-base font-bold uppercase tracking-wide text-[#061625] shadow-lg transition-colors hover:bg-[#EA6F33] sm:w-auto"
            >
              Enquire About This Yacht
            </a>
          </div>

          {/* Availability column */}
          <div className="p-6 md:p-8" id="availability">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#EE9739]" aria-hidden="true" />
              <h3 className="font-display text-xl italic text-[#061625]">Live availability</h3>
            </div>
            <YachtAvailabilityCalendar
              yachtId={yachtId}
              ranges={availability.ranges}
              lastUpdated={availability.lastUpdated}
              hasLiveData={availability.hasLiveData}
            />
            <ul className="mt-4 space-y-1.5 text-sm text-[#061625]/70">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#337891]" aria-hidden="true" />
                Dates shown reflect confirmed records on file and are re-checked with you before any commitment.
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#337891]" aria-hidden="true" />
                Select your dates on the calendar and they carry straight into your enquiry.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
