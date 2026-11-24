import { searchYachts } from "./cya";
import { parseAccommodation } from "./yacht-detail";
import type { Yacht as CyaYacht } from "./cya";

// Two-stage similar-yacht engine.
//
// Stage 1 is hard eligibility: same genuine yacht class, at least one
// verified overlapping charter region, pricing inside the reference band with
// a comparable currency, length inside the band after unit normalisation
// (metres and feet are never mixed up), and guest capacity at or above the
// reference. Yachts failing any gate are excluded with the reason recorded —
// they are never ranked, so missing data cannot inflate a score.
//
// Stage 2 ranks only eligible yachts: pricing 30%, region+season 25%,
// class+model 20%, guests+cabins 15%, length 10%. Unknown factors score at a
// neutral floor, never a perfect value.
//
// Weights and tolerances live in RECOMMENDATION_CONFIG so they can be tuned
// centrally. No CYA data is invented anywhere in this module.

export const RECOMMENDATION_CONFIG = {
  strict: {
    priceTolerance: 0.25,
    lengthTolerance: 0.25,
  },
  fallback: {
    priceTolerance: 0.6,
    lengthTolerance: 0.5,
  },
  maxResults: 3,
  minScore: 0.35,
  managedFleetBoost: 0.05,
  managedFleetIds: ["aquanimity", "atlas"],
  weights: {
    pricing: 0.3,
    regionSeason: 0.25,
    classModel: 0.2,
    guestsCabins: 0.15,
    length: 0.1,
  },
} as const;

const M_PER_FT = 3.28084;

// ── Classification ──────────────────────────────────────────────────────────

export type YachtClass =
  | "sailing-catamaran"
  | "power-catamaran"
  | "sailing-monohull"
  | "motor-yacht"
  | "motorsailer";

const SAILING_MARKERS = ["sail", "sloop", "ketch", "yawl", "schooner", "gulet"];
const MOTOR_MARKERS = ["motor", "power", "flybridge", "trawler", "superyacht"];

// Classifies a CYA yachtType string. Returns null when the type cannot be
// assigned with confidence — uncertain records are excluded rather than
// guessed.
export function classifyYachtType(rawType: unknown): YachtClass | null {
  if (typeof rawType !== "string" || rawType.trim().length === 0) return null;
  const type = rawType.toLowerCase().trim();
  const isCat = type.includes("catamaran") || /\bcat\b/.test(type);
  const isSail = SAILING_MARKERS.some((m) => type.includes(m));
  const isMotor = MOTOR_MARKERS.some((m) => type.includes(m));

  if (isCat && isMotor) return "power-catamaran";
  if (isCat && isSail) return "sailing-catamaran";
  if (isCat) return null; // "catamaran" alone: sailing or power is unconfirmed
  if (isSail && isMotor) return "motorsailer";
  if (isSail) return "sailing-monohull";
  if (isMotor) return "motor-yacht";
  return null;
}

// Customer-facing class labels; no invented classifications, no "power" vs
// "sail" jargon (a bare "yacht" label is used only when CYA itself is vague).
export function customerClassLabel(rawType: unknown): string {
  switch (classifyYachtType(rawType)) {
    case "sailing-catamaran":
      return "Sailing Catamaran";
    case "power-catamaran":
      return "Power Catamaran";
    case "sailing-monohull":
      return "Sailing Yacht";
    case "motor-yacht":
      return "Motor Yacht";
    case "motorsailer":
      return "Motorsailer";
    default:
      return "Yacht";
  }
}

// ── Normalisation ───────────────────────────────────────────────────────────

// Length to feet. CYA supplies `units` ("ft" or "m"); the unit is never
// assumed and metres are never silently equated with feet.
export function lengthToFeet(length: unknown, units: unknown): number | null {
  const value = typeof length === "number" ? length : Number(length);
  if (!Number.isFinite(value) || value <= 0) return null;
  const unit = typeof units === "string" ? units.toLowerCase().trim() : "ft";
  if (unit === "m" || unit === "meter" || unit === "meters" || unit === "metre" || unit === "metres") {
    return value * M_PER_FT;
  }
  return value;
}

export type RegionArea = string | { label?: unknown; name?: unknown } | null | undefined;

