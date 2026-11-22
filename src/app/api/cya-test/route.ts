import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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

  const key = process.env.CYA_API_KEY;
  const base = process.env.CYA_API_BASE;

  if (!key || !base) {
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

  let parsedBase: URL;
  try {
    parsedBase = new URL(base);
  } catch {
    return NextResponse.json(
      { connected: false, message: "CYA_API_BASE is not a valid URL." },
      { status: 503 }
    );
  }

  if (parsedBase.protocol !== "https:") {
    return NextResponse.json(
      { connected: false, message: "CYA_API_BASE must use https." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${parsedBase.origin}/operating_areas`, {
      headers: { "X-API-Key": key, Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (response.status === 403) {
      return NextResponse.json({
        connected: false,
        keyConfigured: true,
        baseUrlConfigured: true,
        httpStatus: 403,
        diagnosis: `Authentication rejected (403). With an API key present, this usually means the key is invalid or restricted to a different domain than the one CYA sees for this server-to-server request (authorized domain: mcc-website-one.vercel.app). Note Vercel server-side requests do not carry a browser Referer, so CYA may see no domain at all — confirm with CYA how the domain restriction applies to server-side calls.`,
      });
    }

    if (response.status === 401) {
      return NextResponse.json({
        connected: false,
        keyConfigured: true,
        baseUrlConfigured: true,
        httpStatus: 401,
        diagnosis: "Authentication failed (401). The CYA_API_KEY value is missing or not accepted. Re-check the key in Vercel.",
      });
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      return NextResponse.json(
        {
          connected: false,
          keyConfigured: true,
          baseUrlConfigured: true,
          httpStatus: 429,
          retryAfterSeconds: retryAfter ? Number(retryAfter) : null,
          diagnosis: `Rate limited (429). Wait${retryAfter ? ` about ${retryAfter} seconds` : " a few minutes"} before testing again; do not retry repeatedly.`,
        },
        { status: 200 }
      );
    }

    if (!response.ok) {
      return NextResponse.json({
        connected: false,
        keyConfigured: true,
        baseUrlConfigured: true,
        httpStatus: response.status,
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
      connected: true,
      keyConfigured: true,
      baseUrlConfigured: true,
      httpStatus: response.status,
      cruisingAreasReturned: areaCount,
      sampleAreas: sampleNames,
      executedServerSide: true,
      message: "Central Yacht Agent connection succeeded. The request ran in the server runtime; the API key was never sent to the browser.",
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        keyConfigured: true,
        baseUrlConfigured: true,
        diagnosis: "Could not reach the API (network error, timeout, or invalid base URL). Verify CYA_API_BASE and that the host is reachable from the server.",
      },
      { status: 502 }
    );
  }
}
