import { createClient } from "@supabase/supabase-js";
import type { CalendarDay } from "./calendar";

export function cabinCalendarDatabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key
    ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
}

export async function loadCabinCalendar(today: string): Promise<CalendarDay[] | null> {
  const db = cabinCalendarDatabase();
  if (!db) return [];

  const days: CalendarDay[] = [];
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await db.from("bvi_cabin_calendar_days")
      .select("yacht_id,starts_on,status,rate_nights,rate_usd")
      .gte("starts_on", today).order("starts_on").order("yacht_id")
      .range(offset, offset + pageSize - 1);
    if (error) {
      if (error.code === "42P01" || error.code === "PGRST205") return [];
      console.warn("[bvi-cabin-calendar] could not load staff calendar", { code: error.code });
      return null;
    }
    days.push(...data);
    if (data.length < pageSize) return days;
  }
}