export function extractAreaNames(areas: unknown): string[] {
  if (!Array.isArray(areas)) return [];
  const names: string[] = [];
  for (const area of areas as RegionArea[]) {
    if (typeof area === "string") {
      names.push(...area.split(/,|\|/).map((s) => s.trim()).filter(Boolean));
    } else if (area && typeof area === "object") {
      const label = area.label ?? area.name;
      if (typeof label === "string") {
        names.push(...label.split(/,|\|/).map((s) => s.trim()).filter(Boolean));
      }
    }
  }
  return [...new Set(names)];
}

function regionKey(area: string): string {
  return area.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}

// Requires at least one shared region token. Word-level subset matching lets
// "US Virgin Islands" match "Virgin Islands" without substring false hits.
export function regionsOverlap(reference: string[], candidate: string[]): string[] {
  const refKeys = new Set(reference.map(regionKey).filter(Boolean));
  const overlaps: string[] = [];
  for (const area of candidate) {
    const key = regionKey(area);
    if (!key) continue;
    if (refKeys.has(key)) {
      overlaps.push(area);
      continue;
    }
    const candWords = key.split(" ");
    for (const refKey of refKeys) {
      const refWords = new Set(refKey.split(" "));
      if (candWords.length > 0 && candWords.every((w) => refWords.has(w))) {
        overlaps.push(area);
        break;
      }
    }
  }
  return [...new Set(overlaps)];
}

// ── Candidates ──────────────────────────────────────────────────────────────

export type YachtCandidate = {
  id: string;
  name: string;
  rawType: string | null;
  class: YachtClass | null;
  lengthFt: number | null;
  guests: number | null;
  cabins: number | null;
  minPriceUsd: number | null;
  minPrice: number | null;
  currency: string | null;
  regions: string[];
  image: string | null;
  managedFleet: boolean;
};

function toNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function candidateFromCatalogue(rec: Record<string, unknown>): YachtCandidate | null {
  if (typeof rec.id !== "string" || rec.id.length === 0) return null;
  const rawType = typeof rec.yachtType === "string" ? rec.yachtType : null;
  const idLower = rec.id.toLowerCase();
  return {
    id: rec.id,
    name: typeof rec.yachtName === "string" ? rec.yachtName : "Unnamed yacht",
    rawType,
    class: classifyYachtType(rawType),
    lengthFt: lengthToFeet(rec.length, rec.units),
    guests: toNumber(rec.pax),
    cabins: toNumber(rec.cabins),
    minPriceUsd: toNumber(rec.min_price_usd),
    minPrice: toNumber(rec.min_price),
    currency: typeof rec.currency === "string" ? rec.currency : null,
    regions: extractAreaNames(rec.seasonAreas),
    image: typeof rec.image === "string" && rec.image.length > 0 ? rec.image : null,
    managedFleet: RECOMMENDATION_CONFIG.managedFleetIds.some((slug) => idLower.includes(slug)),
  };
}

export function candidatesFromCatalogue(catalogue: CyaYacht[]): YachtCandidate[] {
  return catalogue
    .map((rec) => candidateFromCatalogue(rec as Record<string, unknown>))
    .filter((c): c is YachtCandidate => c !== null);
}

// ── Subject profile ─────────────────────────────────────────────────────────

export type SubjectProfile = {
  id: string;
  name: string;
  rawType: string | null;
  class: YachtClass | null;
  lengthFt: number | null;
  guests: number | null;
  cabins: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;
  regions: string[];
};

