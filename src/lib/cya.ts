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

// One consistent URL builder: every request path is joined onto CYA_API_BASE,
// which already carries the version prefix (verified live 2026-11-22:
// https://api.centralyachtagent.com/public/api/v1). Callers must use paths
// RELATIVE to that base (/bookings, /yachts_get/{id}, ...); any historical
// leading /api/v1 or /public/api/v1 in a caller path is stripped here so the
// duplicated-prefix 404 can never recur.
export function joinCyaPath(path: string): string {
  return path.replace(/^\/+public\/api\/v1(?=\/)|^\/+api\/v1(?=\/)/, "");
}

export async function cyaFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<T> {
  const { baseUrl, origin, key } = getCyaConfig();
  const normalizedPath = joinCyaPath(path);
  const revalidate = init?.revalidate ?? 300;
  const cacheKey = `${normalizedPath}:${JSON.stringify(init?.body ?? "")}`;

  const hit = memoryCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.data as T;

  await waitForRateSlot();

  const doFetch = () =>
    fetch(`${baseUrl}${normalizedPath}`, {
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

  // Safe 429 handling: honor CYA's Retry-After. Within the 5-second budget a
  // single retry runs; a longer Retry-After is NOT retried early — the
  // rate-limit error is returned with the true suggested wait so the caller
  // (and the page) can surface the correct interval.
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after") ?? "NaN");
    const suggestedSeconds = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 2;
    if (suggestedSeconds <= 5) {
      await new Promise((resolve) => setTimeout(resolve, suggestedSeconds * 1000 + 250));
      await waitForRateSlot();
      response = await doFetch();
      if (!response.ok) throw await parseErrorResponse(response);
    } else {
      throw await parseErrorResponse(response);
    }
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
  areaIds: (string | number)[];
  /** CYA area labels for the requested destination, used ONLY for local
   *  seasonAreas verification when the server filter cannot be confirmed. */
  areaNames: string[];
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
  /** Per-criterion acceptance: "confirmed" (CYA's total shrank and records
   *  comply), "rejected" (records violate it), or "inconclusive" (records
   *  comply but the total did not shrink, so application is unproven). */
  filterAcceptance: Record<string, "confirmed" | "rejected" | "inconclusive">;
  /** True when the local fallback hit its page cap and counts are partial. */
  localResultsIncomplete: boolean;
  /** Matching total from the completed local walk; null when partial or n/a. */
  localTotal: number | null;
  /** Yachts matching from the checked records when the walk was capped. */
  checkedRecordCount: number;
  /** Match count from the local walk, exposed separately from any complete
   *  total — shown even when the walk was capped. */
  localMatchCount: number | null;
  /** Scanned records carrying no area labels while locally verifying a
   *  destination: their destination membership could not be established. */
  unverifiableAreaCount: number;
  /** True when a local walk (guest capacity pass or fallback) produced the results. */
  localWalkUsed: boolean;
  /** CYA request bodies recorded for the admin verification report. */
  probeLog: Array<{ label: string; body: Record<string, unknown>; totalYachts: number | null; listings: number }>;
};

const WALK_PAGE_SIZE = 100;
const WALK_MAX_PAGES = 8;

function typeViolated(yacht: Yacht, typeWords: string[]): boolean {
  return typeWords.length > 0 && !yachtTypeWordsMatch(yacht, typeWords);
}

// Verified live: CYA rejects filters.guests (HTTP 422) and ignores filters.pax,
// so guest capacity is never sent server-side. Unknown capacities are excluded
// from local matches rather than assumed to comply.
function guestViolated(yacht: Yacht, minGuests: number | null): boolean {
  return minGuests !== null && (typeof yacht.pax !== "number" || yacht.pax < minGuests);
}

// Local destination verification: match a yacht's season area labels against
// the reviewed mapping's CYA area labels (substring in either direction).
function areaLabelMatches(yacht: Yacht, loweredNames: string[]): boolean {
  const labels = yachtSeasonAreaNames(yacht).map((n) => n.toLowerCase());
  return labels.some((label) => loweredNames.some((n) => label.includes(n) || n.includes(label)));
}

type PageFetcher = (
  body: Record<string, unknown>,
  label: string
) => Promise<{ yachts: Yacht[]; total: number | null }>;

async function walkInventory(
  fetchPage: PageFetcher,
  makeBody: (page: number) => Record<string, unknown>,
  labelPrefix: string,
  keep: (y: Yacht) => boolean,
  knownTotal: number | null
): Promise<{ matches: Yacht[]; checked: number; incomplete: boolean }> {
  const matches: Yacht[] = [];
  let checked = 0;
  let pageSize = 0;
  let incomplete = false;
  for (let p = 1; p <= WALK_MAX_PAGES; p++) {
    const { yachts } = await fetchPage(makeBody(p), `${labelPrefix}_page${p}`);
    if (p === 1) pageSize = yachts.length;
    checked += yachts.length;
    matches.push(...yachts.filter(keep));
    if (pageSize > 0 && yachts.length < pageSize) break;
    if (p === WALK_MAX_PAGES) incomplete = true;
  }
  if (knownTotal !== null && checked < knownTotal) incomplete = true;
  return { matches, checked, incomplete };
}

/*
 * One search session per page render. Verified live (2026-11-22):
 * - filters.location_areas: ["13","15"] -> 400 yachts (server-side, confirmed)
 * - filters.yachtTypes: ["catamaran"] -> 694 (server-side, confirmed)
 * - filters.guests -> HTTP 422; filters.pax -> ignored. Never sent.
 * The session sends only the two confirmed server filters, CONFIRMS they were
 * applied (filtered page-1 total strictly smaller than unfiltered, no
 * violating records), and applies minimum guest capacity locally over the
 * resulting inventory, excluding yachts with unknown pax. Walks use large
 * pages capped for rate safety; a capped walk is flagged incomplete rather
 * than presented as complete.
 */
export async function startYachtSearchSession(
  criteria: SearchCriteria,
  options?: { lightweight?: boolean }
): Promise<YachtSearchSession> {
  // filters.guests is deliberately absent: CYA rejects it with HTTP 422 and
  // ignores filters.pax, so capacity filtering happens locally (verified live
  // on 2026-11-22). Only location_areas and yachtTypes go to CYA.
  const documentedFilters: Record<string, unknown> = {};
  if (criteria.areaIds.length > 0) documentedFilters.location_areas = criteria.areaIds;
  if (criteria.typeWords.length > 0) documentedFilters.yachtTypes = criteria.typeWords;
  const hasServerFilters = Object.keys(documentedFilters).length > 0;
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
  let unfilteredTotal: number | null = null;
  let localWalkUsed = false;
  let localMatchCount: number | null = null;
  let unverifiableAreaCount = 0;
  const loweredAreaNames = criteria.areaNames.map((n) => n.toLowerCase());
  // Local area-label verification only runs when CYA did NOT confirm the
  // destination filter — a confirmed server filter already proves coverage.
  // Evaluated lazily: serverFilterApplied is only known after the probe below.
  const locallyVerifiesArea = () => loweredAreaNames.length > 0 && !serverFilterApplied;
  const keepYacht = (y: Yacht): boolean => {
    if (locallyVerifiesArea()) {
      if (yachtSeasonAreaNames(y).length === 0) {
        unverifiableAreaCount += 1;
        return false;
      }
      if (!areaLabelMatches(y, loweredAreaNames)) return false;
    }
    if (guestViolated(y, criteria.minGuests)) return false;
    if (!serverFilterApplied && typeViolated(y, criteria.typeWords)) return false;
    return true;
  };
  const filterAcceptance: Record<string, "confirmed" | "rejected" | "inconclusive"> = {};

  if (hasServerFilters) {
    try {
      // Confirmation probe: filtered page 1 vs identical unfiltered page 1.
      const [withFilters, withoutFilters] = await Promise.all([
        fetchPage({ page: 1, limit: 10, searchTerm: "", filters: documentedFilters }, "filtered_page1"),
        fetchPage({ page: 1, limit: 10, searchTerm: "", filters: {} }, "unfiltered_page1"),
      ]);
      const filteredTotal = withFilters.total;
      unfilteredTotal = withoutFilters.total;
      const noTypeViolations = !withFilters.yachts.some((y) => typeViolated(y, criteria.typeWords));
      serverFilterApplied = Boolean(
        noTypeViolations &&
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
            check: () => true, // area membership is judged from CYA's own totals
          });
        if (criteria.typeWords.length > 0)
          single.push({
            name: "yachtTypes",
            filters: { yachtTypes: criteria.typeWords },
            check: (y) => yachtTypeWordsMatch(y, criteria.typeWords),
          });
        for (const s of single) {
          try {
            const probe = await fetchPage({ page: 1, limit: 10, searchTerm: "", filters: s.filters }, `single_${s.name}`);
            const recordsOk = !probe.yachts.some((y) => !s.check(y));
            const totalShrunk =
              probe.total !== null && unfilteredTotal !== null && probe.total < unfilteredTotal;
            // Matching records alone do NOT prove CYA applied the filter — on
            // a small catalogue an unfiltered response looks identical. Only
            // a strictly smaller CYA total confirms; violating records
            // reject; otherwise the result is inconclusive.
            filterAcceptance[s.name] = !recordsOk ? "rejected" : totalShrunk ? "confirmed" : "inconclusive";
          } catch {
            filterAcceptance[s.name] = "inconclusive";
          }
        }
      }
    } catch {
      serverFilterApplied = false;
    }
  }

  // Capacity is never a CYA filter: when a minimum guest count is requested,
  // walk the best inventory available (the confirmed server-filtered set, or
  // the unfiltered catalogue with type words applied locally) and keep only
  // yachts whose pax is known and sufficient.
  const guestWalk = criteria.minGuests !== null;
  const fallbackWalk = hasServerFilters && !serverFilterApplied && !guestWalk;

  if (guestWalk && !lightweight) {
    const serverFilters = serverFilterApplied ? documentedFilters : {};
    const knownTotal = serverFilterApplied ? serverTotal : unfilteredTotal;
    try {
      const walk = await walkInventory(
        fetchPage,
        (p) => ({ page: p, limit: WALK_PAGE_SIZE, searchTerm: "", filters: serverFilters }),
        serverFilterApplied ? "guestwalk_filtered" : "guestwalk_unfiltered",
        keepYacht,
        knownTotal
      );
      localYachts = walk.matches;
      localTotal = walk.incomplete ? null : walk.matches.length;
      localMatchCount = walk.matches.length;
      localResultsIncomplete = walk.incomplete;
      checkedRecordCount = walk.checked;
      localWalkUsed = true;
    } catch {
      localYachts = [];
      localTotal = null;
      localMatchCount = 0;
      localResultsIncomplete = true;
      localWalkUsed = true;
    }
  } else if (fallbackWalk && !lightweight) {
    try {
      const walk = await walkInventory(
        fetchPage,
        (p) => ({ page: p, limit: WALK_PAGE_SIZE, searchTerm: "", filters: {} }),
        "unfiltered",
        keepYacht,
        unfilteredTotal
      );
      localYachts = walk.matches;
      localTotal = walk.incomplete ? null : walk.matches.length;
      localMatchCount = walk.matches.length;
      localResultsIncomplete = walk.incomplete;
      checkedRecordCount = walk.checked;
      localWalkUsed = true;
    } catch {
      localYachts = [];
      localTotal = null;
      localMatchCount = 0;
      localResultsIncomplete = true;
      localWalkUsed = true;
    }
  }

  return {
    serverTotal,
    serverFilterApplied,
    filterAcceptance,
    localResultsIncomplete,
    localTotal,
    checkedRecordCount,
    localMatchCount,
    unverifiableAreaCount,
    localWalkUsed,
    probeLog,
    async getPage(page, limit) {
      if (localYachts) {
        // Local walk (guest capacity pass or fallback): serve from matches.
        return localYachts.slice((page - 1) * limit, page * limit);
      }
      if (hasServerFilters && serverFilterApplied) {
        const { yachts } = await fetchPage({ page, limit, searchTerm: "", filters: documentedFilters }, `filtered_page${page}`);
        return yachts;
      }
      const { yachts } = await fetchPage({ page, limit, searchTerm: "", filters: {} }, `page${page}`);
      return yachts;
    },
  };
}

