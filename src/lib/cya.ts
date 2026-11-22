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

export function searchYachts(body: Record<string, unknown>): Promise<YachtSearchResponse> {
  return cyaFetch<YachtSearchResponse>("/yachts_search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    revalidate: 300,
  });
}

export function getYachtDetail(id: string): Promise<Record<string, unknown>> {
  return cyaFetch<Record<string, unknown>>(`/yachts/${encodeURIComponent(id)}`, { revalidate: 300 });
}
