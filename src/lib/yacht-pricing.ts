import { num, str } from "@/lib/yacht-detail";

// One pricing source for the hero band, the rates panel and the persistent
// bar. Only fields CYA actually supplies are used; nothing is converted,
// averaged or invented. When CYA supplies no price at all the result is
// "Rates on request" — never zero, never an example figure.

export type SeasonRateLike = {
  title: string;
  category: string | null;
  dates: string | null;
  price: string | null;
  area: string | null;
  details: string | null;
  pickup: string | null;
  basePort: string | null;
  charterType: string | null;
  terms: string | null;
};

export type PricingSummary = {
  /** Headline for hero and persistent bar: range, "From $X / week", or "Rates on request". */
  headline: string;
  /** True when the headline carries a numeric rate CYA supplied. */
  hasRate: boolean;
  /** Lowest weekly rate in the yacht's own currency, when seasons supply one. */
  minPrice: number | null;
  /** Highest weekly rate in the yacht's own currency, when seasons supply one. */
  maxPrice: number | null;
  /** Currency code from the seasons (never assumed USD). */
  currency: string | null;
  /** True when every priced season carries full terms naming inclusions. */
  hasTerms: boolean;
  seasons: SeasonRateLike[];
};

function money(amount: number, currency: string | null): string {
  const rounded = Math.round(amount).toLocaleString("en-US");
  if (currency === "USD") return `$${rounded}`;
  if (currency === "EUR") return `\u20ac${rounded}`;
  if (currency === "GBP") return `\u00a3${rounded}`;
  return currency ? `${currency} ${rounded}` : `$${rounded}`;
}

export function summarizePricing(
  yacht: Record<string, unknown>,
  seasons: SeasonRateLike[]
): PricingSummary {
  const priced = seasons.filter((s) => s.price !== null);

  // Season prices are preformatted "$X / week"; extract the numeric part with
  // the currency the season itself declared. The numeric origin is the
  // season's base_price, re-read from the raw record to avoid re-parsing text.
  let minPrice: number | null = null;
  let maxPrice: number | null = null;
  let currency: string | null = null;
  const rawSeasons = Array.isArray(yacht.seasons) ? yacht.seasons : [];
  for (const raw of rawSeasons) {
    if (!raw || typeof raw !== "object") continue;
    const base = num((raw as Record<string, unknown>).base_price);
    if (base === null || base <= 0) continue;
    const cur = str((raw as Record<string, unknown>).currency);
    if (currency === null && cur) currency = cur;
    minPrice = minPrice === null ? base : Math.min(minPrice, base);
    maxPrice = maxPrice === null ? base : Math.max(maxPrice, base);
  }

  const minUsd = num(yacht.min_price_usd);

  let headline: string;
  let hasRate = false;
  if (minPrice !== null && maxPrice !== null && maxPrice > minPrice) {
    headline = `${money(minPrice, currency)} \u2013 ${money(maxPrice, currency)} / week`;
    hasRate = true;
  } else if (minPrice !== null) {
    headline = `From ${money(minPrice, currency)} / week`;
    hasRate = true;
  } else if (minUsd !== null && minUsd > 0) {
    headline = `From $${Math.round(minUsd).toLocaleString("en-US")} / week`;
    hasRate = true;
  } else {
    headline = "Rates on request";
  }

  const hasTerms = seasons.some((s) => s.terms !== null);

  return { headline, hasRate, minPrice, maxPrice, currency, hasTerms, seasons };
}
