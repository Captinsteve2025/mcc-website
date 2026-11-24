import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { importBrowserTestResult, type BrowserTestResultRow } from "@/lib/browser-tests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Import endpoint for externally executed browser tests (Playwright run from a
// workstation or GitHub Actions after a Vercel deploy). Authentication mirrors
// the site-health endpoint: x-admin-token, or Bearer CRON_SECRET for CI.

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function authorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  const adminToken = request.headers.get("x-admin-token");
  if (process.env.NODE_ENV !== "development" && !process.env.ADMIN_API_TOKEN) return false;
  if (process.env.NODE_ENV === "development") return true;
  return adminTokenMatches(adminToken, process.env.ADMIN_API_TOKEN);
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    const message = process.env.ADMIN_API_TOKEN || process.env.CRON_SECRET
      ? "Unauthorized"
      : "Not available. Set ADMIN_API_TOKEN (or CRON_SECRET for CI) in the deployment environment to enable browser-result imports.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }
  const yachtId = typeof body.yachtId === "string" ? body.yachtId : "";
  if (!/^[a-f0-9]{8,32}$/i.test(yachtId)) {
    return NextResponse.json({ error: "yachtId must be the CYA yacht identifier." }, { status: 400 });
  }
  const viewport = body.viewport === "mobile" ? "mobile" : "desktop";
  const testsTotal = typeof body.testsTotal === "number" ? body.testsTotal : 0;
  const testsFailed = typeof body.testsFailed === "number" ? body.testsFailed : 0;
  const result: BrowserTestResultRow = {
    ranAt: typeof body.ranAt === "string" ? body.ranAt : new Date().toISOString(),
    commitSha: typeof body.commitSha === "string" ? body.commitSha : null,
    deploymentId: typeof body.deploymentId === "string" ? body.deploymentId : null,
    yachtId,
    yachtName: typeof body.yachtName === "string" ? body.yachtName : null,
    viewport,
    passed: body.passed === true && testsFailed === 0,
    testsTotal,
    testsFailed,
    brokenImages: typeof body.brokenImages === "number" ? body.brokenImages : 0,
    failures: asStringArray(body.failures),
    browserErrors: asStringArray(body.browserErrors),
    runner: typeof body.runner === "string" ? body.runner.slice(0, 100) : "playwright",
    reportUrl: typeof body.reportUrl === "string" && /^https:\/\//i.test(body.reportUrl) ? body.reportUrl : null,
  };
  const { stored, error } = await importBrowserTestResult(result);
  if (!stored) return NextResponse.json({ error: error ?? "Import failed." }, { status: 500 });
  return NextResponse.json({ stored: true, ranAt: result.ranAt, yachtId: result.yachtId, viewport: result.viewport });
}
