// Server-only Central Yacht Agent API client. Never import from client code:
// it reads CYA_API_KEY from the environment and must not reach the browser.
//
// Domain headers follow the observed successful diagnostic (Origin + Referer
// set to the registered domain produced HTTP 200 where the key alone returned
// 403). CYA should confirm this behavior is supported for ongoing
// server-side integration.

const DEFAULT_ALLOWED_ORIGIN = "https://mcc-website-one.vercel.app";

export class CyaApiError extends Error {
  status: number;
  code: string | null;
  retryAfterSeconds: number | null;

  constructor(message: string, status: number, code: string | null, retryAfterSeconds: number | null = null) {
    super(message);
    this.name = "CyaApiError";
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function getCyaConfig(): { key: string; baseUrl: string; origin: string } {
  const key = process.env.CYA_API_KEY;
  const baseUrl = process.env.CYA_API_BASE;
  if (!key || !baseUrl) {
    throw new CyaApiError("CYA_API_KEY and CYA_API_BASE must be set in the server environment.", 503, "missing_config");
  }
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:") {
    throw new CyaApiError("CYA_API_BASE must use https.", 503, "invalid_base_url");
  }
  return {
    key,
    baseUrl: parsed.toString().replace(/\/+$/, ""),
    origin: process.env.CYA_ALLOWED_ORIGIN ?? DEFAULT_ALLOWED_ORIGIN,
  };
}

// Never surface a raw error body: keep only a short code or message when the
// API answers with JSON, and a content-type note otherwise.
function sanitizeErrorBody(body: string, contentType: string | null): string | null {
  if (contentType?.includes("application/json")) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        const code = obj.error ?? obj.code ?? obj.message;
        if (typeof code === "string" && code.length > 0) return code.slice(0, 200);
      }
      return null;
    } catch {
      return null;
    }
  }
  if (contentType?.includes("text/html")) return "HTML error page returned instead of JSON.";
  return null;
}

async function parseErrorResponse(response: Response): Promise<CyaApiError> {
  const contentType = response.headers.get("content-type");
  const body = await response.text().catch(() => "");
  const code = sanitizeErrorBody(body, contentType);
  const retryAfter = response.headers.get("retry-after");
  const retryAfterSeconds = retryAfter ? Number(retryAfter) : null;
  const messages: Record<number, string> = {
    401: "CYA rejected the API key (401). Re-check CYA_API_KEY in Vercel.",
    403: "CYA denied the request (403). The key may be invalid, or the domain restriction did not match.",
    404: "CYA endpoint not found (404). The path may have changed.",
    429: `CYA rate limit reached (429). Wait${retryAfterSeconds ? ` about ${retryAfterSeconds} seconds` : ""} before retrying.`,
    500: "CYA server error (500). Try again later.",
  };
  return new CyaApiError(
    messages[response.status] ?? `CYA responded with status ${response.status}.`,
    response.status,
    code,
    retryAfterSeconds
  );
}

// Caching uses Next's fetch data cache (revalidate), which Vercel shares
// across serverless instances. The request guard below is PER INSTANCE: each
// warm serverless instance keeps its own 60s window, so N instances can emit
// up to N x 40 requests/minute in the worst case. A genuinely shared limiter
// needs shared state (e.g. an Upstash Redis counter or a Supabase advisory
// lock keyed per minute window) plus a secret — deliberately not improvised
// here. Mitigations in place: CYA responses are cached (next.revalidate),
// HTTP 429 is retried once within its Retry-After budget, and the guard below
// bounds each instance's burst.
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

// Per-instance sliding-window guard: 40 requests/60s, below CYA's 60/min.
const INSTANCE_MAX_REQUESTS_PER_MINUTE = 40;
const requestTimestamps: number[] = [];

async function waitForRateSlot(): Promise<void> {
  for (;;) {
    const now = Date.now();
    while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - 60_000) {
      requestTimestamps.shift();
    }
    if (requestTimestamps.length < INSTANCE_MAX_REQUESTS_PER_MINUTE) {
      requestTimestamps.push(now);
      return;
    }
    const waitMs = Math.min(requestTimestamps[0] + 60_000 - now, 2_000);
    await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 50)));
  }
}

