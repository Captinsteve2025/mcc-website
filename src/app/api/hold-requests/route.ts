import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { CYA_YACHT_ID_PATTERN, HOLD_GUEST_LIMIT, holdRequestToday, MANAGED_YACHT_HOLD_PREFIX } from "@/lib/hold-request";
import { deliverHoldEmails, getHoldDatabase, getYachtForHold, holdRequestsEnabled } from "@/lib/hold-request-server";

export const runtime = "nodejs";
export const maxDuration = 30;

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function POST(request: Request) {
  if (!holdRequestsEnabled()) {
    return NextResponse.json({ error: "Hold requests are currently unavailable." }, { status: 503 });
  }

  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Please submit from the yacht page." }, { status: 403 });
  }

  const maxBodyLength = 4096;
  if (Number(request.headers.get("content-length")) > maxBodyLength) {
    return NextResponse.json({ error: "The request is too large." }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > maxBodyLength) {
      return NextResponse.json({ error: "The request is too large." }, { status: 413 });
    }
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    payload = parsed;
  } catch {
    return NextResponse.json({ error: "Please check your hold request and try again." }, { status: 400 });
  }

  const { id, yachtId, start, end, guests, privacyConsent } = payload;
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (
    typeof id !== "string" || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id) ||
    typeof yachtId !== "string" || yachtId.length > 88 ||
    (!CYA_YACHT_ID_PATTERN.test(yachtId) && !yachtId.startsWith(MANAGED_YACHT_HOLD_PREFIX)) ||
    !isIsoDate(start) || !isIsoDate(end) || end <= start ||
    typeof guests !== "number" || !Number.isInteger(guests) || guests < 1 || guests > HOLD_GUEST_LIMIT ||
    !name || name.length > 120 || /[\r\n]/.test(name) ||
    email.length > 254 || !/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/.test(email) ||
    privacyConsent !== true
  ) {
    return NextResponse.json({ error: "Choose a check-in and check-out date, then check your contact details and guest count." }, { status: 400 });
  }

  // Vercel supplies this header. A missing IP shares one fallback quota.
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const requesterHash = createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(ip).digest("hex");
  let db: ReturnType<typeof getHoldDatabase>;
  try {
    db = getHoldDatabase();
    const { data: previous, error: readError } = await db.from("yacht_hold_requests")
      .select("yacht_name,guest_count").eq("id", id).eq("yacht_id", yachtId).maybeSingle();
    if (readError) throw readError;
    if (!previous && start < holdRequestToday()) {
      return NextResponse.json({ error: "Please choose dates starting today or later." }, { status: 400 });
    }
    // A guest can retry a saved request even while the catalogue is temporarily unavailable.
    const yacht = previous ? { name: previous.yacht_name ?? "OHANA", maxGuests: previous.guest_count }
      : await getYachtForHold(yachtId);
    if (!yacht) return NextResponse.json({ error: "This yacht could not be found." }, { status: 404 });
    if (!previous && guests > yacht.maxGuests) {
      return NextResponse.json({ error: `Please enter no more than ${yacht.maxGuests} guests for this yacht.` }, { status: 400 });
    }
    const { data, error } = await db.rpc("submit_fleet_hold_request", {
      p_id: id,
      p_yacht_id: yachtId,
      p_yacht_name: yacht.name,
      p_start_date: start,
      p_end_date: end,
      p_guest_count: guests,
      p_full_name: name,
      p_email: email,
      p_requester_hash: requesterHash,
    });
    if (error) throw error;
    if (data === "conflict") {
      return NextResponse.json({ error: "This reference belongs to an earlier request. Verify your details and submit again." }, { status: 409 });
    }
    if (data === "rate_limited") {
      return NextResponse.json(
        { error: "Too many requests. Please try again later or contact our bookings team." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }
    if (data !== "saved") throw new Error();
  } catch {
    console.error("[hold-request] request could not be saved");
    return NextResponse.json({ error: "We couldn’t confirm receipt. Your details are still here. Please try again." }, { status: 503 });
  }

  let emailsAccepted = false;
  try {
    emailsAccepted = await deliverHoldEmails(db, id);
  } catch {
    console.error("[hold-request] saved request has pending email");
  }

  return NextResponse.json({ reference: id, emailsAccepted }, { status: emailsAccepted ? 200 : 202 });
}
