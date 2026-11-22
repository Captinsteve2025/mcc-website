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
// across serverless instances. An in-memory Map would NOT be shared, so it is
// only used as a same-instance fast path.
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

export async function cyaFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<T> {
  const { baseUrl, origin } = getCyaConfig();
  const revalidate = init?.revalidate ?? 300;
  const cacheKey = `${path}:${JSON.stringify(init?.body ?? "")}`;

  const hit = memoryCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.data as T;

  const response = await fetch(`${baseUrl}${path}`, {
    method: init?.method,
    headers: {
      "X-API-Key": getCyaConfig().key,
      Origin: origin,
      Referer: `${origin}/`,
      Accept: "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
    body: init?.body,
    signal: AbortSignal.timeout(10_000),
    next: { revalidate },
  });

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

function readYachts(response: YachtSearchResponse): Yacht[] {
  return (response.yachts as Yacht[] | undefined) ?? [];
}

function readTotal(response: YachtSearchResponse): number | null {
  return typeof response.totalYachts === "number" ? response.totalYachts : null;
}

export type YachtSearchPage = {
  yachts: Yacht[];
  totalYachts: number | null;
  serverFilterApplied: boolean;
};

// Server-side filter decisions are remembered per instance for 10 minutes so
// paginated requests do not re-probe (and double) the request count.
const filterDecisionCache = new Map<string, { applied: boolean; expiresAt: number }>();
const FILTER_DECISION_TTL_MS = 10 * 60 * 1000;

/*
 * Run one page of yacht search with CYA's documented filter object. CYA's
 * accepted filter keys are not fully confirmed, so the result is verified with
 * `verify` (every returned yacht must pass the caller's field checks):
 * - verification passes -> the filter is treated as applied server-side.
 * - verification fails, the page is empty, or CYA rejects the body with a
 *   client error -> fall back to an unfiltered request and let the caller
 *   filter locally, so results stay accurate either way.
 */
export async function searchYachtsPage(params: {
  page: number;
  limit: number;
  searchTerm?: string;
  filters?: Record<string, unknown>;
  verify?: (yachts: Yacht[]) => boolean;
}): Promise<YachtSearchPage> {
  const { page, limit, searchTerm = "", filters = {}, verify } = params;

  if (Object.keys(filters).length === 0) {
    const response = await searchYachts({ page, limit, searchTerm, filters: {} });
    return { yachts: readYachts(response), totalYachts: readTotal(response), serverFilterApplied: false };
  }

  const signature = `${JSON.stringify(filters)}`;
  const cached = filterDecisionCache.get(signature);
  if (cached && cached.expiresAt > Date.now()) {
    if (cached.applied) {
      const response = await searchYachts({ page, limit, searchTerm, filters });
      return { yachts: readYachts(response), totalYachts: readTotal(response), serverFilterApplied: true };
    }
    const response = await searchYachts({ page, limit, searchTerm, filters: {} });
    return { yachts: readYachts(response), totalYachts: readTotal(response), serverFilterApplied: false };
  }

  try {
    const withFilters = await searchYachts({ page, limit, searchTerm, filters });
    const yachts = readYachts(withFilters);
    if (yachts.length > 0 && verify && verify(yachts)) {
      filterDecisionCache.set(signature, { applied: true, expiresAt: Date.now() + FILTER_DECISION_TTL_MS });
      return { yachts, totalYachts: readTotal(withFilters), serverFilterApplied: true };
    }
  } catch (err) {
    if (!(err instanceof CyaApiError) || ![400, 404, 422].includes(err.status)) throw err;
  }

  filterDecisionCache.set(signature, { applied: false, expiresAt: Date.now() + FILTER_DECISION_TTL_MS });
  const plain = await searchYachts({ page, limit, searchTerm, filters: {} });
  return { yachts: readYachts(plain), totalYachts: readTotal(plain), serverFilterApplied: false };
}

export function yachtTypeWordsMatch(yacht: Yacht, words: string[]): boolean {
  const type = typeof yacht.yachtType === "string" ? yacht.yachtType.toLowerCase() : "";
  return words.some((w) => type.includes(w));
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

// Verifier for searchYachtsPage: every returned yacht must cruise in one of
// the selected CYA areas.
export function makeDestinationVerifier(areaNames: string[]): (yachts: Yacht[]) => boolean {
  const lowered = areaNames.map((a) => a.toLowerCase());
  return (yachts) => yachts.every((y) => yachtAreaMatchesSynonymsIn(y, lowered));
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