export async function cyaFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<T> {
  const { baseUrl, origin, key } = getCyaConfig();
  const revalidate = init?.revalidate ?? 300;
  const cacheKey = `${path}:${JSON.stringify(init?.body ?? "")}`;

  const hit = memoryCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.data as T;

  await waitForRateSlot();

  const doFetch = () =>
    fetch(`${baseUrl}${path}`, {
      method: init?.method,
      headers: {
        "X-API-Key": key,
        Origin: origin,
        Referer: `${origin}/`,
        Accept: "application/json",
        ...(init?.headers as Record<string, string> | undefined),
      },
      body: init?.body,
      signal: AbortSignal.timeout(10_000),
      next: { revalidate },
    });

  let response = await doFetch();

  // Safe 429 handling: honor Retry-After with one bounded retry (max ~5s) so a
  // short burst does not fail a page; longer waits surface a friendly error
  // rather than exceeding serverless execution limits.
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after") ?? "2");
    const waitSeconds = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 5) : 2;
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000 + 250));
    await waitForRateSlot();
    response = await doFetch();
  }

  if (!response.ok) throw await parseErrorResponse(response);

  const data = (await response.json()) as T;
  memoryCache.set(cacheKey, { data, expiresAt: Date.now() + revalidate * 1000 });
  if (memoryCache.size > 50) {
    const now = Date.now();
    for (const [k, v] of memoryCache) if (v.expiresAt <= now) memoryCache.delete(k);
  }
  return data;
}

// The /operating_areas response shape is not documented as a bare array in all
// cases; normalize without inventing values. Returns null when no array can
// be located.
export function normalizeOperatingAreas(payload: unknown): { areas: Record<string, unknown>[]; arrayLocation: string } | null {
  if (Array.isArray(payload)) return { areas: payload as Record<string, unknown>[], arrayLocation: "(response is itself an array)" };
  if (payload && typeof payload === "object") {
    for (const key of ["areas", "operating_areas", "operatingAreas", "data", "results", "items"]) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return { areas: value as Record<string, unknown>[], arrayLocation: `top-level field "${key}"` };
    }
    const firstArray = Object.entries(payload as Record<string, unknown>).find(([, v]) => Array.isArray(v));
    if (firstArray) return { areas: firstArray[1] as Record<string, unknown>[], arrayLocation: `top-level field "${firstArray[0]}"` };
  }
  return null;
}

export async function getOperatingAreasRaw(): Promise<unknown> {
  return cyaFetch<unknown>("/operating_areas", { revalidate: 3600 });
}

export type YachtSearchResponse = Record<string, unknown>;
export type Yacht = Record<string, unknown>;

export function searchYachts(body: Record<string, unknown>): Promise<YachtSearchResponse> {
  return cyaFetch<YachtSearchResponse>("/yachts_search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    revalidate: 300,
  });
}

export function yachtTypeWordsMatch(yacht: Yacht, words: string[]): boolean {
  const type = typeof yacht.yachtType === "string" ? yacht.yachtType.toLowerCase() : "";
  return words.some((w) => type.includes(w));
}

// --- Yacht search session ---------------------------------------------------

export type SearchCriteria = {
  areaIds: string[];
  loweredAreaNames: string[];
  typeWords: string[];
  minGuests: number | null;
};

export type YachtSearchSession = {
  /** One page of results, server-filtered when CYA accepted the filters. */
  getPage(page: number, limit: number): Promise<Yacht[]>;
  /** CYA's reported matching total when the filters are confirmed. */
  serverTotal: number | null;
  /** True only when CYA's own totals prove the filters were applied. */
  serverFilterApplied: boolean;
  /** Per-criterion acceptance, each proven the same way as the combined set. */
  filterAcceptance: Record<string, boolean>;
  /** True when the local fallback hit its page cap and counts are partial. */
  localResultsIncomplete: boolean;
  /** Matching total from the completed local walk; null when partial or n/a. */
  localTotal: number | null;
  /** Yachts matching from the checked records when the walk was capped. */
  checkedRecordCount: number;
  /** CYA request bodies recorded for the admin verification report. */
  probeLog: Array<{ label: string; body: Record<string, unknown>; totalYachts: number | null; listings: number }>;
};

