import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { guestRequestReceipt } from "@/lib/guest-request-email";
import { HOLD_BOOKINGS_EMAIL as bookingsEmail } from "@/lib/hold-request";
import { sendResendEmail } from "@/lib/resend-email";

export const runtime = "nodejs";
export const maxDuration = 30;

const emailPattern = /^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/;
const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
const deliveryColumns = ["proposal_broker_email_id", "proposal_guest_email_id"] as const;

function validateProposal(body: Record<string, unknown>) {
  const field = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
  const id = field("client_request_id");
  const slug = field("yacht_slug");
  const yacht = field("yacht_name");
  const cyaId = field("cya_yacht_id");
  const name = field("full_name");
  const email = field("email");
  const dates = field("preferred_dates");
  const phone = field("phone");
  const occasion = field("special_occasion");
  const notes = field("additional_requests");
  const guests = body.guest_count;
  if (
    !uuidPattern.test(id) || !slug || slug.length > 100 || !yacht || yacht.length > 100 ||
    cyaId.length > 64 || !name || name.length > 120 || email.length > 254 || !emailPattern.test(email) ||
    !dates || dates.length > 200 || (phone && (phone.length < 5 || phone.length > 40)) ||
    occasion.length > 200 || notes.length > 2000 ||
    typeof guests !== "number" || !Number.isInteger(guests) || guests < 1 || guests > 100 ||
    body.privacy_consent !== true
  ) return null;

  const inputUtm = body.utm_params as Record<string, unknown> | null;
  const utm: Record<string, string> = {};
  for (const key of attributionKeys) {
    const value = inputUtm?.[key];
    if (typeof value === "string") utm[key] = value.slice(0, 200);
  }

  return {
    client_request_id: id,
    yacht_slug: slug,
    yacht_name: yacht,
    cya_yacht_id: cyaId || null,
    full_name: name,
    email,
    phone: phone || null,
    preferred_dates: dates,
    flexible_dates: body.flexible_dates === true,
    guest_count: guests,
    special_occasion: occasion || null,
    additional_requests: notes || null,
    marketing_opt_in: body.marketing_opt_in === true,
    privacy_consent: true,
    lead_source: field("lead_source").slice(0, 200) || null,
    utm_params: utm,
    landing_page_url: field("landing_page_url").slice(0, 2000) || null,
  };
}

type SavedProposal = NonNullable<ReturnType<typeof validateProposal>> & {
  created_at: string;
  proposal_broker_email_id: string | null;
  proposal_guest_email_id: string | null;
};

function proposalEmail(proposal: SavedProposal, broker: boolean) {
  const base = {
    from: `My Caribbean Charters <${bookingsEmail}>`,
    reply_to: bookingsEmail,
  };
  const details = [
    `Yacht: ${proposal.yacht_name}`,
    `Preferred dates: ${proposal.preferred_dates}${proposal.flexible_dates ? " (flexible)" : ""}`,
    `Guests: ${proposal.guest_count}`,
  ].join("\n");
  const reference = `Reference: ${proposal.client_request_id}`;

  if (broker) {
    return {
      ...base,
      to: [bookingsEmail],
      subject: "New charter proposal request",
      text: [
        details,
        `Guest: ${proposal.full_name} <${proposal.email}>`,
        proposal.phone && `Telephone or WhatsApp: ${proposal.phone}`,
        proposal.special_occasion && `Special occasion: ${proposal.special_occasion}`,
        proposal.additional_requests && `Additional requests: ${proposal.additional_requests}`,
        proposal.cya_yacht_id && `CYA yacht ID: ${proposal.cya_yacht_id}`,
        reference,
      ].filter(Boolean).join("\n\n"),
    };
  }

  return {
    ...base,
    to: [proposal.email],
    subject: "We received your charter proposal request",
    text: [
      `Hello ${proposal.full_name},`,
      "Thank you for getting in touch with My Caribbean Charters.",
      details,
      "Our charter team will check availability and contact you about your personalized proposal. Your dates are subject to confirmation.",
      reference,
    ].join("\n\n"),
  };
}