// Built from the CYA detail record the page already fetched: raw season
// prices, unit-aware length, accommodation pax/cabins, and seasonal charter
// areas (not flag or builder).
export function subjectFromDetail(detail: Record<string, unknown>): SubjectProfile {
  const rawSeasons = (Array.isArray(detail.seasons) ? detail.seasons : []).filter(
    (s): s is Record<string, unknown> => Boolean(s) && typeof s === "object"
  );
  const priced = rawSeasons
    .map((s) => ({ price: toNumber(s.base_price), currency: typeof s.currency === "string" ? s.currency : null }))
    .filter((s): s is { price: number; currency: string | null } => s.price !== null);

  const currencies = [...new Set(priced.map((s) => s.currency).filter((c): c is string => Boolean(c)))];
  const prices = priced.map((s) => s.price);
  const accommodation = parseAccommodation(detail as CyaYacht);

  const regions = rawSeasons.flatMap((s) => extractAreaNames(s.location_areas));

  const rawType = typeof detail.yachtType === "string" ? detail.yachtType : null;
  return {
    id: typeof detail.id === "string" ? detail.id : "",
    name: typeof detail.yachtName === "string" ? detail.yachtName : "Yacht",
    rawType,
    class: classifyYachtType(rawType),
    lengthFt: lengthToFeet(detail.lenght, detail.units),
    guests: accommodation.pax,
    cabins: accommodation.cabins,
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
    maxPrice: prices.length > 0 ? Math.max(...prices) : null,
    currency: currencies.length === 1 ? currencies[0] : null,
    regions: [...new Set(regions)],
  };
}

// ── Stage 1: eligibility ────────────────────────────────────────────────────

export type ExclusionRule =
  | "self"
  | "unclassified"
  | "class-mismatch"
  | "no-region-overlap"
  | "price-missing"
  | "price-out-of-band"
  | "length-missing"
  | "length-out-of-band"
  | "guests-below-reference"
  | "guests-missing";

export type ExcludedRecord = {
  id: string;
  name: string;
  rule: ExclusionRule;
  detail: string;
};

export type ScoredCandidate = {
  candidate: YachtCandidate;
  scores: { pricing: number; regionSeason: number; classModel: number; guestsCabins: number; length: number };
  regionMatches: string[];
  total: number;
};

function comparePrice(
  subject: SubjectProfile,
  candidate: YachtCandidate,
  tolerance: number
): { ok: boolean; rule?: ExclusionRule } {
  // Compare like with like: USD floor price when CYA supplies it, otherwise
  // the listing currency only when the reference uses the same one. No
  // invented conversions.
  if (candidate.minPriceUsd !== null) {
    const refUsd = subject.minPrice ?? subject.maxPrice;
    if (refUsd === null) return { ok: false, rule: "price-missing" };
    const low = refUsd * (1 - tolerance);
    const high = refUsd * (1 + tolerance);
    if (candidate.minPriceUsd < low || candidate.minPriceUsd > high) return { ok: false, rule: "price-out-of-band" };
    return { ok: true };
  }
  if (candidate.minPrice === null) return { ok: false, rule: "price-missing" };
  if (!subject.currency || !candidate.currency || subject.currency.toUpperCase() !== candidate.currency.toUpperCase()) {
    return { ok: false, rule: "price-missing" };
  }
  const ref = subject.minPrice ?? subject.maxPrice;
  if (ref === null) return { ok: false, rule: "price-missing" };
  const low = ref * (1 - tolerance);
  const high = ref * (1 + tolerance);
  if (candidate.minPrice < low || candidate.minPrice > high) return { ok: false, rule: "price-out-of-band" };
  return { ok: true };
}

function compareLength(subject: SubjectProfile, candidate: YachtCandidate, tolerance: number): { ok: boolean; rule?: ExclusionRule } {
  if (subject.lengthFt === null || candidate.lengthFt === null) return { ok: false, rule: "length-missing" };
  const delta = Math.abs(candidate.lengthFt - subject.lengthFt) / subject.lengthFt;
  if (delta > tolerance) return { ok: false, rule: "length-out-of-band" };
  return { ok: true };
}

