import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getOperatingAreas, searchYachts, CyaApiError } from "@/lib/cya";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Recursively collect the distinct field paths present in a JSON structure so
// the report shows the real response shape without echoing full listings.
function collectFieldPaths(value: unknown, prefix: string, out: Map<string, number>, depth = 0): void {
  if (depth > 4) return;
  if (Array.isArray(value)) {
    for (const item of value) collectFieldPaths(item, prefix + "[]", out, depth + 1);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      out.set(path, (out.get(path) ?? 0) + 1);
      collectFieldPaths(child, path, out, depth + 1);
    }
  }
}

export async function GET(request: Request) {
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

  const report: Record<string, unknown> = { mccAuth: "successful", executedServerSide: true };

  // Task 2: operating areas
  try {
    const areas = await getOperatingAreas();
    report.operatingAreas = {
      success: true,
      count: areas.length,
      sampleNames: areas.slice(0, 5).map((a) => String((a as { name?: unknown }).name ?? "")),
      topLevelFields: [...new Set(areas.flatMap((a) => Object.keys(a)))],
    };
  } catch (err) {
    report.operatingAreas = {
      success: false,
      error: err instanceof CyaApiError ? `${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }

  // Task 3: yacht inventory — empty search body returns unfiltered listings;
  // the exact filter format still needs confirmation from CYA's interactive docs.
  try {
    const search = await searchYachts({});
    const fields = new Map<string, number>();
    collectFieldPaths(search, "", fields);
    const listings =
      (Array.isArray(search) ? search : undefined) ??
      (search.yachts as unknown[] | undefined) ??
      (search.data as unknown[] | undefined) ??
      (search.results as unknown[] | undefined) ??
      (search.items as unknown[] | undefined) ??
      [];
    const first = listings[0] as Record<string, unknown> | undefined;
    report.yachtSearch = {
      success: true,
      listingsReturned: listings.length,
      collectionFieldName: Array.isArray(search)
        ? "(response is itself an array)"
        : Object.keys(search).find((k) => Array.isArray((search as Record<string, unknown>)[k])) ?? null,
      firstYachtId: first ? String(first.id ?? first.yacht_id ?? first.uuid ?? "(no id field found)") : null,
      observedFields: [...fields.entries()]
        .slice(0, 80)
        .map(([path, count]) => `${path} (${count})`),
    };
  } catch (err) {
    report.yachtSearch = {
      success: false,
      error: err instanceof CyaApiError ? `${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }

  return NextResponse.json(report);
}
