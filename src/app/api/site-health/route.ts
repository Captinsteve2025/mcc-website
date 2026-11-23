import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runSiteHealth } from "@/lib/site-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Production health monitor endpoint. Two authentication modes:
// 1. Admin: x-admin-token header (same token as the other diagnostics).
// 2. Vercel Cron: the CRON_SECRET secret sent by Vercel as an
//    Authorization: Bearer <CRON_SECRET> header on scheduled GETs.

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function authorized(request: Request): { ok: boolean; trigger: string } {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return { ok: true, trigger: "cron" };
  }
  const adminToken = request.headers.get("x-admin-token");
  if (process.env.NODE_ENV !== "development" && !process.env.ADMIN_API_TOKEN) {
    return { ok: false, trigger: "admin" };
  }
  if (process.env.NODE_ENV === "development" || adminTokenMatches(adminToken, process.env.ADMIN_API_TOKEN)) {
    return { ok: true, trigger: "admin" };
  }
  return { ok: false, trigger: "admin" };
}

function yachtIdsFrom(request: Request): string[] {
  return (new URL(request.url).searchParams.get("yacht_ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-f0-9]{8,32}$/i.test(s));
}

export async function GET(request: Request) {
  const auth = authorized(request);
  if (!auth.ok) {
    const message = process.env.ADMIN_API_TOKEN
      ? "Unauthorized"
      : "Not available. Set ADMIN_API_TOKEN in the deployment environment to enable this check.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
  const report = await runSiteHealth(yachtIdsFrom(request), auth.trigger);
  return NextResponse.json(report);
}

export async function POST(request: Request) {
  return GET(request);
}