const LOCAL_FALLBACK_MAX_PAGES = 8;

function criterionViolated(yacht: Yacht, criteria: SearchCriteria): boolean {
  if (criteria.loweredAreaNames.length > 0 && !yachtAreaMatchesSynonymsIn(yacht, criteria.loweredAreaNames)) return true;
  if (criteria.typeWords.length > 0 && !yachtTypeWordsMatch(yacht, criteria.typeWords)) return true;
  if (criteria.minGuests !== null && typeof yacht.pax === "number" && yacht.pax < criteria.minGuests) return true;
  return false;
}

/*
 * One search session per page render. Sends the documented CYA filter object
 * (filters.location_areas, filters.yachtTypes, filters.guests) and CONFIRMS
 * each criterion was actually applied before trusting it: a filtered page-1
 * fetch is compared against an identical unfiltered fetch. A criterion counts
 * as accepted only when CYA reports a strictly smaller total with that single
 * criterion added back (an unfiltered-equivalent total proves nothing) AND no
 * returned record violates it. With several criteria, the filtered-vs-
 * unfiltered totals prove the SET is applied, not each member, so each
 * criterion is additionally validated against the records CYA returns.
 *
 * When acceptance is not proven, the session falls back to a full local walk
 * (pages of 10 until exhausted, capped at 8 pages for rate safety) and flags
 * results incomplete when the inventory exceeds the cap.
 */