async function sendEmail(proposal: SavedProposal, broker: boolean): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  try {
    const current = proposalEmail(proposal, broker);
    const receipt = !broker && guestRequestReceipt({
      kind: "proposal",
      fullName: proposal.full_name,
      yachtName: proposal.yacht_name,
      dates: proposal.preferred_dates + (proposal.flexible_dates && proposal.preferred_dates !== "Flexible dates" ? " (flexible)" : ""),
      guests: proposal.guest_count,
      reference: proposal.client_request_id,
    });
    const response = await sendResendEmail(
      apiKey,
      `yacht-proposal/${proposal.client_request_id}/${broker ? "broker" : "guest"}`,
      receipt ? { ...current, ...receipt } : current,
      receipt ? current : undefined,
    );
    if (!response.ok) {
      console.warn("[yacht-proposal] email provider rejected notification", { broker, status: response.status });
      return null;
    }
    const message = await response.json();
    return typeof message.id === "string" && message.id ? message.id : null;
  } catch {
    console.warn("[yacht-proposal] email attempt did not complete", { broker });
    return null;
  }
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Please submit from the yacht page." }, { status: 403 });
  }

  let proposal;
  try {
    const text = await request.text();
    if (text.length > 10_000) return NextResponse.json({ error: "This request is too large." }, { status: 413 });
    const body = JSON.parse(text);
    if (body && typeof body === "object" && !Array.isArray(body)) proposal = validateProposal(body);
  } catch {
    // Invalid JSON is handled the same way as an incomplete form.
  }
  if (!proposal) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Proposal intake is temporarily unavailable." }, { status: 503 });

  const id = proposal.client_request_id;
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const requesterHash = createHmac("sha256", key).update(ip).digest("hex");
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: status, error: saveError } = await db.rpc("submit_yacht_proposal", {
    p_enquiry: proposal,
    p_requester_hash: requesterHash,
  });
  if (status === "rate_limited") {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, {
      status: 429, headers: { "Retry-After": "3600" },
    });
  }
  if (status === "conflict") {
    return NextResponse.json({ error: "This reference belongs to a different enquiry." }, { status: 409 });
  }
  if (saveError || status !== "saved") {
    console.error("[yacht-proposal] could not save request", { code: saveError?.code });
    return NextResponse.json({ error: "We couldn’t confirm receipt. Please try again." }, { status: 503 });
  }

  const { data: saved, error: readError } = await db.from("yacht_enquiries")
    .select("client_request_id,yacht_name,cya_yacht_id,full_name,email,phone,preferred_dates,flexible_dates,guest_count,special_occasion,additional_requests,created_at,proposal_broker_email_id,proposal_guest_email_id")
    .eq("client_request_id", id).single();
  if (readError || !saved) {
    console.error("[yacht-proposal] saved request could not be read for email", { code: readError?.code });
    return NextResponse.json({ saved: true, emailPending: true }, { status: 202 });
  }

  const record = saved as SavedProposal;
  // Resend idempotency expires after 24 hours. Keep retries within that window.
  const canRetry = Date.now() - Date.parse(record.created_at) < 23 * 60 * 60 * 1000;
  const accepted = await Promise.all(deliveryColumns.map(async (column) => {
    if (record[column]) return true;
    if (!canRetry) return false;
    const messageId = await sendEmail(record, column === "proposal_broker_email_id");
    if (!messageId) return false;
    const { error } = await db.from("yacht_enquiries").update({ [column]: messageId }).eq("client_request_id", id);
    if (error) console.error("[yacht-proposal] could not record email acceptance", { code: error.code });
    return !error;
  }));
  const emailPending = accepted.some((sent) => !sent);
  return NextResponse.json({ saved: true, emailPending }, { status: emailPending ? 202 : 200 });
}
