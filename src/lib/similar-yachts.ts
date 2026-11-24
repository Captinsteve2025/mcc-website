import { getYachtDetail, searchYachts } from "./cya";
import { guestAgeRestriction, parseAccommodation } from "./yacht-detail";
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
    priceTolerance: 0.40,
    lengthTolerance: 0.40,
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

const FEET_PER_METRE = 3.28084;

// ── Classification ──────────────────────────────────────────────────────────

export type YachtClass =
  | "catamaran"
  | "trimaran"
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
export function classifyYachtType(rawType: unknown, id?: string): YachtClass | null {
  // The operator's specs identify CUAN LAW as a trimaran despite the feed category.
  // https://www.cuanlaw.com/about/
  if (id === "6a023831ce6b8709506dfeed") return "trimaran";
  if (typeof rawType !== "string" || rawType.trim().length === 0) return null;
  const type = rawType.toLowerCase().trim();
  if (type.includes("trimaran")) return "trimaran";
  const isCat = type.includes("catamaran") || /\b(?:powercat|cat)\b/.test(type);
  const isSail = SAILING_MARKERS.some((m) => type.includes(m));
  const isMotor = MOTOR_MARKERS.some((m) => type.includes(m));

  if (isCat && isMotor) return "power-catamaran";
  if (isCat && isSail) return "sailing-catamaran";
  if (type === "catamaran") return "catamaran";
  if (isCat) return null;
  if (isSail && isMotor) return "motorsailer";
  if (isSail) return "sailing-monohull";
  if (isMotor) return "motor-yacht";
  return null;
}

