"use client";

import { YachtHoldRequestForm } from "./YachtHoldRequestForm";
import type { CharterDateSelection } from "@/lib/hold-request";
import { YachtAvailabilityCalendar } from "./YachtAvailabilityCalendar";
import { money, type PricingSummary } from "@/lib/yacht-pricing";
import type { SeasonRate } from "@/lib/yacht-detail";
import type { YachtAvailability } from "@/lib/yacht-content";
import { ArrowRight, CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  yachtId: string;
  pricing: PricingSummary;
  availability: YachtAvailability;
  canRequestHold?: boolean;
};

function GuestRateTable({ season }: { season: SeasonRate }) {
  return (
    <details className="mt-3 border-t border-[#061625]/10 pt-3">
      <summary className="cursor-pointer text-sm font-semibold text-[#061625]">
        Weekly rates by guest count
      </summary>
      <table className="mt-2 w-full text-sm text-[#061625]">
        <caption className="sr-only">{season.title} weekly rates by guest count</caption>
        <thead>
          <tr className="border-b border-[#061625]/10">
            <th className="py-2 text-left font-medium" scope="col">Guests</th>
            <th className="py-2 text-right font-medium" scope="col">
              Weekly rate{season.currency ? ` (${season.currency})` : ""}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#061625]/10">
          {season.guestRates.map(({ guests, amount }) => (
            <tr key={guests}>
              <th className="py-1.5 text-left font-normal" scope="row">{guests}</th>
              <td className="py-1.5 text-right tabular-nums">
                {season.currency ? money(amount, season.currency) : amount.toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export function YachtPricingPanel({ yachtId, pricing, availability, canRequestHold = false }: Props) {
  const [showAllTerms, setShowAllTerms] = useState(false);
  const [holdDates, setHoldDates] = useState<CharterDateSelection | null>(null);
  const priced = pricing.seasons.filter((s) => s.price !== null || s.guestRates.length > 0);
  const unpriced = pricing.seasons.filter((s) => s.price === null && s.guestRates.length === 0);
  const charterNotes = new Map<string, string[]>();
  for (const { additionalRateDetails, title } of pricing.seasons) {
    if (!additionalRateDetails) continue;
    charterNotes.set(additionalRateDetails, [...(charterNotes.get(additionalRateDetails) ?? []), title]);
  }

  return (
    <section id="rates" className="scroll-mt-32 py-6 md:py-10">
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#EE9739]">Plan Your Charter</p>
        <h2 className="font-display text-3xl font-normal italic text-[#061625] md:text-4xl">Rates &amp; Availability</h2>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
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
                  {s.price && <dd className="mt-1 text-sm font-medium text-[#061625]">{s.price}</dd>}
                  {s.apa !== null && <dd className="mt-1 text-sm text-[#061625]">Plus {s.apa}% APA</dd>}
                  {s.area && <dd className="mt-1 text-xs text-[#061625]/60">{s.area}</dd>}
                  {s.guestRates.length > 0 && <dd><GuestRateTable season={s} /></dd>}
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
                    {s.apa !== null && <dd className="mt-1 text-sm text-[#061625]">Plus {s.apa}% APA</dd>}
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
            Request a charter proposal <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
              onSelectedDatesChange={setHoldDates}
              seasons={pricing.seasons.map(({ startDate, endDate, turnaroundHours }) => ({ startDate, endDate, turnaroundHours }))}
            />
          </div>
          <section
            className="mt-4 rounded-xl border border-[#061625]/15 bg-[#EE9739] p-4 text-[#061625] sm:p-5"
            aria-labelledby="request-hold-title"
          >
            <h3 id="request-hold-title" className="font-display text-xl italic">
              {canRequestHold ? "Request a hold" : "Ask about your charter dates"}
            </h3>
            <dl className="mt-3">
              <dt className="text-sm font-medium">Selected dates</dt>
              <dd className="mt-1 border-l-2 border-[#061625]/40 pl-3 text-sm font-medium">
                {holdDates?.label || (availability.hasLiveData || availability.ranges.length > 0 ? "Choose dates in the calendar" : "Calendar dates unavailable")}
              </dd>
            </dl>
            {canRequestHold && holdDates && holdDates.start < holdDates.end && (
              <YachtHoldRequestForm key={holdDates.label} yachtId={yachtId} dates={holdDates} />
            )}
            <p id="hold-submission-note" className="mt-3 text-sm">
              {canRequestHold
                ? "For pricing and itinerary ideas, request a personalized charter proposal."
                : "Our charter team will check availability and prepare a personalized proposal for your group."}
            </p>
            <a
              href="#enquire"
              aria-describedby="hold-submission-note"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#061625] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#061625]/85 focus-visible:ring-2 focus-visible:ring-[#061625] focus-visible:ring-offset-2 sm:w-auto"
            >
              Request a charter proposal
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </section>
          {charterNotes.size > 0 && (
            <details className="mt-5 rounded-lg border border-[#061625]/10 p-4 [overflow-wrap:anywhere]">
              <summary className="cursor-pointer text-sm font-semibold text-[#061625]">
                Charter rules &amp; rate notes
              </summary>
              <p className="mt-2 text-xs text-[#061625]/70">Please confirm any exceptions and holiday terms with our charter team.</p>
              {[...charterNotes].map(([notes, titles]) => (
                <div className="mt-3" key={notes}>
                  <p className="text-sm font-medium text-[#061625]">{[...new Set(titles)].join(" · ")}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#061625]/80">{notes}</p>
                </div>
              ))}
            </details>
          )}
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