function eligibilityCheck(
  subject: SubjectProfile,
  candidate: YachtCandidate,
  priceTolerance: number,
  lengthTolerance: number
): { ok: true } | { ok: false; rule: ExclusionRule; detail: string } {
  if (candidate.id === subject.id) {
    return { ok: false, rule: "self", detail: "The reference yacht itself." };
  }
  if (candidate.class === null) {
    return {
      ok: false,
      rule: "unclassified",
      detail: `CYA type "${candidate.rawType ?? "not published"}" could not be classified with confidence.`,
    };
  }
  if (subject.class !== null && candidate.class !== subject.class) {
    return {
      ok: false,
      rule: "class-mismatch",
      detail: `Reference is a ${customerClassLabel(subject.rawType)}; this is a ${customerClassLabel(candidate.rawType)}.`,
    };
  }
  if (subject.class === null) {
    return {
      ok: false,
      rule: "class-mismatch",
      detail: `The reference's own type ("${subject.rawType ?? "not published"}") is unclassified, so class eligibility cannot be established.`,
    };
  }
  if (subject.regions.length > 0 && regionsOverlap(subject.regions, candidate.regions).length === 0) {
    return {
      ok: false,
      rule: "no-region-overlap",
      detail: `No shared charter region (candidate lists: ${candidate.regions.slice(0, 4).join(", ") || "none"}).`,
    };
  }
  const price = comparePrice(subject, candidate, priceTolerance);
  if (!price.ok) {
    return {
      ok: false,
      rule: price.rule as ExclusionRule,
      detail:
        price.rule === "price-missing"
          ? "No published weekly rate comparable with the reference's pricing arrangement."
          : `Rate is outside the reference band (±${Math.round(priceTolerance * 100)}%).`,
    };
  }
  const length = compareLength(subject, candidate, lengthTolerance);
  if (!length.ok) {
    return {
      ok: false,
      rule: length.rule as ExclusionRule,
      detail:
        length.rule === "length-missing"
          ? "Length missing or unit unknown."
          : `${candidate.lengthFt !== null ? Math.round(candidate.lengthFt) + " ft" : "Length"} is outside the reference band (±${Math.round(lengthTolerance * 100)}%).`,
    };
  }
  if (subject.guests !== null && candidate.guests === null) {
    return { ok: false, rule: "guests-missing", detail: "Guest capacity not published; cannot confirm it covers the party." };
  }
  if (subject.guests !== null && candidate.guests !== null && candidate.guests < subject.guests) {
    return {
      ok: false,
      rule: "guests-below-reference",
      detail: `Sleeps ${candidate.guests}, below the reference party of ${subject.guests}.`,
    };
  }
  return { ok: true };
}

// ── Stage 2: ranking ────────────────────────────────────────────────────────

const NEUTRAL = 0.5; // unknown factors score here, never at a perfect value

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function pricingScore(subject: SubjectProfile, candidate: YachtCandidate): number {
  const ref = subject.minPrice ?? subject.maxPrice;
  const cand = candidate.minPriceUsd ?? candidate.minPrice;
  if (ref === null || cand === null) return NEUTRAL;
  // Score against the nearer end of the reference's seasonal range.
  const target = subject.maxPrice !== null && cand > ref ? subject.maxPrice : ref;
  const delta = Math.abs(cand - target) / target;
  return clamp01(1 - delta);
}

function regionSeasonScore(subject: SubjectProfile, candidate: YachtCandidate): number {
  if (subject.regions.length === 0 || candidate.regions.length === 0) return NEUTRAL;
  const matches = regionsOverlap(subject.regions, candidate.regions);
  if (matches.length === 0) return 0;
  return clamp01(matches.length / Math.min(subject.regions.length, candidate.regions.length));
}

function classModelScore(subject: SubjectProfile, candidate: YachtCandidate): number {
  if (candidate.class !== null && candidate.class === subject.class) return 1;
  return 0;
}

function guestsCabinsScore(subject: SubjectProfile, candidate: YachtCandidate): number {
  if (subject.guests === null || candidate.guests === null) return NEUTRAL;
  // Capacity at or above the reference is required; the closest fit ranks best.
  const guestFit = candidate.guests === subject.guests ? 1 : clamp01(1 - (candidate.guests - subject.guests) / (subject.guests * 2));
  let cabinFit = NEUTRAL;
  if (subject.cabins !== null && candidate.cabins !== null) {
    cabinFit = clamp01(1 - Math.abs(candidate.cabins - subject.cabins) * 0.25);
  }
  return clamp01(guestFit * 0.6 + cabinFit * 0.4);
}

function lengthScore(subject: SubjectProfile, candidate: YachtCandidate): number {
  if (subject.lengthFt === null || candidate.lengthFt === null) return NEUTRAL;
  const delta = Math.abs(candidate.lengthFt - subject.lengthFt) / subject.lengthFt;
  return clamp01(1 - delta * 2);
}

