import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_DOMAIN = "mcc-website-one.vercel.app";

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const SAFE_RESPONSE_HEADERS = [
  "content-type",
  "server",
  "via",
  "cf-ray",
  "retry-after",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
] as const;

function extractSafeHeaders(response: Response): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of SAFE_RESPONSE_HEADERS) {
    const value = response.headers.get(name);
    if (value !== null) out[name] = value;
  }
  return out;
}

// Never return a raw body to the browser: keep only a short code/message when
// the API answers with JSON, and only a content-type note otherwise.
function sanitizeErrorBody(body: string, contentType: string | null): string | null {
  if (contentType && contentType.includes("application/json")) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        const code = obj.error ?? obj.code ?? obj.message;
        if (typeof code === "string" && code.length > 0) {
          return code.slice(0, 200);
        }
      }
      return "JSON response with no readable error code.";
    } catch {
      return "Unreadable JSON response.";
    }
  }
  if (contentType && contentType.includes("text/html")) {
    return "HTML error page returned instead of JSON.";
  }
  return contentType ? `Non-JSON response (${contentType}).` : null;
}

async function callOperatingAreas(extraHeaders: Record<string, string>): Promise<{
  httpStatus: number;
  contentType: string | null;
  safeHeaders: Record<string, string>;
  errorInfo: string | null;
  areaCount: number | null;
  sampleAreas: string[];
}> {
  const key = process.env.CYA_API_KEY as string;
  const base = (process.env.CYA_API_BASE as string).replace(/\/+$/, "");

  const response = await fetch(`${base}/operating_areas`, {
    headers: { "X-API-Key": key, Accept: "application/json", ...extraHeaders },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");
  const body = await response.text();

  let areaCount: number | null = null;
  let sampleAreas: string[] = [];
  if (response.ok && contentType?.includes("application/json")) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (Array.isArray(parsed)) {
        areaCount = parsed.length;
        sampleAreas = parsed
          .slice(0, 5)
          .map((item) =>
            item && typeof item === "object" && "name" in item
              ? String((item as { name: unknown }).name)
              : ""
          )
          .filter(Boolean);
      }
    } catch {
      areaCount = null;
    }
  }

  return {
    httpStatus: response.status,
    contentType,
    safeHeaders: extractSafeHeaders(response),
    errorInfo: response.ok ? null : sanitizeErrorBody(body, contentType),
    areaCount,
    sampleAreas,
  };
}

function missingConfigResponse() {
  const key = process.env.CYA_API_KEY;
  const base = process.env.CYA_API_BASE;
  return NextResponse.json(
    {
      connected: false,
      keyConfigured: Boolean(key),
      baseUrlConfigured: Boolean(base),
      message:
        "Missing environment configuration. CYA_API_KEY and CYA_API_BASE must both be set in the server environment (Vercel project settings).",
    },
    { status: 503 }
  );
}

function validateBase(): { parsedBase: URL } | { response: NextResponse } {
  const parsedBase = new URL(process.env.CYA_API_BASE as string);
  if (parsedBase.protocol !== "https:") {
    return { response: NextResponse.json({ connected: false, message: "CYA_API_BASE must use https." }, { status: 503 }) };
  }
  return { parsedBase };
}

