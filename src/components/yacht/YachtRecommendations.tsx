import { customerClassLabel, type ScoredCandidate } from "@/lib/similar-yachts";
import { money } from "@/lib/yacht-pricing";
import { ArrowRight, BedDouble, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  strictMatches: ScoredCandidate[];
  broaderMatches: ScoredCandidate[];
};

function RateLine({ candidate }: { candidate: ScoredCandidate["candidate"] }) {
  const price = candidate.minPriceUsd ?? candidate.minPrice;
  if (price === null) return <span className="text-sm italic text-[#061625]/60">Rates on request</span>;
  const currency = candidate.minPriceUsd !== null ? "USD" : candidate.currency;
  return (
    <>
      <span className="font-display text-lg italic text-[#EE9739]">From {money(price, currency)}</span>
      <span className="text-xs text-[#061625]/50"> / week</span>
    </>
  );
}

function RecommendationCard({ match }: { match: ScoredCandidate }) {
  const { candidate, regionMatches } = match;
  const region = regionMatches[0] ?? candidate.regions[0] ?? null;
  return (
    <Link
      href={`/charter-yachts/${candidate.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden bg-[#061625]/10">
        {candidate.image ? (
          <Image
            src={candidate.image}
            alt={candidate.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl italic text-[#061625]/30">
            {candidate.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/50">{customerClassLabel(candidate.rawType)}</p>
        <h3 className="mt-1 font-display text-xl italic text-[#061625]">{candidate.name}</h3>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#061625]/70">
          {candidate.lengthFt !== null && (
            <div className="flex items-center gap-1.5">
              {Math.round(candidate.lengthFt)} ft
            </div>
          )}
          {candidate.guests !== null && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#EE9739]" aria-hidden="true" /> Up to {candidate.guests}
            </div>
          )}
          {candidate.cabins !== null && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-[#EE9739]" aria-hidden="true" /> {candidate.cabins} cabin{candidate.cabins === 1 ? "" : "s"}
            </div>
          )}
        </dl>
        {region && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[#061625]/70">
            <MapPin className="h-4 w-4 text-[#EE9739]" aria-hidden="true" /> {region}
          </p>
        )}
        <div className="mt-auto pt-4">
          <RateLine candidate={candidate} />
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#061625] transition-colors group-hover:text-[#EA6F33]">
            Explore Yacht <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// "Discover More" section: only genuinely eligible yachts are shown. Strict
// matches render unlabelled; when the controlled fallback widened price and
// length tolerance (never class, region or guests), those cards carry a
// distinct label. Fewer than three — or none — is an honest outcome; nothing
// is forced.
export function YachtRecommendations({ strictMatches, broaderMatches }: Props) {
  return (
    <section className="mt-14">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#EE9739]">Discover More</p>
      <h2 className="mt-1 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">Similar Yachts You May Also Love</h2>

      {strictMatches.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {strictMatches.map((match) => (
            <RecommendationCard key={match.candidate.id} match={match} />
          ))}
        </div>
      )}

      {strictMatches.length === 0 && broaderMatches.length > 0 && (
        <p className="mt-4 max-w-2xl text-sm text-[#061625]/70">
          No yachts match this one closely on rates and size. These nearby options share its class and cruising
          region, with a wider spread of rates and lengths.
        </p>
      )}

      {broaderMatches.length > 0 && (
        <div className="mt-6">
          {strictMatches.length > 0 && (
            <>
              <h3 className="font-display text-xl italic text-[#061625]">Broader alternatives</h3>
              <p className="mt-1 text-sm text-[#061625]/70">
                Same class and cruising region, but outside the closest rate and size range.
              </p>
            </>
          )}
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {broaderMatches.map((match) => (
              <RecommendationCard key={match.candidate.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {strictMatches.length === 0 && broaderMatches.length === 0 && (
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-[#061625]/80">
            We haven&apos;t yet curated alternatives that genuinely match this yacht. Our team can personally
            recommend yachts suited to your party and dates.
          </p>
          <a
            href="#enquire"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#061625] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#061625]/85"
          >
            Ask MCC for a Recommendation <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
