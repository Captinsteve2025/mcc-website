import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CyaApiError, getYachtDetail } from "@/lib/cya";
import { CYA_YACHT_ID_PATTERN, HOLD_BOOKINGS_EMAIL, holdGuestLimit, MANAGED_YACHT_HOLD_PREFIX } from "@/lib/hold-request";
import { managedYachts } from "@/lib/managed-yachts";
import { parseAccommodation, str } from "@/lib/yacht-detail";

export function holdRequestsEnabled(): boolean {
  return process.env.HOLD_REQUESTS_ENABLED === "true" && Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.RESEND_API_KEY
  );
}

export function getHoldDatabase(): SupabaseClient {
  return createClient(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function getYachtForHold(id: string): Promise<{ name: string; maxGuests: number } | null> {
  if (id.startsWith(MANAGED_YACHT_HOLD_PREFIX)) {
    const yacht = managedYachts.find(({ slug }) => id === MANAGED_YACHT_HOLD_PREFIX + slug);
    return yacht ? { name: yacht.name, maxGuests: holdGuestLimit(yacht.maxGuests) } : null;
  }
  if (!CYA_YACHT_ID_PATTERN.test(id)) return null;

  try {
    const yacht = await getYachtDetail(id);
    return {
      name: str(yacht.yachtName)?.replace(/\s+/g, " ").slice(0, 200) ?? "Charter yacht",
      maxGuests: holdGuestLimit(parseAccommodation(yacht).pax),
    };
  } catch (error) {
    if (error instanceof CyaApiError && error.status === 404) return null;
    throw error;
  }
}

type HoldDelivery = {
  id: string;
  yacht_id: string;
  yacht_name: string | null;
  start_date: string;
  end_date: string;
  guest_count: number;
  full_name: string;
  email: string;
  broker_email_id: string | null;
  guest_email_id: string | null;
};

const emailKinds = ["broker", "guest"] as const;

function emailFor(request: HoldDelivery, kind: typeof emailKinds[number]) {
  const dates = `${request.start_date} to ${request.end_date}`;
  const reference = `Reference ${request.id}`;
  const name = request.yacht_name ?? "OHANA"; // Legacy requests came from the OHANA-only form.
  const base = {
    from: `My Caribbean Charters <${HOLD_BOOKINGS_EMAIL}>`,
    reply_to: HOLD_BOOKINGS_EMAIL,
  };

  if (kind === "broker") {
    const managed = request.yacht_id.startsWith(MANAGED_YACHT_HOLD_PREFIX);
    return {
      ...base,
      to: [HOLD_BOOKINGS_EMAIL],
      subject: `${name} hold request for review`,
      text: [
        reference,
        `${name} · ${dates} · ${request.guest_count} guests`,
        `Guest: ${request.full_name} <${request.email}>`,
        managed
          ? "Check the yacht’s bookings, holds, and turnaround requirements before placing a hold. Contact the guest once you have reviewed the dates."
          : "Check CYA for existing bookings, holds, and turnaround requirements before placing a hold. Contact the guest once you have reviewed the dates.",
        managed
          ? `Managed yacht: ${request.yacht_id.slice(MANAGED_YACHT_HOLD_PREFIX.length)}`
          : `CYA yacht ID: ${request.yacht_id}`,
      ].join("\n\n"),
    };
  }

  return {
    ...base,
    to: [request.email],
    subject: `Your ${name} hold request was received`,
    text: [
      `Hello ${request.full_name},`,
      `We received your request for ${name} for ${dates} for ${request.guest_count} guests.`,
      "Our charter team will check availability and contact you. Your dates are subject to confirmation.",
      reference,
      "You can reply to this email with any questions.",
      "My Caribbean Charters",
    ].join("\n\n"),
  };
}

export async function deliverHoldEmails(db: SupabaseClient, id: string): Promise<boolean> {
  const { data, error } = await db.rpc("claim_yacht_hold_email", { p_id: id }).maybeSingle();
  if (error) throw error;

  if (!data) {
    const { data: current, error: readError } = await db
      .from("yacht_hold_requests").select("broker_email_id,guest_email_id").eq("id", id).maybeSingle();
    if (readError) throw readError;
    return Boolean(current?.broker_email_id && current?.guest_email_id);
  }

  const hold = data as HoldDelivery;
  const delivered = await Promise.all(emailKinds.map(async (kind) => {
    const column = kind === "broker" ? "broker_email_id" : "guest_email_id";
    if (hold[column]) return true;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `hold-request/${hold.id}/${kind}`,
        },
        body: JSON.stringify(emailFor(hold, kind)),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) {
        console.warn("[hold-request] email provider rejected a delivery attempt", { kind, status: response.status });
        return false;
      }
      const message = await response.json();
      if (typeof message.id !== "string" || !message.id) return false;
      const { error: updateError } = await db.from("yacht_hold_requests")
        .update({ [column]: message.id }).eq("id", id);
      if (updateError) {
        console.warn("[hold-request] delivery could not be recorded", { kind });
        return false;
      }
      return true;
    } catch {
      console.warn("[hold-request] email attempt did not complete", { kind });
      return false;
    }
  }));

  return delivered.every(Boolean);
}
