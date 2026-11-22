import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  getOperatingAreasRaw,
  getOperatingAreas,
  resolveDestinationAreas,
  normalizeOperatingAreas,
  searchYachts,
  startYachtSearchSession,
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

  // --- Live filter verification: each criterion separately, then combined ---
  // Uses startYachtSearchSession so the reported verdict comes from the same
  // filtered-vs-unfiltered total comparison the site itself relies on.
  try {
    const areas = await getOperatingAreas();
    const bviAreas = resolveDestinationAreas(areas, "british-virgin-islands");
    const bviIds = bviAreas.map((a) => a.id).filter(Boolean);
    const bviNames = bviAreas.map((a) => a.name.toLowerCase());
    const filterCases: Array<{ key: string; criteria: Parameters<typeof startYachtSearchSession>[0] }> = [
      { key: "bviDestination", criteria: { areaIds: bviIds, loweredAreaNames: bviNames, typeWords: [], minGuests: null } },
      { key: "catamaranType", criteria: { areaIds: [], loweredAreaNames: [], typeWords: ["catamaran"], minGuests: null } },
      { key: "eightGuests", criteria: { areaIds: [], loweredAreaNames: [], typeWords: [], minGuests: 8 } },
      { key: "bviCatamaranEightGuests", criteria: { areaIds: bviIds, loweredAreaNames: bviNames, typeWords: ["catamaran"], minGuests: 8 } },
    ];
    for (const c of filterCases) {
      const session = await startYachtSearchSession(c.criteria);
      const firstPage = await session.getPage(1, 10);
      (report as Record<string, unknown>)[`filter_${c.key}`] = {
        requestedCriteria: {
          areaIds: c.criteria.areaIds,
          yachtTypes: c.criteria.typeWords,
          guests: c.criteria.minGuests,
        },
        serverFilterConfirmed: session.serverFilterApplied,
        cyasReportedMatchingTotal: session.serverFilterApplied ? session.serverTotal : null,
        unfilteredCatalogueTotal: session.probeLog.find((p) => p.label === "unfiltered_page1")?.totalYachts ?? null,
        filteredPage1Listings: firstPage.length,
        localFallbackUsed: !session.serverFilterApplied,
        localResultsComplete: session.localResultsIncomplete ? false : session.localTotal !== null,
        localMatchingTotal: session.localTotal,
        probeLog: session.probeLog,
      };
    }

    // Pagination: fetch page 2 of the combined case and check overlap.
    const session = await startYachtSearchSession({
      areaIds: bviIds,
      loweredAreaNames: bviNames,
      typeWords: ["catamaran"],
      minGuests: 8,
    });
    const page1 = await session.getPage(1, 10);
    const page2 = await session.getPage(2, 10);
    const ids1 = page1.map((y) => String(y.id ?? ""));
    const ids2 = page2.map((y) => String(y.id ?? ""));
    const overlap = ids2.filter((id) => ids1.includes(id)).length;
    report.paginationCheck = {
      success: true,
      page1Count: page1.length,
      page2Count: page2.length,
      overlappingIds: overlap,
      pagesDiffer: page2.length > 0 ? overlap < ids2.length : false,
      serverFilterConfirmed: session.serverFilterApplied,
      totalYachts: session.serverFilterApplied ? session.serverTotal : session.localTotal,
    };
  } catch (err) {
    report.liveFilterChecks = { success: false, error: errorInfo(err) };
  }

  return NextResponse.json(report);
}
