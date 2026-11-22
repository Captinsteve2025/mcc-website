import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  cyaFetch,
  getYachtBookings,
  traceRawGet,
  sanitizeForReport,
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

type CyaBookingRaw = {
  _id?: unknown;
  yacht_id?: unknown;
  yacht_name?: unknown;
  category?: unknown;
  event_start_date?: unknown;
  event_end_date?: unknown;
  hold_expire_date?: unknown;
  title?: unknown;
};

function isoDay(value: unknown): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null;
}

function describeBookings(payload: { bookings?: unknown } | unknown[]): {
  shape: string;
  total: number;
  list: Array<{
    id: string | null;
    yachtId: string | null;
    yachtName: string | null;
    category: string | null;
    start: string | null;
    end: string | null;
    holdExpire: string | null;
    title: string | null;
  }>;
  distinctYachtIds: string[];
  distinctCategories: string[];
} {
  const list = Array.isArray(payload)
    ? (payload as unknown[])
    : payload && typeof payload === "object" && Array.isArray((payload as { bookings?: unknown }).bookings)
      ? ((payload as { bookings: unknown[] }).bookings as unknown[])
      : [];
  const described = list.map((raw) => {
    const b = (raw ?? {}) as CyaBookingRaw;
    return {
      id: typeof b._id === "string" ? b._id : null,
      yachtId: typeof b.yacht_id === "string" ? b.yacht_id : null,
      yachtName: typeof b.yacht_name === "string" ? b.yacht_name : null,
      category: typeof b.category === "string" ? b.category : null,
      start: isoDay(b.event_start_date),
      end: isoDay(b.event_end_date),
      holdExpire: isoDay(b.hold_expire_date),
      title: typeof b.title === "string" ? b.title.slice(0, 60) : null,
    };
  });
  return {
    shape: Array.isArray(payload) ? "bare array" : `object with keys [${Object.keys(payload).join(", ")}]`,
    total: described.length,
    list: described,
    distinctYachtIds: [...new Set(described.map((b) => b.yachtId).filter((v): v is string => Boolean(v)))],
    distinctCategories: [...new Set(described.map((b) => b.category).filter((v): v is string => Boolean(v)))],
  };
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

  const url = new URL(request.url);
  const yachtId = (url.searchParams.get("yacht_id") ?? "").trim();
  if (!/^[a-f0-9]{8,32}$/i.test(yachtId)) {
    return NextResponse.json({ error: "Provide yacht_id as a CYA yacht id (hex, 8-32 chars)." }, { status: 400 });
  }

  const baseConfigured = process.env.CYA_API_BASE
    ? new URL(process.env.CYA_API_BASE).toString().replace(/\/+$/, "")
    : null;

  const today = new Date().toISOString().slice(0, 10);
  const report: Record<string, unknown> = {
    yachtId,
    fullRequestPath: baseConfigured !== null ? `${baseConfigured}/bookings?yacht_id=${yachtId}` : "(CYA_API_BASE unset)",
    today,
  };

  // 1) The application's own bookings call (same code path the calendar uses).
  try {
    const bookings = await getYachtBookings(yachtId);
    report.appPath = {
      success: true,
      httpStatus: 200,
      bookingCount: bookings.length,
      bookings: bookings.slice(0, 30).map((b) => ({
        start: b.startDate,
        end: b.endDate,
        category: b.category,
        holdExpireDate: b.holdExpireDate,
        holdExpired: b.holdExpireDate ? b.holdExpireDate < today : null,
        title: b.title,
      })),
    };
  } catch (err) {
    report.appPath = {
      success: false,
      httpStatus: err instanceof CyaApiError ? err.status : null,
      errorMessage:
        err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
  }

  // 2) Sanitized raw response for structure troubleshooting.
  try {
    const rawPayload = await cyaFetch<{ bookings?: unknown } | unknown[]>(
      `/bookings?yacht_id=${encodeURIComponent(yachtId)}`,
      { revalidate: 60 }
    );
    const described = describeBookings(rawPayload);
    report.rawResponse = {
      httpStatus: 200,
      shape: described.shape,
      totalBookings: described.total,
      distinctYachtIdsInResponse: described.distinctYachtIds,
      distinctCategories: described.distinctCategories,
      bookings: described.list.slice(0, 30),
      sanitizedStructure: sanitizeForReport(rawPayload),
    };
    // 3) Scope check: does the endpoint return only this yacht's records or
    // every record in the account? A response naming other yachts proves the
    // endpoint is account-wide; records all naming the requested yacht prove
    // per-yacht scoping works. With zero records, scope cannot be determined
    // from this response alone — a known yacht WITH calendar records is needed.
    const requestedId = yachtId;
    const otherYachts = described.distinctYachtIds.filter((id) => id !== requestedId);
    report.scopeCheck =
      described.total === 0
        ? {
            determination: "undetermined",
            explanation:
              "The response contained zero booking records, so this response alone cannot show whether the endpoint is per-yacht or account-wide. An empty array here means either 'this yacht has no calendar records visible to the key' or 'the key's account holds no records at all' — the two are distinguished only by querying a yacht that demonstrably has calendar entries.",
          }
        : otherYachts.length === 0 && described.distinctYachtIds.includes(requestedId)
          ? {
              determination: "per-yacht",
              explanation:
                "Every record in the response names the requested yacht_id, so the yacht_id filter is honored and the endpoint returns only this yacht's calendar records.",
            }
          : {
              determination: "account-wide-or-unfiltered",
              explanation:
                "The response contains records naming yacht_ids other than the requested one, so the yacht_id parameter is not restricting results — the endpoint returns all records visible to the key's account (or globally).",
              otherYachtIds: otherYachts.slice(0, 10),
            };
  } catch (err) {
    report.rawResponse = {
      httpStatus: err instanceof CyaApiError ? err.status : null,
      errorMessage:
        err instanceof CyaApiError ? `HTTP ${err.status}: ${err.message}` : "Network or unexpected error.",
    };
    report.scopeCheck = {
      determination: "undetermined",
      explanation: "The raw bookings request failed, so scope could not be observed.",
    };
  }

  // 4) Cross-checks against other documented endpoints for the same yacht.
  // /me shows what the key authenticates as; /yachts_get/{id} proves whether
  // the yacht itself is known to CYA at all.
  report.keyAuthentication = await traceRawGet("/me");
  try {
    await cyaFetch<unknown>(`/yachts_get/${encodeURIComponent(yachtId)}`, { revalidate: 60 });
    report.yachtKnownToCya = { known: true, note: "GET /yachts_get/{id} returned 200 — the yacht exists in CYA's catalogue." };
  } catch (err) {
    report.yachtKnownToCya = {
      known: false,
      httpStatus: err instanceof CyaApiError ? err.status : null,
      note:
        err instanceof CyaApiError && err.status === 404
          ? "GET /yachts_get/{id} returned 404 — this id is not a yacht in CYA's catalogue under this key."
          : "GET /yachts_get/{id} did not succeed — see the status.",
    };
  }

  return NextResponse.json(report);
}
