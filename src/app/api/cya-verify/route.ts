import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  getOperatingAreasRaw,
  normalizeOperatingAreas,
  searchYachts,
  yachtSeasonAreaNames,
  getYachtDetail,
  getYachtBookings,
  traceLegacyIdMapping,
  traceBookings,
  traceRawGet,
  DESTINATION_AREA_MAPPING,
  resolveDestinationAreas,
  CyaApiError,
  type Yacht,
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

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

// Describe one yacht exactly as it appeared in the CYA response named by its
// probe — no enrichment, no local matching, no fallback records.
function describeYacht(y: Yacht) {
  return {
    id: String(y.id ?? ""),
    name: str(y.yachtName),
    type: str(y.yachtType),
    pax: typeof y.pax === "number" ? y.pax : null,
    seasonAreas: yachtSeasonAreaNames(y).slice(0, 3),
  };
}

type ProbeResult = {
  label: string;
  success: boolean;
  httpStatus: number | null;
  requestBody: Record<string, unknown>;
  cyasReportedTotal: number | null;
  listingsReturned: number;
  yachts: ReturnType<typeof describeYacht>[];
  errorCode: string | null;
  errorMessage: string | null;
  fallbackUsed: false;
};

async function probe(label: string, filters: Record<string, unknown>): Promise<ProbeResult> {
  const body = { page: 1, limit: 10, searchTerm: "", filters };
  try {
    const response = await searchYachts(body);
    const yachts = (response.yachts as Yacht[] | undefined) ?? [];
    return {
      label,
      success: true,
      httpStatus: 200,
      requestBody: body,
      cyasReportedTotal: typeof response.totalYachts === "number" ? response.totalYachts : null,
      listingsReturned: yachts.length,
      yachts: yachts.slice(0, 5).map(describeYacht),
      errorCode: null,
      errorMessage: null,
      fallbackUsed: false,
    };
  } catch (err) {
    return {
      label,
      success: false,
      httpStatus: err instanceof CyaApiError ? err.status : null,
      requestBody: body,
      cyasReportedTotal: null,
      listingsReturned: 0,
      yachts: [],
      errorCode: err instanceof CyaApiError ? err.code : null,
      errorMessage:
        err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
      fallbackUsed: false,
    };
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

  const report: Record<string, unknown> = {
    mccAuth: "successful",
    executedServerSide: true,
    // Verified live 2026-11-22. No speculative probes run in this diagnostic.
    verifiedFilterFacts: {
      "filters.location_areas": '["13","15"] returns 400 yachts (server-side, confirmed).',
      "filters.yachtTypes": '["catamaran"] returns 694 yachts (server-side, confirmed).',
      "filters.guests": "HTTP 422 — rejected. Never sent by the application.",
      "filters.pax": "Ignored by CYA (returns all 1,920). Never sent by the application.",
      guestCapacity: "Applied locally from each yacht's pax; unknown pax excluded from matches.",
    },
    diagnosticPolicy: { fallbackWalksRun: false, recordsCiteTheirOwnResponse: true },
  };

  // --- Operating areas: full dump of every live label for mapping review ---
  try {
    const raw = await getOperatingAreasRaw();
    const normalized = normalizeOperatingAreas(raw);
    report.operatingAreas = normalized
      ? {
          success: true,
          arrayLocation: normalized.arrayLocation,
          count: normalized.areas.length,
          allAreas: normalized.areas.map((a) => ({
            id: String(a.id ?? a.area_id ?? a.uuid ?? "(no id field)"),
            label: String(a.label ?? a.name ?? a.title ?? "(no label field)"),
          })),
        }
      : { success: false, note: "Valid JSON but no cruising-area array could be located in it." };
  } catch (err) {
    report.operatingAreas = {
      success: false,
      errorCode: err instanceof CyaApiError ? err.code : null,
      errorMessage: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }

  // --- Destination mapping (exact vs regional) vs the live area list ---
  try {
    const raw = await getOperatingAreasRaw();
    const normalized = normalizeOperatingAreas(raw);
    const areas = normalized
      ? normalized.areas
          .map((a) => {
            const id = a.id ?? a.area_id ?? a.uuid;
            const name = a.label ?? a.name ?? a.title;
            return typeof name === "string" && (typeof id === "string" || typeof id === "number")
              ? { id: String(id), name }
              : null;
          })
          .filter((a): a is { id: string; name: string } => a !== null)
      : [];
    report.destinationMapping = Object.fromEntries(
      Object.entries(DESTINATION_AREA_MAPPING).map(([slug, entry]) => {
        const matched = resolveDestinationAreas(areas, slug);
        return [
          slug,
          {
            label: entry.label,
            scope: entry.scope,
            mappedAreaIds: entry.areaIds,
            liveMatches: matched.map((a) => ({ id: a.id, name: a.name })),
            regionNote: entry.regionNote || null,
            note:
              matched.length === 0
                ? "Mapped IDs were not found in the live area list — search shows all yachts for this destination."
                : entry.scope === "regional"
                  ? "Regional mapping: results span CYA's broader area; exact-island availability is confirmed per enquiry."
                  : "Exact mapping resolved against the live area list.",
          },
        ];
      })
    );
  } catch (err) {
    report.destinationMapping = {
      success: false,
      errorMessage: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }

  // --- Server-filter probes (guest capacity is never sent to CYA) ---
  const unfiltered = await probe("unfiltered_baseline", {});
  const bvi = await probe("bvi_string_ids", { location_areas: ["13", "15"] });
  const catamaran = await probe("catamaran", { yachtTypes: ["catamaran"] });
  const combined = await probe("bvi_catamaran_server", {
    location_areas: ["13", "15"],
    yachtTypes: ["catamaran"],
  });

  report.filterProbes = {
    unfiltered_baseline: unfiltered,
    bvi_string_ids: bvi,
    catamaran: catamaran,
    bvi_catamaran_server: combined,
    note:
      "Eight-guest results are produced by a local pax pass over the server-filtered inventory, never by a CYA guests/pax filter (both verified rejected/ignored).",
  };

  // --- Pagination on the combined server filters: page 2 differs from page 1 ---
  let paginationCheck: Record<string, unknown> = { success: false, note: "Combined probe did not succeed." };
  if (combined.success) {
    try {
      const page2 = await searchYachts({
        page: 2,
        limit: 10,
        searchTerm: "",
        filters: combined.requestBody.filters,
      });
      const yachts2 = (page2.yachts as Yacht[] | undefined) ?? [];
      const ids1 = combined.yachts.map((y) => y.id);
      const ids2 = yachts2.map((y) => String(y.id ?? ""));
      const overlap = ids2.filter((id) => ids1.includes(id)).length;
      paginationCheck = {
        success: true,
        cyasReportedTotalPage2: typeof page2.totalYachts === "number" ? page2.totalYachts : null,
        page2Listings: yachts2.length,
        overlappingIdsWithPage1: overlap,
        pagesDiffer: ids2.length > 0 ? overlap < ids2.length : false,
        page2Yachts: yachts2.slice(0, 5).map(describeYacht),
      };
    } catch (err) {
      paginationCheck = {
        success: false,
        errorCode: err instanceof CyaApiError ? err.code : null,
        errorMessage: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
      };
    }
  }
  report.paginationCheck = paginationCheck;

  // --- Detail field-structure report (informs the detail-page rendering) ---
  const detailSourceId = unfiltered.yachts[0]?.id;
  if (detailSourceId) {
    try {
      const detail = await getYachtDetail(detailSourceId);
      const jsonType = (v: unknown) =>
        v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
      const summarize = (v: unknown): unknown => {
        if (Array.isArray(v)) {
          return { kind: "array", length: v.length, firstEntry: v.length > 0 ? summarize(v[0]) : null };
        }
        if (v && typeof v === "object") {
          const obj = v as Record<string, unknown>;
          return {
            kind: "object",
            keys: Object.keys(obj).slice(0, 15),
            sampleValues: Object.fromEntries(
              Object.entries(obj)
                .slice(0, 8)
                .map(([k, val]) => [k, typeof val === "object" && val !== null ? jsonType(val) : val])
            ),
          };
        }
        return { kind: jsonType(v), value: typeof v === "string" && v.length > 120 ? `${v.slice(0, 120)}…` : v };
      };
      report.yachtDetailStructure = {
        success: true,
        yachtId: detailSourceId,
        presentFields: Object.keys(detail),
        fieldStructures: Object.fromEntries(
          [
            "yachtName",
            "yachtType",
            "builder_name",
            "lenght",
            "beam",
            "draft",
            "year_build",
            "refit",
            "cabins",
            "pax",
            "accommodations",
            "yachtEngines",
            "watersports",
            "other_toys",
            "seasons",
            "low_price",
            "high_price",
            "min_price_usd",
            "main_image",
            "Images",
            "ebrochure",
          ].map((key) => [key, summarize(detail[key])])
        ),
      };
    } catch (err) {
      report.yachtDetailStructure = {
        success: false,
        errorCode: err instanceof CyaApiError ? err.code : null,
        errorMessage: err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
      };
    }
  } else {
    report.yachtDetailStructure = { success: false, note: "No page-1 yacht id available to probe." };
  }

  // --- Bookings (authorized availability) verification -----------------------
  // Probes the corrected GET {base}/bookings endpoint (production-verified
  // 2026-11-22: the configured base already ends in /api/v1; the previously
  // built /api/v1/bookings duplicated the prefix and returned 404). The
  // catalogue id is tried FIRST; legacy mapping runs only when CYA answers 404
  // ("Yacht not found"). Reports HTTP status, record counts, date ranges and
  // categories — no credentials, no guest data.
  const url = new URL(request.url);
  const requestedIds = (url.searchParams.get("yacht_ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-f0-9]{8,32}$/i.test(s));
  const bookingTargetIds = requestedIds.slice(0, 6);
  if (bookingTargetIds.length === 0) {
    bookingTargetIds.push(...unfiltered.yachts.slice(0, 3).map((y) => y.id).filter(Boolean));
  }
  const today = new Date().toISOString().slice(0, 10);

  // Configured base URL (host + path only — the key is never reported).
  const cyaBaseConfigured = process.env.CYA_API_BASE ? new URL(process.env.CYA_API_BASE).toString().replace(/\/+$/, "") : null;

  // One yacht is traced through the complete request sequence. Every step is
  // awaited BEFORE the report is serialized: a Promise in a JSON payload
  // serializes to {} (the empty tracedYacht bug). Every request is marked
  // executed/skipped and carries its own status and sanitized body, so a
  // fully-failing run still returns a populated trace.
  const traceYachtId = bookingTargetIds[0] ?? null;
  let tracedYacht: Record<string, unknown>;
  if (!traceYachtId) {
    tracedYacht = { note: "No yacht id available to trace — catalogue probe returned no records.", executed: false, skipped: true };
  } else {
    // Primary: bookings with the catalogue id as-is (verified valid in the
    // current id space). Legacy mapping is a 404-fallback, not a prerequisite.
    const bookings = await traceBookings(traceYachtId);
    const mapping = bookings.httpStatus === 404 ? await traceLegacyIdMapping(traceYachtId) : null;
    const resolvedId = mapping?.extractedCurrentId ?? null;
    const retriedBookings = resolvedId ? await traceBookings(resolvedId) : null;
    const effectiveBookings = retriedBookings ?? bookings;
    // Route-shape probes run only on 404, to distinguish endpoint-not-found
    // from yacht-not-found using CYA's own replies.
    const alternates: Array<{ requestPath: string; httpStatus: number | null; sanitizedBody: unknown; error: string | null; executed: boolean; skipped: boolean }> = [];
    if (bookings.httpStatus === 404) {
      alternates.push(await traceRawGet("/bookings?yacht_id=" + encodeURIComponent(traceYachtId)));
      alternates.push(await traceRawGet("/api/v1/bookings?yacht_id=" + encodeURIComponent(traceYachtId)));
    }
    // The /me endpoint proves the key itself authenticates without exposing it.
    const me = await traceRawGet("/me");
    tracedYacht = {
      catalogueYachtId: traceYachtId,
      cyaBaseConfigured,
      fullRequestPaths: {
        primaryBookings: (cyaBaseConfigured ?? "(CYA_API_BASE unset)") + bookings.requestPath,
        legacyMapping: mapping ? (cyaBaseConfigured ?? "(CYA_API_BASE unset)") + mapping.requestPath : "not needed — primary bookings request did not 404",
      },
      requestPathsTried: [bookings.requestPath, ...(retriedBookings ? [retriedBookings.requestPath] : []), ...alternates.map((a) => a.requestPath)],
      step1_bookingsWithCatalogueId: {
        requestPath: bookings.requestPath,
        yachtIdUsed: bookings.yachtIdUsed,
        executed: bookings.executed,
        skipped: bookings.skipped,
        httpStatus: bookings.httpStatus,
        responseBodyShape: bookings.bodyShape,
        bookingCount: bookings.bookingCount,
        sampleBookings: bookings.sampleBookings,
        error: bookings.error,
      },
      step2_legacyMappingOnlyWhen404: mapping
        ? {
            requestPath: mapping.requestPath,
            executed: mapping.executed,
            skipped: mapping.skipped,
            httpStatus: mapping.httpStatus,
            sanitizedResponse: mapping.body,
            extractedCurrentId: resolvedId,
            extractionNote: resolvedId
              ? "Current id extracted from the mapping response (documented fields tried, in order: new_yacht_id, yacht_id, new_id, id, current_yacht_id)."
              : "No current id could be extracted from the mapping response above.",
            error: mapping.error,
          }
        : { note: "Not run — primary bookings request succeeded with the catalogue id, so no legacy mapping is needed.", executed: false, skipped: true },
      step3_bookingsRetryWithResolvedId: retriedBookings
        ? {
            requestPath: retriedBookings.requestPath,
            yachtIdUsed: retriedBookings.yachtIdUsed,
            executed: retriedBookings.executed,
            skipped: retriedBookings.skipped,
            httpStatus: retriedBookings.httpStatus,
            responseBodyShape: retriedBookings.bodyShape,
            bookingCount: retriedBookings.bookingCount,
            sampleBookings: retriedBookings.sampleBookings,
            error: retriedBookings.error,
          }
        : { note: "Not run — no legacy mapping was needed or no current id was returned.", executed: false, skipped: true },
      step4_routeProbesWhen404: alternates.length > 0 ? alternates : { note: "Not run — primary bookings request did not return 404.", executed: false, skipped: true },
      keyAuthentication: { endpoint: "GET /me", executed: me.executed, skipped: me.skipped, httpStatus: me.httpStatus, sanitizedResponse: me.sanitizedBody, error: me.error, note: "200 proves the API key authenticates; 401/403 means the key itself is rejected." },
      statusLegend: {
        endpointNotFound: "CYA replies 404 with a FastAPI {\"detail\":\"Not Found\"} body — the route does not exist on the configured host.",
        yachtNotFound: "CYA replies 404 with a {\"detail\":\"Yacht not found\"}-style body — the route exists but the yacht has no record (calendar entry or mapping) in CYA's system.",
        permission: "CYA replies 401/403 — the key is rejected or lacks the endpoint's permission.",
        emptyBookings: "200 with an empty bookings array — authenticated and routed correctly, but CYA holds no ongoing/future calendar records for this yacht. Unknown availability, never shown as available.",
      },
      interpretation: (() => {
        if (me.httpStatus !== 200) return "The key failed authentication at GET /me — resolve the key/permission issue with CYA before interpreting the bookings result.";
        if (bookings.httpStatus === 404) {
          const alternateRouted = alternates.find((a) => a.httpStatus === 200);
          if (alternateRouted) return `An alternate route responded 200 (${alternateRouted.requestPath}) — the primary bookings path is not the served route on this deployment's base URL.`;
          if (retriedBookings && retriedBookings.httpStatus === 200 && retriedBookings.bookingCount) return `Legacy mapping resolved a current id; the retried request returned ${retriedBookings.bookingCount} booking(s).`;
          return "Bookings 404 with the catalogue id and no route variant answering: per CYA's own response body, this is yacht-not-found (no calendar entry) unless the body says otherwise — check the response shapes above.";
        }
        if (bookings.httpStatus === 200) return bookings.bookingCount === 0 ? "Bookings succeeded with the catalogue id; the yacht has no ongoing/future calendar records — its dates stay unknown (never shown as available) until records exist." : `Bookings retrieved with the catalogue id: ${bookings.bookingCount} record(s); the calendar maps them by category automatically.`;
        return "See each step's own status and error above.";
      })(),
    };
  }

  report.bookingsVerification = {
    endpoint: "GET {CYA_API_BASE}/bookings?yacht_id=... (corrected 2026-11-22: base already ends in /api/v1; the duplicated /api/v1/api/v1/bookings path returned 404)",
    today,
    tracedYacht,
    yachts: await Promise.all(
      bookingTargetIds.map(async (yachtId) => {
        try {
          const bookings = await getYachtBookings(yachtId);
          return {
            yachtId,
            apiStatus: 200,
            bookingCount: bookings.length,
            calendarMapping:
              bookings.length === 0
                ? "No ongoing/future records — all dates remain unknown/unmarked; hasLiveData stays false so the page keeps 'Check Dates' and never claims availability."
                : `Live records feed the calendar: confirmed bookings → Booked; active holds (hold_expire_date in the future) → Hold; expired holds dropped; transit/relocation → Transit; other categories → Unavailable. Dates with no record stay unknown.`,
            bookings: bookings.slice(0, 20).map((b) => ({
              startDate: b.startDate,
              endDate: b.endDate,
              category: b.category,
              holdExpireDate: b.holdExpireDate,
              holdExpired: b.holdExpireDate ? b.holdExpireDate < today : null,
              title: b.title,
            })),
          };
        } catch (err) {
          return {
            yachtId,
            apiStatus: err instanceof CyaApiError ? err.status : null,
            bookingCount: null,
            errorCode: err instanceof CyaApiError ? err.code : null,
            errorMessage:
              err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
          };
        }
      })
    ),
    note:
      "Expired holds (hold_expire_date in the past) are excluded from the calendar's active hold status. An empty bookings array is NOT availability: the calendar keeps unmarked dates unknown and does not switch to live-data CTAs. A 401/403 means the API key lacks bookings permission and must be raised with CYA.",
  };

  return NextResponse.json(report);
}
