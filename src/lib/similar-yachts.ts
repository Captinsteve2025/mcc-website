import type { Yacht as CyaCatalogueYacht } from "@/lib/cya";

// Deterministic similar-yacht recommendations over the CYA catalogue records
// the page render already has. No extra CYA request is made per page load:
// the caller passes catalogue rows fetched once (the Next fetch cache shares
// them across renders anyway).
//
// Scoring weights (centrally configurable):
//   pricing 30%, cruising region 25%, type 20%, guests 15%, length 10%.
// Missing data never scores as zero — each factor is normalised against the
// candidates for which that factor is known, and unknown factors are excluded
// from the weighted sum so a yacht with no price is not punished.

export const SIMILARITY_WEIGHTS = {
  pricing: 0.3,
  region: 0.25,
  type: 0.2,
  guests: 0.15,
  length: 0.1,
} as const;

export type RecommendationCandidate = {
  id: string;
  name: string;
  type: string | null;
  length: number | null;
  lengthUnit: string | null;
  guests: number | null;
  cabins: number | null;
  /** Catalogue starting price in the yacht's own currency. */
  minPrice: number | null;
  currency: string | null;
  /** Catalogue USD-normalised starting price, when CYA supplies one. */
  minPriceUsd: number | null;
  areas: string[];
  image: string | null;
  /** CYA's own active flag when present; anything not actively true is excluded. */
  active: boolean;
};

export type Recommendation = {
  candidate: RecommendationCandidate;
  score: number;
  /** Per-factor scores for the register/report (0..1 each, null = unknown). */
  factors: {
    pricing: number | null;
    region: number | null;
    type: number | null;
    guests: number | null;
    length: number | null;
  };
};

function toCandidate(yacht: CyaCatalogueYacht): RecommendationCandidate | null {
  const id = typeof yacht.id === "string" ? yacht.id : "";
  const name = typeof yacht.yachtName === "string" ? yacht.yachtName.trim() : "";
  if (!id || !name) return null;
  // Exclude anything CYA marks inactive (field absent is treated as active —
  // the catalogue itself only returns listed yachts).
  if (yacht.active === false || yacht.status === "inactive") return null;
  const image = typeof yacht.image === "string" && yacht.image.startsWith("https://") ? yacht.image : null;
  const areas = Array.isArray(yacht.seasonAreas)
    ? yacht.seasonAreas
        .map((a) => (typeof a === "string" ? a : a && typeof a === "object" ? String((a as Record<string, unknown>).label ?? (a as Record<string, unknown>).name ?? "") : ""))
        .filter(Boolean)
    : [];
  return {
    id,
    name,
    type: typeof yacht.yachtType === "string" ? yacht.yachtType : null,
    length: typeof yacht.length === "number" ? yacht.length : null,
    lengthUnit: typeof yacht.units === "string" ? yacht.units : null,
    guests: typeof yacht.pax === "number" ? yacht.pax : null,
    cabins: typeof yacht.cabins === "number" ? yacht.cabins : null,
    minPrice: typeof yacht.min_price === "number" ? yacht.min_price : null,
    currency: typeof yacht.currency === "string" ? yacht.currency : null,
    minPriceUsd: typeof yacht.min_price_usd === "number" ? yacht.min_price_usd : null,
    areas,
    image,
    active: true,
  };
}

function normaliseType(type: string | null): string {
  const t = (type ?? "").toLowerCase();
  if (t.includes("power cat") || t.includes("powercat")) return "power-catamaran";
  if (t.includes("catamaran")) return "catamaran";
  if (t.includes("motor") || t.includes("power") || t.includes("trawler")) return "motor";
  if (t.includes("sail") || t.includes("mono") || t.includes("yacht")) return "monohull";
  return "other";
}

function regionOverlap(a: string[], b: string[]): number | null {
  if (a.length === 0 || b.length === 0) return null;
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const bs = b.map(norm);
  let matched = 0;
  for (const area of a) {
    const n = norm(area);
    if (bs.some((x) => x.includes(n) || n.includes(x))) matched += 1;
  }
  return matched / Math.max(a.length, 1);
}

