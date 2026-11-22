import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  getOperatingAreasRaw,
  getOperatingAreas,
  resolveDestinationAreas,
  normalizeOperatingAreas,
  searchYachts,
  searchYachtsPage,
  yachtAreaMatchesSynonymsIn,
  getYachtDetail,
  destinationSynonyms,
  CyaApiError,
} from "@/lib/cya";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function describeJsonStructure(value: unknown, depth = 0, out: string[] = []): string[] {
  if (depth > 2) return out;
  if (Array.isArray(value)) {
    out.push(`array (${value.length} items)`);
    if (value.length > 0) describeJsonStructure(value[0], depth + 1, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out.push(`${key}: ${jsonType(child)}${child && typeof child === "object" ? "" : ` = ${String(child).slice(0, 40)}`}`);
      if (child && typeof child === "object") describeJsonStructure(child, depth + 1, out);
    }
  }
  return out;
}

function errorInfo(err: unknown): string {
  return err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.";
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

  // --- Operating areas: report structure, then normalize ---
  try {
    const raw = await getOperatingAreasRaw();
    const topLevel = describeJsonStructure(raw);
    const normalized = normalizeOperatingAreas(raw);
    report.operatingAreas = normalized
      ? {
          success: true,
          httpStatus: 200,
          validJson: true,
          topLevelStructure: topLevel.slice(0, 30),
          arrayLocation: normalized.arrayLocation,
          count: normalized.areas.length,
          samples: normalized.areas.slice(0, 5).map((a) => ({
            id: String(a.id ?? a.area_id ?? a.uuid ?? "(no id field)"),
            name: String(a.name ?? a.label ?? a.title ?? "(no name field)"),
          })),
        }
      : {
          success: false,
          httpStatus: 200,
          validJson: true,
          topLevelStructure: topLevel.slice(0, 30),
          note: "Response was valid JSON but no cruising-area array could be located in it.",
        };
  } catch (err) {
    report.operatingAreas = { success: false, error: errorInfo(err) };
  }

  // --- Yacht search page 1 ---
  const requestBody = { page: 1, limit: 10, searchTerm: "", filters: {} };
  let page1Ids: string[] = [];
  try {
    const search = await searchYachts(requestBody);
    const yachts = (search.yachts as Record<string, unknown>[] | undefined) ?? [];
    page1Ids = yachts.map((y) => String(y.id ?? ""));
    report.yachtSearchPage1 = {
      success: true,
      requestBody,
      totalYachts: search.totalYachts ?? null,
      listingsReturned: yachts.length,
      firstYachtId: page1Ids[0] ?? null,
      observedFields: yachts[0] ? Object.keys(yachts[0]) : [],
      // Image URL diagnostics: hostname breakdown and per-yacht validity.
      imageHostnames: [
        ...new Set(
          yachts
            .map((y) => {
              const img = y.image;
              if (typeof img !== "string" || img.length === 0) return "(missing)";
              try {
                return new URL(img).hostname;
              } catch {
                return "(invalid URL)";
              }
            })
            .filter(Boolean)
        ),
      ],
      imageCounts: {
        total: yachts.length,
        validHttpsUrl: yachts.filter((y) => {
          const img = y.image;
          if (typeof img !== "string") return false;
          try {
            return new URL(img).protocol === "https:";
          } catch {
            return false;
          }
        }).length,
        missing: yachts.filter((y) => typeof y.image !== "string" || y.image.length === 0).length,
        invalidUrl: yachts.filter((y) => {
          const img = y.image;
          if (typeof img !== "string" || img.length === 0) return false;
          try {
            new URL(img);
            return false;
          } catch {
            return true;
          }
        }).length,
      },
    };
  } catch (err) {
    report.yachtSearchPage1 = { success: false, error: errorInfo(err) };
  }

  // --- Yacht search page 2: confirm pagination ---
  try {
    const search2 = await searchYachts({ ...requestBody, page: 2 });
    const yachts2 = (search2.yachts as Record<string, unknown>[] | undefined) ?? [];
    const page2Ids = yachts2.map((y) => String(y.id ?? ""));
    const overlap = page2Ids.filter((id) => page1Ids.includes(id)).length;
    report.yachtSearchPage2 = {
      success: true,
      listingsReturned: yachts2.length,
      firstYachtId: page2Ids[0] ?? null,
      idsDifferFromPage1: page2Ids.length > 0 && overlap < page2Ids.length,
      overlappingIds: overlap,
      totalYachts: search2.totalYachts ?? null,
    };
  } catch (err) {
    report.yachtSearchPage2 = { success: false, error: errorInfo(err) };
  }

  // --- Yacht detail for the first page-1 yacht ---
  if (page1Ids[0]) {
    try {
      const detail = await getYachtDetail(page1Ids[0]);
      report.yachtDetail = {
        success: true,
        yachtId: page1Ids[0],
        presentFields: Object.keys(detail),
        topLevelTypes: Object.fromEntries(
          Object.entries(detail)
            .slice(0, 40)
            .map(([k, v]) => [k, jsonType(v)])
        ),
      };
    } catch (err) {
      report.yachtDetail = { success: false, error: errorInfo(err) };
    }
  }

  // --- Destination resolution: MCC slugs against live CYA areas ---
  try {
    const areas = await getOperatingAreas();
    const slugs = ["british-virgin-islands", "us-virgin-islands", "st-martin", "antigua", "grenadines", "bahamas"];
    report.destinationResolution = {
      success: true,
      totalAreas: areas.length,
      destinations: Object.fromEntries(
        slugs.map((slug) => {
          const matched = resolveDestinationAreas(areas, slug);
          return [
            slug,
            {
              matchedAreaCount: matched.length,
              matchedAreas: matched.map((a) => ({ id: a.id, name: a.name })),
              synonyms: destinationSynonyms(slug),
            },
          ];
        })
      ),
    };
  } catch (err) {
    report.destinationResolution = { success: false, error: errorInfo(err) };
  }

  // --- Server-side filter acceptance: area filter, page size, pagination ---
  try {
    const areas = await getOperatingAreas();
    const bvi = resolveDestinationAreas(areas, "british-virgin-islands");
    const areaIds = bvi.map((a) => a.id).filter(Boolean);
    if (areaIds.length === 0) {
      report.serverFilterCheck = { success: false, note: "No CYA area IDs resolved for British Virgin Islands; cannot probe the area filter." };
    } else {
      const synonyms = bvi.map((a) => a.name.toLowerCase());
      const result = await searchYachtsPage({
        page: 1,
        limit: 10,
        filters: { operating_area_ids: areaIds },
        verify: (yachts) => yachts.every((y) => yachtAreaMatchesSynonymsIn(y, synonyms)),
      });
      report.serverFilterCheck = {
        success: true,
        requestedFilters: { operating_area_ids: areaIds },
        serverFilterAccepted: result.serverFilterApplied,
        listingsReturned: result.yachts.length,
        totalYachts: result.totalYachts,
        interpretation: result.serverFilterApplied
          ? "CYA accepted the operating_area_ids filter and every returned yacht cruises in the requested area; server-side filtering and totals are live."
          : "CYA did not accept this filter format (or returned unfiltered results); the site falls back to accurate local matching.",
      };
    }
  } catch (err) {
    report.serverFilterCheck = { success: false, error: errorInfo(err) };
  }

  return NextResponse.json(report);
}
