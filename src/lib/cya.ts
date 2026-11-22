// Server-only Central Yacht Agent API client. Never import from client code:
// it reads CYA_API_KEY from the environment and must not reach the browser.
//
// Domain headers follow the observed successful diagnostic (Test B: Origin +
// Referer set to the registered domain produced HTTP 200 where the key alone
// returned 403). CYA should confirm this header behavior is supported for
// ongoing server-side integration.

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

export function getCyaConfig(): { key: string; baseUrl: string; origin: string } {
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

function cyaHeaders(origin: string, extra?: Record<string, string>): Record<string, string> {
  return {
    "X-API-Key": getCyaConfig().key,
    Origin: origin,
    Referer: `${origin}/`,
    Accept: "application/json",
    ...extra,
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

const cache = new Map<string, { data: unknown; expiresAt: number }>();

// Simple server-side cache; CYA allows 60 requests per minute, so caching
// reference data and search results keeps normal traffic well under that.
export async function cyaFetch<T>(path: string, init?: RequestInit, cacheTtlMs = 60_000): Promise<T> {
  const { baseUrl, origin } = getCyaConfig();
  const cacheKey = `${path}:${JSON.stringify(init?.body ?? "")}`;
  if (cacheTtlMs > 0) {
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > Date.now()) return hit.data as T;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: cyaHeaders(origin, init?.headers as Record<string, string> | undefined),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) throw await parseErrorResponse(response);

  const data = (await response.json()) as T;
  if (cacheTtlMs > 0) {
    cache.set(cacheKey, { data, expiresAt: Date.now() + cacheTtlMs });
    if (cache.size > 50) {
      const now = Date.now();
      for (const [k, v] of cache) if (v.expiresAt <= now) cache.delete(k);
    }
  }
  return data;
}

export type OperatingArea = { id: number | string; name: string } & Record<string, unknown>;

export function getOperatingAreas(): Promise<OperatingArea[]> {
  return cyaFetch<OperatingArea[]>("/operating_areas", undefined, 3600_000);
}

export type YachtSearchResponse = Record<string, unknown>;

export function searchYachts(body: Record<string, unknown>, cacheTtlMs = 300_000): Promise<YachtSearchResponse> {
  return cyaFetch<YachtSearchResponse>("/yachts_search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }, cacheTtlMs);
}