// --- Traced variants for the production diagnostic ---------------------------
// These record the actual request path, HTTP status and a sanitized body at
// each step so a failure is identified from the API's own response, not
// inferred. Guests' personal data never appears (only calendar titles).

export type LegacyMappingTrace = {
  requestPath: string;
  executed: boolean;
  skipped: boolean;
  httpStatus: number | null;
  body: unknown;
  extractedCurrentId: string | null;
  error: string | null;
};

export async function traceLegacyIdMapping(legacyId: string): Promise<LegacyMappingTrace> {
  // Relative to CYA_API_BASE (which already ends in /api/v1); joinCyaPath
  // strips any duplicated prefix as a safety net.
  const requestPath = joinCyaPath(`/api/v1/yachts/legacy/${encodeURIComponent(legacyId)}`);
  try {
    const payload = await cyaFetch<Record<string, unknown>>(requestPath, { revalidate: 86_400 });
    let extractedCurrentId: string | null = null;
    if (payload && typeof payload === "object") {
      for (const key of ["new_yacht_id", "yacht_id", "new_id", "id", "current_yacht_id"]) {
        const value = payload[key];
        if (typeof value === "string" && /^[a-f0-9]{8,32}$/i.test(value)) {
          extractedCurrentId = value;
          break;
        }
        if (typeof value === "number") {
          extractedCurrentId = String(value);
          break;
        }
      }
    }
    return { requestPath, httpStatus: 200, executed: true, skipped: false, body: payload, extractedCurrentId, error: null };
  } catch (err) {
    return {
      requestPath,
      httpStatus: err instanceof CyaApiError ? err.status : null,
      executed: true,
      skipped: false,
      body: null,
      extractedCurrentId: null,
      error: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }
}

export type BookingsTrace = {
  requestPath: string;
  yachtIdUsed: string;
  executed: boolean;
  skipped: boolean;
  httpStatus: number | null;
  bodyShape: string;
  bookingCount: number | null;
  sampleBookings: Array<{ start: string; end: string; category: string; holdExpire: string | null; title: string | null }>;
  error: string | null;
};

export async function traceBookings(yachtId: string): Promise<BookingsTrace> {
  // Corrected primary route (production evidence 2026-11-22): the configured
  // base already ends in /api/v1, so the bookings path is /bookings. The old
  // /api/v1/bookings spelling produced .../api/v1/api/v1/bookings (404).
  const requestPath = joinCyaPath(`/api/v1/bookings?yacht_id=${encodeURIComponent(yachtId)}`);
  try {
    const payload = await cyaFetch<{ bookings?: unknown } | unknown[]>(requestPath, { revalidate: 300 });
    const list = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && Array.isArray((payload as { bookings?: unknown }).bookings)
        ? (payload as { bookings: unknown[] }).bookings
        : null;
    const sample = (list ?? []).slice(0, 5).map((raw) => {
      const b = (raw ?? {}) as Record<string, unknown>;
      return {
        start: typeof b.event_start_date === "string" ? b.event_start_date.slice(0, 10) : "",
        end: typeof b.event_end_date === "string" ? b.event_end_date.slice(0, 10) : "",
        category: typeof b.category === "string" ? b.category : "",
        holdExpire: typeof b.hold_expire_date === "string" ? b.hold_expire_date.slice(0, 10) : null,
        title: typeof b.title === "string" ? b.title.slice(0, 40) : null,
      };
    });
    return {
      requestPath,
      yachtIdUsed: yachtId,
      httpStatus: 200,
      executed: true,
      skipped: false,
      bodyShape: Array.isArray(payload) ? "bare array" : payload && typeof payload === "object" ? `object with keys [${Object.keys(payload).join(", ")}]` : "other",
      bookingCount: list ? list.length : null,
      sampleBookings: sample,
      error: null,
    };
  } catch (err) {
    return {
      requestPath,
      yachtIdUsed: yachtId,
      httpStatus: err instanceof CyaApiError ? err.status : null,
      executed: true,
      skipped: false,
      bodyShape: "unavailable",
      bookingCount: null,
      sampleBookings: [],
      error: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }
}

// Raw GET trace for alternate routes and support endpoints. The body is
// sanitized: objects keep their keys with truncated values, arrays are capped
// so no credential or bulk data ever reaches the report.
export type RawTrace = {
  requestPath: string;
  executed: boolean;
  skipped: boolean;
  httpStatus: number | null;
  sanitizedBody: unknown;
  error: string | null;
};

export function sanitizeForReport(value: unknown, depth = 0): unknown {
  if (value === null || typeof value !== "object") {
    if (typeof value === "string" && value.length > 200) return `${value.slice(0, 200)}…`;
    return value;
  }
  if (depth > 3) return "(truncated)";
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => sanitizeForReport(v, depth + 1));
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 40)
      .map(([k, v]) => [k, sanitizeForReport(v, depth + 1)])
  );
}

