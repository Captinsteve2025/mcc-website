import { TrackedCta } from "@/components/yacht/TrackedCta";
import { type ManagedYacht } from "@/lib/managed-yachts";

export function YachtPricing({ yacht }: { yacht: ManagedYacht }) {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-[#061625] p-8 text-center text-white shadow-2xl sm:p-12">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80">Charter Pricing</p>
          <h2 className="mb-4 font-display text-4xl font-normal italic leading-[1.2] md:text-5xl">Your Private Charter Aboard {yacht.name}</h2>
          <div className="mx-auto my-6 h-px w-16 bg-[#e89d79]" aria-hidden="true" />

          {yacht.displayRate || yacht.minimumNights ? (
            <dl className="mt-8 grid gap-6 text-left sm:grid-cols-2">
              {yacht.displayRate && (
                <div className="rounded-lg border border-white/15 p-6">
                  <dt className="text-sm text-white/80">Charter rate</dt>
                  <dd className="mt-2 font-display text-3xl italic">{yacht.displayRate}</dd>
                </div>
              )}
              {yacht.minimumNights && (
                <div className="rounded-lg border border-white/15 p-6">
                  <dt className="text-sm text-white/80">Minimum duration</dt>
                  <dd className="mt-2 font-display text-3xl italic">{yacht.minimumNights} nights</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Current charter rates for {yacht.name} depend on your dates and requirements, so our charter team confirms them directly with you.
            </p>
          )}

          <div className="mx-auto mt-10 max-w-2xl space-y-4 text-left text-[15px] leading-[1.6] text-white/90">
            <p>Your MCC charter specialist will prepare a personalized quotation based on your dates, guest numbers and charter requirements.</p>
            <p>The quotation will explain the applicable charter package, inclusions, exclusions and booking terms. Charters are not automatically all-inclusive.</p>
          </div>

          <div className="mt-10 flex justify-center">
            <TrackedCta
              href="#enquire"
              label={yacht.displayRate ? `Request your ${yacht.name} charter proposal` : "Request current charter rates"}
              eventName={`${yacht.slug}_pricing_click`}
              yachtSlug={yacht.slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