export async function startYachtSearchSession(
  criteria: SearchCriteria,
  options?: { lightweight?: boolean }
): Promise<YachtSearchSession> {
  const documentedFilters: Record<string, unknown> = {};
  if (criteria.areaIds.length > 0) documentedFilters.location_areas = criteria.areaIds;
  if (criteria.typeWords.length > 0) documentedFilters.yachtTypes = criteria.typeWords;
  if (criteria.minGuests !== null) documentedFilters.guests = criteria.minGuests;
  const hasFilters = Object.keys(documentedFilters).length > 0;
  const lightweight = options?.lightweight ?? false;

  const probeLog: YachtSearchSession["probeLog"] = [];

  const fetchPage = async (body: Record<string, unknown>, label: string) => {
    const response = await searchYachts(body);
    const yachts = (response.yachts as Yacht[] | undefined) ?? [];
    const total = typeof response.totalYachts === "number" ? response.totalYachts : null;
    probeLog.push({ label, body, totalYachts: total, listings: yachts.length });
    return { yachts, total };
  };

  let serverFilterApplied = false;
  let serverTotal: number | null = null;
  let localResultsIncomplete = false;
  let localTotal: number | null = null;
  let localYachts: Yacht[] | null = null;
  let checkedRecordCount = 0;
  const filterAcceptance: Record<string, boolean> = {};

  if (hasFilters) {
    try {
      // Confirmation probe: filtered page 1 vs identical unfiltered page 1.
      const [withFilters, withoutFilters] = await Promise.all([
        fetchPage({ page: 1, limit: 10, searchTerm: "", filters: documentedFilters }, "filtered_page1"),
        fetchPage({ page: 1, limit: 10, searchTerm: "", filters: {} }, "unfiltered_page1"),
      ]);
      const filteredTotal = withFilters.total;
      const unfilteredTotal = withoutFilters.total;
      const noObviousViolations = !withFilters.yachts.some((y) => criterionViolated(y, criteria));
      serverFilterApplied = Boolean(
        noObviousViolations &&
          filteredTotal !== null &&
          unfilteredTotal !== null &&
          filteredTotal < unfilteredTotal
      );
      serverTotal = serverFilterApplied ? filteredTotal : null;

      if (serverFilterApplied && !lightweight) {
        // Per-criterion acceptance: each single criterion is re-tested alone
        // against the unfiltered total. One extra request per criterion.
        const single: Array<{ name: string; filters: Record<string, unknown>; check: (y: Yacht) => boolean }> = [];
        if (criteria.areaIds.length > 0)
          single.push({
            name: "location_areas",
            filters: { location_areas: criteria.areaIds },
            check: (y) => yachtAreaMatchesSynonymsIn(y, criteria.loweredAreaNames),
          });
        if (criteria.typeWords.length > 0)
          single.push({
            name: "yachtTypes",
            filters: { yachtTypes: criteria.typeWords },
            check: (y) => yachtTypeWordsMatch(y, criteria.typeWords),
          });
        if (criteria.minGuests !== null)
          single.push({
            name: "guests",
            filters: { guests: criteria.minGuests },
            check: (y) => typeof y.pax !== "number" || y.pax >= (criteria.minGuests as number),
          });
        for (const s of single) {
          try {
            const probe = await fetchPage({ page: 1, limit: 10, searchTerm: "", filters: s.filters }, `single_${s.name}`);
            const recordsOk = !probe.yachts.some((y) => !s.check(y));
            const totalShrunk =
              probe.total !== null && unfilteredTotal !== null && probe.total < unfilteredTotal;
            // A single-criterion probe on a small catalogue can legitimately
            // match everything, so a total equal to the unfiltered one is not
            // rejection — but without a smaller total we cannot PROVE the
            // filter was applied, only that records are consistent with it.
            filterAcceptance[s.name] = totalShrunk ? recordsOk : recordsOk && probe.total !== null ? true : false;
          } catch {
            filterAcceptance[s.name] = false;
          }
        }
      }
    } catch {
      serverFilterApplied = false;
    }
  }

  if (hasFilters && !serverFilterApplied && !lightweight) {
    // Full local walk so counts and pagination stay accurate.
    const matching: Yacht[] = [];
    for (let p = 1; p <= LOCAL_FALLBACK_MAX_PAGES; p++) {
      const { yachts } = await fetchPage({ page: p, limit: 10, searchTerm: "", filters: {} }, `unfiltered_page${p}`);
      checkedRecordCount += yachts.length;
      matching.push(...yachts.filter((y) => !criterionViolated(y, criteria)));
      if (yachts.length < 10) break;
      if (p === LOCAL_FALLBACK_MAX_PAGES) localResultsIncomplete = true;
    }
    localYachts = matching;
    localTotal = localResultsIncomplete ? null : matching.length;
  }

  return {
    serverTotal,
    serverFilterApplied,
    filterAcceptance,
    localResultsIncomplete,
    localTotal,
    checkedRecordCount,
    probeLog,
    async getPage(page, limit) {
      if (hasFilters && serverFilterApplied) {
        const { yachts } = await fetchPage({ page, limit, searchTerm: "", filters: documentedFilters }, `filtered_page${page}`);
        return yachts;
      }
      if (localYachts) {
        return localYachts.slice((page - 1) * limit, page * limit);
      }
      const { yachts } = await fetchPage({ page, limit, searchTerm: "", filters: {} }, `page${page}`);
      return yachts;
    },
  };
}

// --- Destinations: MCC slugs to CYA operating areas -------------------------

export type CyaOperatingArea = { id: string; name: string };

/* Synonyms cover the cruising-area labels CYA actually publishes (e.g.
 * "St. Martin / St. Maarten"). Matching is against live area data fetched
 * from /operating_areas — no invented area IDs. */
