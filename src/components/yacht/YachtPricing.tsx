import { TrackedCta } from "@/components/yacht/TrackedCta";
import { atlas } from "@/lib/managed-yachts";
import { formatPrice } from "@/lib/data";

export function YachtPricing() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#102A43] text-white shadow-2xl">
          <div className="p-8 text-center sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A46D]">Charter Pricing</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.2] sm:text-4xl">Your Private Charter Aboard ATLAS</h2>

            {atlas.ratesVerified ? (
              <dl className="mt-10 grid gap-6 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 p-6">
                  <dt className="text-sm text-white/80">Standard charter rate</dt>
                  <dd className="mt-2 font-display text-3xl font-semibold">From {formatPrice(atlas.standardWeeklyRateUsd)} <span className="text-base font-normal text-white/80">per week</span></dd>
                </div>
                <div className="rounded-2xl border border-white/15 p-6">
                  <dt className="text-sm text-white/80">Holiday charter rate</dt>
                  <dd className="mt-2 font-display text-3xl font-semibold">From {formatPrice(atlas.holidayWeeklyRateUsd)} <span className="text-base font-normal text-white/80">per week</span></dd>
                </div>
                <div className="rounded-2xl border border-white/15 p-6">
                  <dt className="text-sm text-white/80">Minimum duration</dt>
                  <dd className="mt-2 font-display text-3xl font-semibold">{atlas.minimumNights} nights</dd>
                </div>
              </dl>
            ) : (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.5] text-white/90">
                Current charter rates for ATLAS depend on your dates and requirements, so our charter team confirms them directly with you.
              </p>
            )}

            <div className="mx-auto mt-10 max-w-2xl space-y-4 text-left text-[15px] leading-[1.5] text-white/90">
              <p>
                Your MCC charter specialist will prepare a personalized quotation based on your dates, guest numbers and charter requirements.
              </p>
              <p>
                The quotation will explain the applicable charter package, inclusions, exclusions and booking terms. ATLAS charters are not automatically all-inclusive.
              </p>
            </div>

            <div className="mt-10 flex justify-center">
              <TrackedCta
                href="#enquire"
                label={atlas.ratesVerified ? "Request your ATLAS charter proposal" : "Request current charter rates"}
                yachtSlug={atlas.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
