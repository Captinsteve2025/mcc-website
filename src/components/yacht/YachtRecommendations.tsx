import { customerClassLabel, type ScoredCandidate } from "@/lib/similar-yachts";
import { money } from "@/lib/yacht-pricing";
import { ArrowRight, BedDouble, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { YachtPhoto } from "./YachtPhoto";

type Props = {
  strictMatches: ScoredCandidate[];
  broaderMatches: ScoredCandidate[];
  searchQuery: string;
};

function RecommendationCard({ match, broader, searchQuery }: {
  match: ScoredCandidate;
  broader: boolean;
  searchQuery: string;
}) {
  const { candidate, regionMatches, weeklyRate } = match;
  const href = `/charter-yachts/${candidate.id}${searchQuery ? `?${searchQuery}` : ""}`;
  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-48 w-full overflow-hidden bg-[#061625]/10">
        {candidate.image ? (
          <YachtPhoto src={candidate.image} alt={candidate.name} />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#061625]/60">
            Photo not available
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 [overflow-wrap:anywhere]">
        {broader && <p className="mb-2 text-xs font-semibold text-[#337891]">Broader alternative</p>}
        <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">{customerClassLabel(candidate.rawType)}</p>
        <h3 className="mt-1 font-display text-xl italic text-[#061625]">{candidate.name}</h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#061625]/70">
          {candidate.lengthFt !== null && (
            <li>{Math.round(candidate.lengthFt)} ft</li>
          )}
          {candidate.guests !== null && (
            <li className="flex items-center gap-1.5">
              <Users className="h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" /> Sleeps {candidate.guests}
            </li>
          )}
          {candidate.cabins !== null && (
            <li className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" /> {candidate.cabins} cabin{candidate.cabins === 1 ? "" : "s"}
            </li>
          )}
        </ul>
        {regionMatches[0] && (
          <p className="mt-3 flex items-start gap-1.5 text-sm text-[#061625]/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" />
            <span>Shared cruising area: {regionMatches[0]}</span>
          </p>
        )}
        <div className="mt-auto pt-4">
          <p className="font-display text-lg italic text-[#061625]">
            From {money(weeklyRate.amount, weeklyRate.currency)} {weeklyRate.currency} <span className="font-sans text-xs not-italic text-[#061625]/60">/ week</span>
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#061625] transition-colors group-hover:text-[#EA6F33]">
            Explore Yacht <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function YachtRecommendations({ strictMatches, broaderMatches, searchQuery }: Props) {
  const matches = [
    ...strictMatches.map((match) => ({ match, broader: false })),
    ...broaderMatches.map((match) => ({ match, broader: true })),
  ];
  if (matches.length === 0) return null;

  return (
    <section id="similar-yachts" aria-labelledby="similar-yachts-heading" className="container mx-auto mt-14 px-4 pb-24">
      <h2 id="similar-yachts-heading" className="font-display text-3xl font-normal italic text-[#061625] md:text-4xl">Similar Yachts</h2>
      <p className="mt-3 max-w-2xl text-sm text-[#061625]/70">
        Weekly rates are indicative. Availability for your dates is confirmed separately.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map(({ match, broader }) => (
          <li key={match.candidate.id} className="min-w-0">
            <RecommendationCard match={match} broader={broader} searchQuery={searchQuery} />
          </li>
        ))}
      </ul>
    </section>
  );
}
