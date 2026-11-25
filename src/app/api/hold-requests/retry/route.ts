import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deliverHoldEmails, getHoldDatabase, holdRequestsEnabled } from "@/lib/hold-request-server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const secret = process.env.ADMIN_API_TOKEN;
  const token = request.headers.get("x-admin-token");
  const supplied = Buffer.from(token ?? "");
  const expected = Buffer.from(secret ?? "");
  if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!holdRequestsEnabled()) {
    return NextResponse.json({ error: "Hold requests are currently unavailable." }, { status: 503 });
  }

  const db = getHoldDatabase();
  const { data, error } = await db.from("yacht_hold_requests")
    .select("id")
    .or("broker_email_id.is.null,guest_email_id.is.null")
    .lte("next_email_attempt_at", new Date().toISOString())
    .gt("created_at", new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString())
    .order("next_email_attempt_at")
    .limit(5);
  if (error) return NextResponse.json({ error: "The retry queue is unavailable." }, { status: 503 });

  const outcomes = await Promise.allSettled(data.map(({ id }) => deliverHoldEmails(db, id)));
  const accepted = outcomes.filter((outcome) => outcome.status === "fulfilled" && outcome.value).length;
  return NextResponse.json({ checked: outcomes.length, accepted, stillPending: outcomes.length - accepted });
}
