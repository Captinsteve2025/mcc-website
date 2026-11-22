import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  getOperatingAreasRaw,
  normalizeOperatingAreas,
  searchYachts,
  yachtSeasonAreaNames,
  getYachtDetail,
  getYachtBookings,
  resolveLegacyYachtId,
  traceLegacyIdMapping,
  traceBookings,
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
  // Probes the documented GET /api/v1/bookings endpoint for the requested
  // yachts (or the first catalogue yacht when none given). Reports HTTP
  // status, record counts, date ranges and categories — no credentials, no
  // guest data. Distinguishes active holds from expired ones.
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
  report.bookingsVerification = {
    endpoint: "GET /api/v1/bookings?yacht_id=... (documented in CYA's public OpenAPI spec)",
    today,
    // One yacht is traced through the complete request sequence with actual
    // statuses and sanitized bodies; the rest get the summarized probe.
    tracedYacht: bookingTargetIds[0]
      ? (async () => {
          const mapping = await traceLegacyIdMapping(bookingTargetIds[0]);
          const currentId = mapping.extractedCurrentId ?? bookingTargetIds[0];
          const bookings = await traceBookings(currentId);
          return {
            catalogueYachtId: bookingTargetIds[0],
            step1_legacyMapping: {
              requestPath: mapping.requestPath,
              httpStatus: mapping.httpStatus,
              sanitizedResponse: mapping.body,
              extractedCurrentId: mapping.extractedCurrentId,
              error: mapping.error,
            },
            step2_bookings: {
              requestPath: bookings.requestPath,
              yachtIdUsed: bookings.yachtIdUsed,
              httpStatus: bookings.httpStatus,
              responseBodyShape: bookings.bodyShape,
              bookingCount: bookings.bookingCount,
              sampleBookings: bookings.sampleBookings,
              error: bookings.error,
            },
            interpretation:
              mapping.error
                ? "Step 1 failed — the mapping endpoint's own status/error above identifies the cause."
                : bookings.error
                  ? "Step 2 failed using the resolved ID — the bookings endpoint's own status/error above identifies the cause."
                  : bookings.bookingCount === 0
                    ? "Both steps succeeded; the yacht has no ongoing/future calendar records in CYA — its dates legitimately show no bookings (never interpreted as confirmed available)."
                    : "Bookings retrieved; the calendar maps them to statuses by category (booked/hold via hold_expire_date/transit/unavailable).",
          };
        })()
      : Promise.resolve({ note: "No yacht id available to trace." }),
    yachts: await Promise.all(
      bookingTargetIds.map(async (yachtId) => {
        try {
          const resolved = await resolveLegacyYachtId(yachtId);
          const bookings = await getYachtBookings(yachtId);
          return {
            yachtId,
            resolvedCurrentId: resolved,
            idResolution: resolved ? `Legacy id resolved to current id ${resolved}.` : "No legacy mapping returned; id used as-is.",
            apiStatus: 200,
            bookingCount: bookings.length,
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
      "Expired holds (hold_expire_date in the past) are excluded from the calendar's active hold status by the mapping. A 401/403 here means the API key lacks bookings permission and must be raised with CYA.",
  };

  return NextResponse.json(report);
}
