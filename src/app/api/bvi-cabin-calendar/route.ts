import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cabinCalendarToday, calendarStatuses } from "@/app/bvi-cabin-charter/calendar";
import { cabinCalendarDatabase } from "@/app/bvi-cabin-charter/calendar-server";
import { cabinYachts } from "@/app/bvi-cabin-charter/yachts";

export const runtime = "nodejs";

function hasAccess(request: Request) {
  const expected = Buffer.from(process.env.ADMIN_API_TOKEN ?? "");
  const supplied = Buffer.from(request.headers.get("x-admin-token") ?? "");
  return expected.length > 0 && expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function isValidDay(yacht: unknown, day: unknown) {
  return cabinYachts.some(option => yacht === option.id) &&
    typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= cabinCalendarToday()
    && !Number.isNaN(Date.parse(day)) && new Date(day).toISOString().slice(0, 10) === day;
}

const unauthorized = () => NextResponse.json({ error: "Invalid staff access token." }, { status: 401 });
const unavailable = () => NextResponse.json({ error: "Calendar storage is unavailable. Check the Supabase connection and calendar migration." }, { status: 503 });
const invalid = () => NextResponse.json({ error: "Check the yacht, date, status and rate fields." }, { status: 400 });

export async function GET(request: Request) {
  if (!hasAccess(request)) return unauthorized();
  const params = new URL(request.url).searchParams;
  const yacht = params.get("yacht");
  const date = params.get("date");
  if (!isValidDay(yacht, date)) return invalid();
  const db = cabinCalendarDatabase();
  if (!db) return unavailable();
  const { data, error } = await db.from("bvi_cabin_calendar_days")
    .select("status,rate_nights,rate_usd").eq("yacht_id", yacht).eq("starts_on", date).maybeSingle();
  return error ? unavailable() : NextResponse.json({ day: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!hasAccess(request)) return unauthorized();
  const input = await request.json().catch(() => null);
  if (!input || !isValidDay(input.yacht, input.date) || typeof input.status !== "string" ||
    !Object.hasOwn(calendarStatuses, input.status)) return invalid();
  const { nights, usd } = input;
  if (!(nights === null && usd === null) &&
    (!Number.isInteger(nights) || nights < 1 || nights > 30 || !Number.isInteger(usd) || usd < 1 || usd > 100000)) return invalid();

  const db = cabinCalendarDatabase();
  if (!db) return unavailable();
  const { error } = await db.from("bvi_cabin_calendar_days").upsert({
    yacht_id: input.yacht, starts_on: input.date, status: input.status, rate_nights: nights, rate_usd: usd,
  });
  return error ? unavailable() : NextResponse.json({ saved: true });
}