function rankCandidates(subject: SubjectProfile, eligible: YachtCandidate[]): ScoredCandidate[] {
  const w = RECOMMENDATION_CONFIG.weights;
  const ranked = eligible.map((candidate) => {
    const scores = {
      pricing: pricingScore(subject, candidate),
      regionSeason: regionSeasonScore(subject, candidate),
      classModel: classModelScore(subject, candidate),
      guestsCabins: guestsCabinsScore(subject, candidate),
      length: lengthScore(subject, candidate),
    };
    const base =
      scores.pricing * w.pricing +
      scores.regionSeason * w.regionSeason +
      scores.classModel * w.classModel +
      scores.guestsCabins * w.guestsCabins +
      scores.length * w.length;
    const total = clamp01(base + (candidate.managedFleet ? RECOMMENDATION_CONFIG.managedFleetBoost : 0));
    return {
      candidate,
      scores,
      regionMatches: regionsOverlap(subject.regions, candidate.regions),
      total,
    };
  });
  ranked.sort((a, b) => b.total - a.total);
  return ranked;
}

// ── Public entry point ──────────────────────────────────────────────────────

export type RecommendationResult = {
  subject: SubjectProfile;
  considered: number;
  eligible: ScoredCandidate[];
  excluded: ExcludedRecord[];
  strictMatches: ScoredCandidate[];
  broaderMatches: ScoredCandidate[];
};

// Applies Stage-1 eligibility over the full candidate list, then Stage-2
// ranking. Strict matches below the minimum similarity score are dropped; a
// controlled fallback widens ONLY price and length tolerance — class,
// region and guest gates are never relaxed — and broader matches are returned
// in a separate tier so they can be labelled differently on the page. Fewer
// than three results is an acceptable outcome; none is an acceptable outcome.
export function recommendSimilarYachts(
  subject: SubjectProfile,
  catalogue: YachtCandidate[]
): RecommendationResult {
  const excluded: ExcludedRecord[] = [];
  const eligible: YachtCandidate[] = [];

  for (const rec of catalogue) {
    const check = eligibilityCheck(subject, rec, RECOMMENDATION_CONFIG.strict.priceTolerance, RECOMMENDATION_CONFIG.strict.lengthTolerance);
    if (check.ok) eligible.push(rec);
    else excluded.push({ id: rec.id, name: rec.name, rule: check.rule, detail: check.detail });
  }

  const ranked = rankCandidates(subject, eligible);
  const strictMatches = ranked.filter((r) => r.total >= RECOMMENDATION_CONFIG.minScore);

  let broaderMatches: ScoredCandidate[] = [];
  if (strictMatches.length < RECOMMENDATION_CONFIG.maxResults) {
    const taken = new Set(strictMatches.map((r) => r.candidate.id));
    const relaxed: YachtCandidate[] = [];
    for (const rec of catalogue) {
      if (taken.has(rec.id)) continue;
      const check = eligibilityCheck(subject, rec, RECOMMENDATION_CONFIG.fallback.priceTolerance, RECOMMENDATION_CONFIG.fallback.lengthTolerance);
      if (check.ok) relaxed.push(rec);
    }
    broaderMatches = rankCandidates(subject, relaxed)
      .filter((r) => r.total >= RECOMMENDATION_CONFIG.minScore)
      .slice(0, RECOMMENDATION_CONFIG.maxResults - strictMatches.length);
  }

  return { subject, considered: catalogue.length, eligible: ranked, excluded, strictMatches, broaderMatches };
}

// ── Full-catalogue walk ─────────────────────────────────────────────────────

// Walks every page of the live catalogue (never a single 100-record subset)
// through the shared cached searchYachts client, so the per-instance rate
// guard and Next fetch cache still apply.
export async function fetchFullCatalogue(): Promise<CyaYacht[]> {
  const all: CyaYacht[] = [];
  const seen = new Set<string>();
  const pageSize = 200;
  const maxPages = 20; // safety cap; ~1,920 records ≈ 10 pages
  for (let page = 1; page <= maxPages; page++) {
    const response = await searchYachts({ page, limit: pageSize, searchTerm: "", filters: {} });
    const rows = (response.yachts as CyaYacht[] | undefined) ?? [];
    for (const row of rows) {
      const recId = typeof row.id === "string" ? row.id : null;
      if (!recId || seen.has(recId)) continue;
      seen.add(recId);
      all.push(row);
    }
    if (rows.length < pageSize) break;
  }
  return all;
}