// Customer-facing class labels; no invented classifications, no "power" vs
// "sail" jargon (a bare "yacht" label is used only when CYA itself is vague).
export function customerClassLabel(rawType: unknown, id?: string): string {
  switch (classifyYachtType(rawType, id)) {
    case "catamaran":
      return "Catamaran";
    case "trimaran":
      return "Trimaran";
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
  const unit = typeof units === "string" ? units.toLowerCase().trim() : "";
  if (unit === "m" || unit === "meter" || unit === "meters" || unit === "metre" || unit === "metres") {
    return value * FEET_PER_METRE;
  }
  return ["ft", "feet", "foot"].includes(unit) ? value : null;
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

const REGION_ALIASES: Record<string, string[]> = {
  "caribbean virgin islands bvi": ["bvi"],
  "british virgin islands": ["bvi"],
  "caribbean virgin islands usvi": ["usvi"],
  "caribbean virgin islands us": ["usvi"],
  "us virgin islands": ["usvi"],
  "caribbean virgin islands us bvi": ["usvi", "bvi"],
};

function regionKeys(area: string): string[] {
  const key = area.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return key ? REGION_ALIASES[key] ?? [key] : [];
}

export function regionsOverlap(reference: string[], candidate: string[]): string[] {
  const refKeys = new Set(reference.flatMap(regionKeys));
  return [...new Set(candidate.filter((area) => regionKeys(area).some((key) => refKeys.has(key))))];
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
  pricingBasis: string | null;
  regions: string[];
  seasonDates: SeasonDates[];
  image: string | null;
  managedFleet: boolean;
};

function toNumber(v: unknown): number | null {
  const n = typeof v === "number" || typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

type SeasonDates = { start: string; end: string };

function seasonsOf(yacht: Record<string, unknown>): Record<string, unknown>[] {
  return Array.isArray(yacht.seasons)
    ? yacht.seasons.filter((season) => season && typeof season === "object" && !Array.isArray(season))
    : [];
}

function seasonDates(seasons: Record<string, unknown>[]): SeasonDates[] {
  return seasons.flatMap(({ start_date, end_date }) => {
    if (typeof start_date !== "string" || typeof end_date !== "string") return [];
    const start = start_date.slice(0, 10);
    const end = end_date.slice(0, 10);
    const isoDay = /^\d{4}-\d{2}-\d{2}$/;
    return isoDay.test(start) && isoDay.test(end) && start <= end ? [{ start, end }] : [];
  });
}

function currencyCode(value: unknown): string | null {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^[A-Z]{3}$/.test(code) ? code : null;
}

function pricingBasis(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const basis = value.toLowerCase().trim().replace(/[\s_-]+/g, " ");
  if (["inclusive", "allinclusive"].includes(basis)) return "all inclusive";
  return basis;
}

export function candidateFromCatalogue(rec: Record<string, unknown>): YachtCandidate | null {
  if (typeof rec.id !== "string" || !/^[a-f0-9]{8,32}$/i.test(rec.id)) return null;
  const name = typeof rec.yachtName === "string" ? rec.yachtName.trim() : "";
  if (!name) return null;
  const rawType = typeof rec.yachtType === "string" ? rec.yachtType : null;
  const idLower = rec.id.toLowerCase();
  const seasons = seasonsOf(rec);
  return {
    id: rec.id,
    name,
    rawType,
    class: classifyYachtType(rawType, idLower),
    lengthFt: lengthToFeet(rec.length, rec.units),
    guests: toNumber(rec.pax),
    cabins: toNumber(rec.cabins),
    minPriceUsd: toNumber(rec.min_price_usd),
    minPrice: toNumber(rec.min_price),
    currency: currencyCode(rec.currency),
    pricingBasis: pricingBasis(rec.pricing_basis ?? rec.charter_type),
    regions: extractAreaNames(rec.seasonAreas),
    seasonDates: seasonDates(seasons),
    image: typeof rec.image === "string" && rec.image.startsWith("https://") ? rec.image : null,
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
  minPriceUsd: number | null;
  currency: string | null;
  pricingBases: string[];
  regions: string[];
  seasonDates: SeasonDates[];
};

// Built from the CYA detail record the page already fetched: raw season
// prices, unit-aware length, accommodation pax/cabins, and seasonal charter
// areas (not flag or builder).
export function subjectFromDetail(detail: Record<string, unknown>, id: string): SubjectProfile {
  const today = new Date().toISOString().slice(0, 10);
  const rawSeasons = seasonsOf(detail).filter((season) => seasonDates([season]).some(({ end }) => end >= today));
  const priced = rawSeasons
    .map((s) => ({ price: toNumber(s.base_price), currency: currencyCode(s.currency) }))
    .filter((s): s is { price: number; currency: string | null } => s.price !== null);

  const currencies = [...new Set(priced.map((s) => s.currency))];
  const prices = priced.map((s) => s.price);
  const accommodation = parseAccommodation(detail as CyaYacht);

  const regions = rawSeasons.flatMap((s) => extractAreaNames(s.location_areas));

  const rawType = typeof detail.yachtType === "string" ? detail.yachtType : null;
  return {
    id,
    name: typeof detail.yachtName === "string" ? detail.yachtName : "Yacht",
    rawType,
    class: classifyYachtType(rawType, id.toLowerCase()),
    lengthFt: lengthToFeet(detail.lenght ?? detail.length, detail.units),
    guests: guestAgeRestriction(accommodation)?.adults ?? accommodation.pax,
    cabins: accommodation.cabins,
    minPrice: currencies.length === 1 && currencies[0] ? Math.min(...prices) : null,
    maxPrice: currencies.length === 1 && currencies[0] ? Math.max(...prices) : null,
    minPriceUsd: null, // The catalogue floor can include expired seasons.
    currency: currencies.length === 1 ? currencies[0] : null,
    pricingBases: [...new Set(rawSeasons.map((s) => pricingBasis(s.pricing_basis ?? s.charter_type)).filter((basis): basis is string => basis !== null))],
    regions: [...new Set(regions)],
    seasonDates: seasonDates(rawSeasons),
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
  weeklyRate: { amount: number; currency: string };
  scores: { pricing: number; regionSeason: number; classModel: number; guestsCabins: number; length: number };
  regionMatches: string[];
  total: number;
};

function comparablePrice(subject: SubjectProfile, candidate: YachtCandidate) {
  if (
    candidate.pricingBasis &&
    subject.pricingBases.length > 0 &&
    !subject.pricingBases.includes(candidate.pricingBasis)
  ) return null;

  if (
    subject.currency && candidate.currency === subject.currency &&
    subject.minPrice !== null && subject.maxPrice !== null && candidate.minPrice !== null
  ) return { amount: candidate.minPrice, currency: subject.currency, low: subject.minPrice, high: subject.maxPrice };

  const low = subject.currency === "USD" ? subject.minPrice : subject.minPriceUsd;
  const high = subject.currency === "USD" ? subject.maxPrice : subject.minPriceUsd;
  if (low === null || high === null || candidate.minPriceUsd === null) return null;
  return { amount: candidate.minPriceUsd, currency: "USD", low, high };
}

function comparePrice(
  subject: SubjectProfile,
  candidate: YachtCandidate,
  tolerance: number
): { ok: boolean; rule?: ExclusionRule } {
  const price = comparablePrice(subject, candidate);
  if (!price) return { ok: false, rule: "price-missing" };
  const inBand = price.amount >= price.low * (1 - tolerance) && price.amount <= price.high * (1 + tolerance);
  return inBand ? { ok: true } : { ok: false, rule: "price-out-of-band" };
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
  if (candidate.id.toLowerCase() === subject.id.toLowerCase()) {
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
  if (regionsOverlap(subject.regions, candidate.regions).length === 0) {
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
  if (subject.guests === null || candidate.guests === null) {
    return { ok: false, rule: "guests-missing", detail: "Guest capacity is unconfirmed for the reference or candidate." };
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

function pricingScore(price: NonNullable<ReturnType<typeof comparablePrice>>): number {
  const target = Math.min(price.high, Math.max(price.low, price.amount));
  const delta = Math.abs(price.amount - target) / target;
  return clamp01(1 - delta);
}

function regionSeasonScore(subject: SubjectProfile, candidate: YachtCandidate): number {
  if (subject.regions.length === 0 || candidate.regions.length === 0) return NEUTRAL;
  const matches = regionsOverlap(subject.regions, candidate.regions);
  if (matches.length === 0) return 0;
  const sharedRegions = clamp01(matches.length / Math.min(subject.regions.length, candidate.regions.length));
  const sameSeason = subject.seasonDates.length > 0 && candidate.seasonDates.length > 0
    ? Number(subject.seasonDates.some((a) => candidate.seasonDates.some((b) => a.start <= b.end && b.start <= a.end)))
    : NEUTRAL;
  return sharedRegions * 0.75 + sameSeason * 0.25;
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
  const ranked = eligible.flatMap((candidate) => {
    const price = comparablePrice(subject, candidate);
    if (!price) return [];
    const scores = {
      pricing: pricingScore(price),
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
    return [{
      candidate,
      weeklyRate: { amount: price.amount, currency: price.currency },
      scores,
      regionMatches: regionsOverlap(subject.regions, candidate.regions),
      total,
    }];
  });
  ranked.sort((a, b) => b.total - a.total || a.candidate.id.localeCompare(b.candidate.id));
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
  const strictMatches = ranked.filter((r) => r.total >= RECOMMENDATION_CONFIG.minScore).slice(0, RECOMMENDATION_CONFIG.maxResults);

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

export async function loadYachtRecommendations(subject: SubjectProfile): Promise<RecommendationResult> {
  if (!subject.class || !subject.lengthFt || !subject.guests || !subject.regions.length || subject.minPrice === null) {
    return recommendSimilarYachts(subject, []);
  }

  const { priceTolerance, lengthTolerance } = RECOMMENDATION_CONFIG.fallback;
  const candidates = candidatesFromCatalogue(await fetchFullCatalogue());
  // The catalogue floor can be older than the brochure. Use it for a
  // bounded shortlist, then compare current brochure rates and terms.
  const shortlist = candidates
    .map((candidate) => ({ ...candidate, pricingBasis: null }))
    .filter((candidate) => eligibilityCheck(subject, candidate, priceTolerance, lengthTolerance).ok);
  const ranked = rankCandidates(subject, shortlist).slice(0, 8);
  const checked = await Promise.all(ranked.map(async ({ candidate }) => {
    try {
      const detail = await getYachtDetail(candidate.id);
      const profile = subjectFromDetail(detail, candidate.id);
      if (profile.minPrice === null || profile.pricingBases.length > 1) return null;
      return {
        ...candidate,
        rawType: profile.rawType,
        class: profile.class,
        lengthFt: profile.lengthFt,
        guests: profile.guests,
        cabins: profile.cabins,
        minPrice: profile.minPrice,
        minPriceUsd: null,
        currency: profile.currency,
        pricingBasis: profile.pricingBases[0] ?? null,
        regions: profile.regions,
        seasonDates: profile.seasonDates,
      };
    } catch {
      return null;
    }
  }));
  const result = recommendSimilarYachts(subject, checked.filter((candidate) => candidate !== null));
  return { ...result, considered: candidates.length };
}

// ── Full-catalogue walk ─────────────────────────────────────────────────────

// Walks every page of the live catalogue (never a single 100-record subset)
// through the shared cached searchYachts client, so the per-instance rate
// guard and Next fetch cache still apply.
async function walkCatalogue(): Promise<CyaYacht[]> {
  const all: CyaYacht[] = [];
  const seen = new Set<string>();
  const pageSize = 200;
  const maxPages = 24;
  let readCount = 0;
  let observedPageSize = pageSize;
  let total: number | null = null;
  for (let page = 1; page <= maxPages; page++) {
    const response = await searchYachts({ page, limit: pageSize, searchTerm: "", filters: {} });
    if (!Array.isArray(response.yachts)) throw new Error("CYA did not return a catalogue page.");
    const rows = response.yachts as CyaYacht[];
    total ??= typeof response.totalYachts === "number" ? response.totalYachts : null;
    if (rows.length === 0) break;
    if (page === 1) observedPageSize = rows.length;
    readCount += rows.length;
    const previousSize = all.length;
    for (const row of rows) {
      const recId = typeof row?.id === "string" ? row.id.toLowerCase() : null;
      if (!recId || seen.has(recId)) continue;
      seen.add(recId);
      all.push(row);
    }
    if (all.length === previousSize || (total !== null ? readCount >= total : rows.length < observedPageSize)) break;
  }
  return all;
}

let catalogue: { promise: Promise<CyaYacht[]>; expiresAt: number } | null = null;

export function fetchFullCatalogue(): Promise<CyaYacht[]> {
  if (catalogue && catalogue.expiresAt > Date.now()) return catalogue.promise;
  const promise = walkCatalogue().catch((error) => {
    if (catalogue?.promise === promise) catalogue = null;
    throw error;
  });
  catalogue = { promise, expiresAt: Date.now() + 300_000 };
  return promise;
}
