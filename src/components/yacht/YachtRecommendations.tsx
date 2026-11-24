import Link from "next/link";
import { ArrowRight, BedDouble, Ruler, Users } from "lucide-react";
import { YachtPhoto } from "@/components/yacht/YachtPhoto";
import type { Yacht as CyaCatalogueYacht } from "@/lib/cya";
import { findSimilarYachts } from "@/lib/similar-yachts";

// "Discover More Exceptional Yachts" — deterministic recommendations computed
// server-side from catalogue records the render already has (no extra CYA
// request). Server-rendered, crawlable links; one image per card, lazy-loaded
// below the fold. Desktop: 3 cards; mobile: swipeable carousel with a partial
// next-card preview.

function formatRate(minPriceUsd: number | null, minPrice: number | null, currency: string | null): string | null {
  if (minPriceUsd !== null && minPriceUsd > 0) {
    return `From $${Math.round(minPriceUsd).toLocaleString("en-US")} / week`;
  }
  if (minPrice !== null && minPrice > 0 && currency) {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "\u20ac" : currency === "GBP" ? "\u00a3" : `${currency} `;
    return `From ${symbol}${Math.round(minPrice).toLocaleString("en-US")} / week`;
  }
  return null;
}

export function YachtRecommendations({
  subject,
  catalogue,
}: {
  subject: {
    id: string;
    type: string | null;
    length: number | null;
    guests: number | null;
    minPrice: number | null;
    currency: string | null;
    minPriceUsd: number | null;
    areas: string[];
  };
  catalogue: CyaCatalogueYacht[];
}) {
  const recommendations = findSimilarYachts(subject, catalogue, { limit: 3 });
  if (recommendations.length === 0) return null;

  return (
    <section className="mt-16 scroll-mt-32" aria-label="Similar yachts you may also like">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#EE9739]">You May Also Like</p>
      <h2 className="mb-2 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Discover More Exceptional Yachts
      </h2>
      <p className="mb-8 max-w-2xl leading-relaxed text-[#061625]/70">
        Selected for their similarity in style, size, cruising region and rates.
      </p>

      <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {recommendations.map(({ candidate }) => {
          const rate = formatRate(candidate.minPriceUsd, candidate.minPrice, candidate.currency);
          return (
            <li
              key={candidate.id}
              className="flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#061625]/5 transition-shadow hover:shadow-lg sm:w-[55%] md:w-auto md:shrink"
            >
              <Link
                href={`/charter-yachts/${candidate.id}`}
                className="relative block aspect-[4/3] overflow-hidden bg-[#061625]/10"
                aria-label={`Explore ${candidate.name}`}
              >
                {candidate.image ? (
                  <YachtPhoto src={candidate.image} alt={candidate.name} />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#061625]/50">
                    Photo not available
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-normal italic text-[#061625]">
                  <Link href={`/charter-yachts/${candidate.id}`} className="transition-colors hover:text-[#EE9739]">
                    {candidate.name}
                  </Link>
                </h3>
                <p className="mt-0.5 text-sm text-[#061625]/70">{candidate.type ?? "Charter yacht"}</p>
                <ul className="mt-3 space-y-1 text-sm text-[#061625]/80">
                  {candidate.length !== null && (
                    <li className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-[#EE9739]" aria-hidden="true" />
                      {candidate.length} {candidate.lengthUnit ?? "ft"}
                    </li>
                  )}
                  {candidate.guests !== null && (
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#EE9739]" aria-hidden="true" />
                      Up to {candidate.guests} guests
                    </li>
                  )}
                  {candidate.cabins !== null && (
                    <li className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-[#EE9739]" aria-hidden="true" />
                      {candidate.cabins} cabin{candidate.cabins === 1 ? "" : "s"}
                    </li>
                  )}
                </ul>
                <p className="mt-3 font-display text-lg italic text-[#061625]">
                  {rate ?? <span className="text-[#061625]/70">Rates on request</span>}
                </p>
                <div className="mt-auto pt-4">
                  <Link
                    href={`/charter-yachts/${candidate.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#EE9739] px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#EA6F33]"
                  >
                    Explore Yacht <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        <Link
          href="/charter-yachts"
          className="inline-flex items-center gap-2 rounded-full border border-[#061625]/20 px-6 py-3 text-sm font-semibold text-[#061625] transition-colors hover:border-[#EE9739] hover:bg-[#EE9739]/10"
        >
          Explore All Charter Yachts <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