export async function traceRawGet(path: string): Promise<RawTrace> {
  try {
    const payload = await cyaFetch<unknown>(path, { revalidate: 60 });
    return {
      requestPath: path,
      executed: true,
      skipped: false,
      httpStatus: 200,
      sanitizedBody: sanitizeForReport(payload),
      error: null,
    };
  } catch (err) {
    return {
      requestPath: path,
      executed: true,
      skipped: false,
      httpStatus: err instanceof CyaApiError ? err.status : null,
      sanitizedBody: null,
      error: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }
}

// --- Destinations: MCC slugs to CYA operating areas -------------------------

export type CyaOperatingArea = { id: string; name: string };

/* Explicit, reviewed mapping from live verification (2026-11-22):
 * CYA /operating_areas returns 57 areas using { id, label }.
 * Exact: 13 = "Caribbean Virgin Islands (BVI)", 15 = "Caribbean Virgin
 * Islands (US/BVI)" (CYA's combined area — included in the BVI and USVI
 * mappings), 14 = USVI, 6 = Bahamas.
 * Regional: 12 = Caribbean Leewards (covers Antigua and St Martin), 16 =
 * Caribbean Windwards (covers the Grenadines). Regional results span the
 * broader cruising region — exact-island availability is confirmed with the
 * charter team, never assumed. */
export const DESTINATION_AREA_MAPPING: Record<
  string,
  { label: string; areaIds: number[]; scope: "exact" | "regional"; regionNote: string }
> = {
  "british-virgin-islands": { label: "British Virgin Islands", areaIds: [13, 15], scope: "exact", regionNote: "" },
  "us-virgin-islands": { label: "US Virgin Islands", areaIds: [14, 15], scope: "exact", regionNote: "" },
  bahamas: { label: "Bahamas", areaIds: [6], scope: "exact", regionNote: "" },
  antigua: {
    label: "Antigua",
    areaIds: [12],
    scope: "regional",
    regionNote:
      "Antigua results cover CYA's broader Caribbean Leewards area, so they include neighbouring Leeward islands. Exact-island cruising availability is confirmed by our team with your enquiry.",
  },
  "st-martin": {
    label: "St Martin",
    areaIds: [12],
    scope: "regional",
    regionNote:
      "St Martin results cover CYA's broader Caribbean Leewards area, so they include neighbouring Leeward islands. Exact-island cruising availability is confirmed by our team with your enquiry.",
  },
  grenadines: {
    label: "The Grenadines",
    areaIds: [16],
    scope: "regional",
    regionNote:
      "Grenadines results cover CYA's broader Caribbean Windwards area, so they include neighbouring Windward islands. Exact-island cruising availability is confirmed by our team with your enquiry.",
  },
};

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

// Resolve an MCC destination slug to CYA areas via the explicit reviewed
// mapping, validated against the live area list. Returns [] when the
// destination is unmapped (pending review) or its IDs are absent live.
export function resolveDestinationAreas(areas: CyaOperatingArea[], destination: string): CyaOperatingArea[] {
  const entry = DESTINATION_AREA_MAPPING[destination];
  if (!entry || entry.areaIds.length === 0) return [];
  const wanted = new Set(entry.areaIds.map(String));
  return areas.filter((a) => wanted.has(String(a.id)));
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

// --- Yacht detail -----------------------------------------------------------

/* The documented detail endpoint is GET /yachts_get/{yacht_id}. Live
 * verification confirmed it works and returns the full field set, so the
 * include-parameter and legacy-path variants are no longer probed. */
export function getYachtDetail(id: string): Promise<Record<string, unknown>> {
  return cyaFetch<Record<string, unknown>>(`/yachts_get/${encodeURIComponent(id)}`, {
    revalidate: 300,
  });
}

// --- Bookings (authorized availability) -------------------------------------

/* Verified in production (2026-11-22): GET {base}/bookings?yacht_id=...
 * returns 200, while the previously built {base}/api/v1/bookings returned 404
 * (duplicated version prefix). CYA_API_BASE already ends in /api/v1, so all
 * paths are relative to it. Returns all ongoing and future bookings from the
 * yacht calendar collection; 404 means "Yacht not found". */
export type CyaBooking = {
  id: string;
  yachtId: string;
  category: string;
  yachtName: string | null;
  startDate: string;
  endDate: string;
  /** When present and still in the future, the booking is an option/hold. */
  holdExpireDate: string | null;
  title: string | null;
};

function isoDay(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(value)) return null;
  return value.slice(0, 10);
}

// Bookings live in CYA's current (post-migration) id space. Production
// evidence (2026-11-22, ENDLESS HORIZON): the catalogue id from /yachts_search
// answers 200 on /bookings, so the catalogue id is tried first and legacy
// resolution is only attempted when CYA itself answers 404 ("Yacht not
// found"). Resolution is cached for the process lifetime plus a long
// data-cache window: the mapping is stable, and a wrong lookup must not be
// re-asked per page view.
const legacyResolutionCache = new Map<string, string | null>();

export async function resolveLegacyYachtId(legacyId: string): Promise<string | null> {
  if (legacyResolutionCache.has(legacyId)) return legacyResolutionCache.get(legacyId) ?? null;
  try {
    const payload = await cyaFetch<Record<string, unknown>>(
      `/yachts/legacy/${encodeURIComponent(legacyId)}`,
      { revalidate: 86_400 }
    );
    let resolvedId: string | null = null;
    if (payload && typeof payload === "object") {
      for (const key of ["new_yacht_id", "yacht_id", "new_id", "id", "current_yacht_id"]) {
        const value = payload[key];
        if (typeof value === "string" && /^[a-f0-9]{8,32}$/i.test(value)) {
          resolvedId = value;
          break;
        }
        if (typeof value === "number") {
          resolvedId = String(value);
          break;
        }
      }
    }
    legacyResolutionCache.set(legacyId, resolvedId);
    return resolvedId;
  } catch {
    // 404 means no mapping exists for this id — cache the negative result so
    // the original id is used directly on subsequent calls.
    legacyResolutionCache.set(legacyId, null);
    return null;
  }
}

function parseCyaBookings(payload: { bookings?: unknown } | unknown[], fallbackYachtId: string): CyaBooking[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { bookings?: unknown }).bookings)
      ? (payload as { bookings: unknown[] }).bookings
      : [];
  const today = new Date().toISOString().slice(0, 10);
  const bookings: CyaBooking[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as Record<string, unknown>;
    const start = isoDay(b.event_start_date);
    const end = isoDay(b.event_end_date);
    const id = typeof b._id === "string" ? b._id : "";
    const category = typeof b.category === "string" ? b.category : "";
    if (!start || !end || !id || !category) continue;
    if (end < today) continue; // documented: only ongoing/future bookings
    const holdExpire = isoDay(b.hold_expire_date);
    bookings.push({
      id,
      yachtId: typeof b.yacht_id === "string" ? b.yacht_id : fallbackYachtId,
      category,
      yachtName: typeof b.yacht_name === "string" ? b.yacht_name : null,
      startDate: start,
      endDate: end,
      holdExpireDate: holdExpire,
      title: typeof b.title === "string" && b.title.trim() ? b.title.trim() : null,
    });
  }
  return bookings;
}

export async function getYachtBookings(yachtId: string): Promise<CyaBooking[]> {
  // The catalogue id is valid in the bookings system (verified live), so it is
  // used directly. Only when CYA answers 404 ("Yacht not found") is the
  // legacy-id mapping attempted and the request retried with the resolved id.
  try {
    const payload = await cyaFetch<{ bookings?: unknown } | unknown[]>(
      `/bookings?yacht_id=${encodeURIComponent(yachtId)}`,
      { revalidate: 300 }
    );
    return parseCyaBookings(payload, yachtId);
  } catch (err) {
    if (!(err instanceof CyaApiError) || err.status !== 404) throw err;
    const resolved = await resolveLegacyYachtId(yachtId);
    if (!resolved || resolved === yachtId) throw err;
    const payload = await cyaFetch<{ bookings?: unknown } | unknown[]>(
      `/bookings?yacht_id=${encodeURIComponent(resolved)}`,
      { revalidate: 300 }
    );
    return parseCyaBookings(payload, resolved);
  }
}