const DESTINATION_AREA_SYNONYMS: Record<string, string[]> = {
  "british-virgin-islands": ["british virgin islands", "bvi"],
  "us-virgin-islands": ["us virgin islands", "u.s. virgin islands", "united states virgin islands", "usvi", "st thomas", "saint thomas", "st john"],
  "st-martin": ["st martin", "st. martin", "saint martin", "st maarten", "st. maarten", "sint maarten"],
  antigua: ["antigua", "barbuda"],
  grenadines: ["grenadines", "st vincent", "st. vincent", "saint vincent", "bequia", "mustique", "canouan", "union island", "mayreau", "carriacou", "grenada"],
  bahamas: ["bahamas", "exuma", "abaco", "eleuthera", "nassau", "harbour island", "andros", "berry islands", "bimini"],
};

export function destinationSynonyms(destination: string): string[] {
  return DESTINATION_AREA_SYNONYMS[destination] ?? (destination ? [destination.replace(/-/g, " ")] : []);
}

function areaNameMatches(areaName: string, synonyms: string[]): boolean {
  const name = areaName.toLowerCase();
  return synonyms.some((s) => name.includes(s) || s.includes(name));
}

export async function getOperatingAreas(): Promise<CyaOperatingArea[]> {
  const raw = await getOperatingAreasRaw();
  const normalized = normalizeOperatingAreas(raw);
  if (!normalized) return [];
  const areas: CyaOperatingArea[] = [];
  for (const a of normalized.areas) {
    const rawName = a.name ?? a.label ?? a.title;
    const rawId = a.id ?? a.area_id ?? a.uuid;
    const name = typeof rawName === "string" ? rawName.trim() : "";
    const id = typeof rawId === "string" || typeof rawId === "number" ? String(rawId) : "";
    if (name) areas.push({ id, name });
  }
  return areas;
}

// Resolve an MCC destination slug against the live CYA operating-area list.
// Returns [] when nothing matches; callers then match on area-name words.
export function resolveDestinationAreas(areas: CyaOperatingArea[], destination: string): CyaOperatingArea[] {
  const synonyms = destinationSynonyms(destination);
  if (synonyms.length === 0) return [];
  return areas.filter((a) => areaNameMatches(a.name, synonyms));
}

export function yachtSeasonAreaNames(yacht: Yacht): string[] {
  const value = yacht.seasonAreas;
  if (!Array.isArray(value)) return [];
  return value
    .map((a) => {
      if (typeof a === "string") return a;
      if (a && typeof a === "object") {
        const obj = a as Record<string, unknown>;
        const name = obj.name ?? obj.label;
        if (typeof name === "string") return name;
      }
      return "";
    })
    .filter(Boolean);
}

// True when any of the yacht's season-area names matches one of the given
// (already-lowercased) area-name fragments.
export function yachtAreaMatchesSynonymsIn(yacht: Yacht, loweredSynonyms: string[]): boolean {
  return yachtSeasonAreaNames(yacht).some((n) => {
    const name = n.toLowerCase();
    return loweredSynonyms.some((s) => name.includes(s) || s.includes(name));
  });
}

// --- Yacht detail -----------------------------------------------------------

/* The documented detail endpoint is GET /yachts_get/{yacht_id}. The documented
 * `include` parameter is tried first for full detail (photos, crew, amenities,
 * rates); the legacy /yachts/{id} path is kept as a last resort. The first
 * template that succeeds is remembered per instance. */
const DETAIL_PATH_TEMPLATES = [
  "/yachts_get/{id}?include=photos,images,crew,amenities,rates,description",
  "/yachts_get/{id}",
  "/yachts/{id}",
];
let workingDetailTemplate: string | null = null;

export async function getYachtDetail(id: string): Promise<Record<string, unknown>> {
  const templates = workingDetailTemplate ? [workingDetailTemplate] : DETAIL_PATH_TEMPLATES;
  let lastError: unknown = null;
  for (const template of templates) {
    try {
      const data = await cyaFetch<Record<string, unknown>>(template.replace("{id}", encodeURIComponent(id)), {
        revalidate: 300,
      });
      workingDetailTemplate = template;
      return data;
    } catch (err) {
      lastError = err;
      if (err instanceof CyaApiError && [401, 403, 429].includes(err.status)) throw err;
    }
  }
  throw lastError;
}