// Pricing compares only like with like: USD-normalised prices when both
// yachts carry one, otherwise raw prices only when the currency matches.
// Missing or incomparable pricing yields null (excluded from the weighted
// average), never zero.
function pricingCloseness(subject: RecommendationCandidate, other: RecommendationCandidate): number | null {
  let a: number | null = null;
  let b: number | null = null;
  if (subject.minPriceUsd !== null && other.minPriceUsd !== null) {
    a = subject.minPriceUsd;
    b = other.minPriceUsd;
  } else if (subject.minPrice !== null && other.minPrice !== null && subject.currency === other.currency && subject.currency) {
    a = subject.minPrice;
    b = other.minPrice;
  }
  if (a === null || b === null || a <= 0 || b <= 0) return null;
  // 1.0 at identical rates, falling smoothly; anything beyond 4x apart ~0.
  return Math.max(0, 1 - Math.log(Math.max(a, b) / Math.min(a, b)) / Math.log(4));
}

export function findSimilarYachts(
  subject: {
    id: string;
    type: string | null;
    length: number | null;
    guests: number | null;
    minPrice: number | null;
    currency: string | null;
    minPriceUsd: number | null;
    areas: string[];
  },
  catalogue: CyaCatalogueYacht[],
  options?: { limit?: number }
): Recommendation[] {
  const limit = options?.limit ?? 3;
  const subjectCandidate =
    toCandidate({
      id: subject.id,
      yachtName: subject.id,
      yachtType: subject.type,
      length: subject.length,
      pax: subject.guests,
      min_price: subject.minPrice,
      currency: subject.currency,
      min_price_usd: subject.minPriceUsd,
      seasonAreas: subject.areas,
    } as CyaCatalogueYacht) ?? null;

  if (!subjectCandidate) return [];

  const subjectType = normaliseType(subjectCandidate.type);
  const seen = new Set([subject.id]);
  const candidates: RecommendationCandidate[] = [];
  for (const raw of catalogue) {
    const candidate = toCandidate(raw);
    if (!candidate || seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    candidates.push(candidate);
  }

  const scored: Recommendation[] = candidates.map((candidate) => {
    const factors: Recommendation["factors"] = {
      pricing: pricingCloseness(subjectCandidate, candidate),
      region: regionOverlap(subjectCandidate.areas, candidate.areas),
      type:
        subjectType === "other" || normaliseType(candidate.type) === "other"
          ? null
          : normaliseType(candidate.type) === subjectType
            ? 1
            : 0,
      guests:
        subjectCandidate.guests !== null && candidate.guests !== null
          ? Math.max(0, 1 - Math.abs(subjectCandidate.guests - candidate.guests) / 6)
          : null,
      length:
        subjectCandidate.length !== null && candidate.length !== null
          ? Math.max(0, 1 - Math.abs(subjectCandidate.length - candidate.length) / 30)
          : null,
    };

    let weighted = 0;
    let weightSum = 0;
    for (const [key, value] of Object.entries(factors)) {
      if (value === null) continue;
      const weight = SIMILARITY_WEIGHTS[key as keyof typeof SIMILARITY_WEIGHTS];
      weighted += value * weight;
      weightSum += weight;
    }
    const score = weightSum > 0 ? weighted / weightSum : 0;
    return { candidate, score, factors };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, limit);
}

// Managed-fleet preference: only the two documented MCC-managed mappings
// (aquanimity, atlas — see src/lib/managed-yachts.ts) can be identified as
// managed. No name-based inference is performed: a catalogue yacht whose name
// happens to contain "aquanimity" is NOT treated as managed. The preference is
// applied as a small deterministic boost after scoring.
export const MANAGED_FLEET_SLUGS = new Set(["aquanimity", "atlas"]);
export const MANAGED_FLEET_BOOST = 0.05;
