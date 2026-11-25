import type { SeasonRate } from "./yacht-detail";

export type PricingSummary = {
  headline: string;
  hasRate: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;
  hasTerms: boolean;
  seasons: SeasonRate[];
};

export function money(amount: number, currency: string | null): string {
  const code = currency ?? "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${Math.round(amount).toLocaleString("en-US")}`;
  }
}

type RawSeason = Record<string, unknown>;

function rawSeasons(yacht: Record<string, unknown>): RawSeason[] {
  return Array.isArray(yacht.seasons) ? (yacht.seasons as RawSeason[]).filter((s) => Boolean(s) && typeof s === "object") : [];
}

function num(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Re-reads the raw seasons the CYA detail record supplies so the headline
// always reflects the terms the owner actually published. Falls back to the
// catalogue's min_price_usd only when no season carries a price. Never
// invents conversions or an APA figure.
export function summarizePricing(
  yacht: Record<string, unknown>,
  seasons: SeasonRate[]
): PricingSummary {
  const priced = rawSeasons(yacht)
    .map((s) => ({ price: num(s.base_price), currency: typeof s.currency === "string" ? s.currency : null }))
    .filter((s): s is { price: number; currency: string | null } => s.price !== null)
    .sort((a, b) => a.price - b.price);

  const hasGuestRates = seasons.some((season) => season.guestRates.length > 0);
  const currencies = [...new Set(priced.map((s) => s.currency).filter((c): c is string => Boolean(c)))];
  const currency = currencies.length === 1 ? currencies[0] : null;

  const minPrice = priced.length > 0 ? priced[0].price : null;
  const maxPrice = priced.length > 0 ? priced[priced.length - 1].price : null;

  let headline = "Rates on request";
  if (minPrice !== null && maxPrice !== null && maxPrice > minPrice) {
    headline = `${money(minPrice, currency)} – ${money(maxPrice, currency)} / week`;
  } else if (minPrice !== null) {
    headline = `From ${money(minPrice, currency)} / week`;
  } else if (hasGuestRates) {
    headline = "See weekly rates by guest count";
  } else if (num(yacht.min_price_usd) !== null) {
    headline = `From ${money(yacht.min_price_usd as number, "USD")} / week`;
  }

  return {
    headline,
    hasRate: minPrice !== null || hasGuestRates || num(yacht.min_price_usd) !== null,
    minPrice,
    maxPrice,
    currency,
    hasTerms: seasons.some((s) => s.terms),
    seasons,
  };
}