export async function GET(request: Request) {
  // Header-only: keeping the token out of the URL keeps it out of access logs
  // and browser history.
  const adminToken = request.headers.get("x-admin-token");

  if (process.env.NODE_ENV !== "development" && !process.env.ADMIN_API_TOKEN) {
    return NextResponse.json(
      { error: "Not available. Set ADMIN_API_TOKEN in the deployment environment to enable this check." },
      { status: 404 }
    );
  }

  if (process.env.NODE_ENV !== "development" && !adminTokenMatches(adminToken, process.env.ADMIN_API_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagnose = new URL(request.url).searchParams.get("diagnose") === "1";

  if (!process.env.CYA_API_KEY || !process.env.CYA_API_BASE) {
    return missingConfigResponse();
  }

  const baseCheck = validateBase();
  if ("response" in baseCheck) return baseCheck.response;

  if (diagnose) {
    // Exactly two requests per run, no retries.
    try {
      const testA = await callOperatingAreas({});
      const testB = await callOperatingAreas({
        Origin: `https://${SITE_DOMAIN}`,
        Referer: `https://${SITE_DOMAIN}/`,
      });

      const sameStatus = testA.httpStatus === testB.httpStatus;
      const both403 = testA.httpStatus === 403 && testB.httpStatus === 403;
      let likelyCause: string;
      if (testA.httpStatus === 200 || testB.httpStatus === 200) {
        likelyCause = "At least one request succeeded. If only Test B succeeded, CYA is using the Origin/Referer header to check the registered domain.";
      } else if (both403) {
        likelyCause =
          "Both requests were rejected with 403. Adding the registered-domain headers did not change the outcome, so the domain headers are likely not the mechanism. Most likely causes: the CYA_API_KEY value is invalid or revoked, or CYA restricts by server IP address or another property that does not match. Contact CYA to confirm the key status and how the domain restriction is enforced for server-to-server requests.";
      } else if (sameStatus) {
        likelyCause = `Both requests returned ${testA.httpStatus}; the domain headers made no difference.`;
      } else {
        likelyCause = `The two requests returned different statuses (${testA.httpStatus} vs ${testB.httpStatus}), which suggests the domain headers do influence CYA's decision.`;
      }

      return NextResponse.json({
        mccAuth: "successful",
        tests: {
          A: {
            label: "Test A: standard request (X-API-Key only)",
            ...testA,
          },
          B: {
            label: `Test B: with Origin and Referer set to https://${SITE_DOMAIN}`,
            ...testB,
          },
        },
        comparison: sameStatus
          ? `Both requests returned HTTP ${testA.httpStatus}. The domain headers made no difference.`
          : `Test A returned ${testA.httpStatus}, Test B returned ${testB.httpStatus}.`,
        likelyCause,
        executedServerSide: true,
        note: "Exactly two requests were made. Do not repeat the diagnostic repeatedly.",
      });
    } catch {
      return NextResponse.json(
        {
          mccAuth: "successful",
          connected: false,
          diagnosis: "Could not reach the CYA API (network error or timeout). Verify CYA_API_BASE and that the host is reachable from the server.",
        },
        { status: 502 }
      );
    }
  }

  try {
    const baseUrl = (process.env.CYA_API_BASE as string).replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/operating_areas`, {
      headers: { "X-API-Key": process.env.CYA_API_KEY as string, Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (response.status === 403) {
      return NextResponse.json({
        mccAuth: "successful",
        connected: false,
        cyaHttpStatus: 403,
        diagnosis: `Authentication rejected (403). Run the diagnostic from the admin page to compare a standard request with one carrying the registered-domain headers.`,
      });
    }

    if (response.status === 401) {
      return NextResponse.json({
        mccAuth: "successful",
        connected: false,
        cyaHttpStatus: 401,
        diagnosis: "Authentication failed (401). The CYA_API_KEY value is missing or not accepted. Re-check the key in Vercel.",
      });
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      return NextResponse.json(
        {
          mccAuth: "successful",
          connected: false,
          cyaHttpStatus: 429,
          retryAfterSeconds: retryAfter ? Number(retryAfter) : null,
          diagnosis: `Rate limited (429). Wait${retryAfter ? ` about ${retryAfter} seconds` : " a few minutes"} before testing again; do not retry repeatedly.`,
        },
        { status: 200 }
      );
    }

    if (!response.ok) {
      return NextResponse.json({
        mccAuth: "successful",
        connected: false,
        cyaHttpStatus: response.status,
        diagnosis: `The API responded with status ${response.status}.`,
      });
    }

    const body: unknown = await response.json();
    let areaCount = 0;
    let sampleNames: string[] = [];
    if (Array.isArray(body)) {
      areaCount = body.length;
      sampleNames = body
        .slice(0, 5)
        .map((item) => (item && typeof item === "object" && "name" in item ? String((item as { name: unknown }).name) : ""))
        .filter(Boolean);
    }

    return NextResponse.json({
      mccAuth: "successful",
      connected: true,
      cyaHttpStatus: response.status,
      cruisingAreasReturned: areaCount,
      sampleAreas: sampleNames,
      executedServerSide: true,
      message: "Central Yacht Agent connection succeeded. The request ran in the server runtime; the API key was never sent to the browser.",
    });
  } catch {
    return NextResponse.json(
      {
        mccAuth: "successful",
        connected: false,
        diagnosis: "Could not reach the API (network error, timeout, or invalid base URL). Verify CYA_API_BASE and that the host is reachable from the server.",
      },
      { status: 502 }
    );
  }
}
