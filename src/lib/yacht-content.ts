import { getSupabase } from "@/lib/supabase";
import { getYachtBookings, type CyaBooking } from "@/lib/cya";

// Server-side reads of MCC yacht content. Availability merges CYA's live,
// documented bookings endpoint with MCC-maintained ranges in Supabase; crew
// comes from admin-entered published profiles. Failures degrade to empty.

export type CrewProfile = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  nationality: string | null;
  languages: string | null;
};

export type AvailabilityRange = {
  startDate: string;
  endDate: string;
  status: "available" | "booked" | "hold" | "transit" | "unavailable";
  note: string | null;
};

export type YachtAvailability = {
  ranges: AvailabilityRange[];
  lastUpdated: string | null;
  /** True when at least one range comes from CYA's live bookings endpoint. */
  hasLiveData: boolean;
};

export async function getYachtCrew(cyaYachtId: string): Promise<CrewProfile[]> {
  try {
    const { data, error } = await getSupabase()
      .from("yacht_crew")
      .select("id, name, role, bio, photo_url, nationality, languages")
      .eq("cya_yacht_id", cyaYachtId)
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      role: String(row.role),
      bio: typeof row.bio === "string" && row.bio.trim() ? row.bio.trim() : null,
      photoUrl: typeof row.photo_url === "string" && row.photo_url.startsWith("https://") ? row.photo_url : null,
      nationality: typeof row.nationality === "string" && row.nationality.trim() ? row.nationality.trim() : null,
      languages: typeof row.languages === "string" && row.languages.trim() ? row.languages.trim() : null,
    }));
  } catch {
    return [];
  }
}

/* CYA booking categories map to calendar statuses. Verified categories in
 * CYA's calendar include booked charters and time-limited options (holds);
 * unknown categories are shown as neutral blocked dates, never as available.
 * An expired hold (hold_expire_date in the past) is no longer an active hold:
 * it is dropped entirely so its days return to unknown rather than staying
 * coloured as hold. */
function bookingStatus(booking: CyaBooking, today: string): AvailabilityRange["status"] | null {
  const category = booking.category.toLowerCase();
  const isHold = Boolean(booking.holdExpireDate) || category.includes("hold") || category.includes("option");
  if (isHold && booking.holdExpireDate && booking.holdExpireDate < today) return null;
  if (isHold) return "hold";
  if (category.includes("book")) return "booked";
  if (category.includes("transit") || category.includes("relocation")) return "transit";
  if (category.includes("unavailable") || category.includes("owner")) return "unavailable";
  // A dated record exists but its category is unrecognized: it still blocks
  // the dates, so show the neutral blocked status rather than fabricating one.
  if (category) return "unavailable";
  return null;
}

/* Converts CYA's live bookings (booked/hold/transit records) into calendar
 * ranges. Days without a CYA record stay unknown — never rendered as
 * available without a source record. Failures degrade to empty. */
async function getCyaBookingRanges(cyaYachtId: string): Promise<AvailabilityRange[]> {
  try {
    const bookings = await getYachtBookings(cyaYachtId);
    const today = new Date().toISOString().slice(0, 10);
    const ranges: AvailabilityRange[] = [];
    for (const booking of bookings) {
      const status = bookingStatus(booking, today);
      if (!status) continue;
      ranges.push({
        startDate: booking.startDate,
        endDate: booking.endDate,
        status,
        note: booking.title,
      });
    }
    return ranges;
  } catch {
    return [];
  }
}

function toUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
}

function buildLocalRanges(data: unknown[]): AvailabilityRange[] {
  const validStatuses = new Set(["available", "booked", "hold", "transit", "unavailable"]);
  const ranges: AvailabilityRange[] = [];
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const status = typeof r.status === "string" ? r.status : "";
    if (!validStatuses.has(status)) continue;
    const start = typeof r.start_date === "string" ? r.start_date.slice(0, 10) : null;
    const end = typeof r.end_date === "string" ? r.end_date.slice(0, 10) : null;
    if (!start || !end) continue;
    ranges.push({
      startDate: start,
      endDate: end,
      status: status as AvailabilityRange["status"],
      note: typeof r.note === "string" && r.note.trim() ? r.note.trim() : null,
    });
  }
  return ranges;
}

function localLastUpdated(data: unknown[]): string | null {
  let lastUpdated: string | null = null;
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const updated = (row as Record<string, unknown>).updated_at;
    if (typeof updated === "string" && (lastUpdated === null || updated > lastUpdated)) lastUpdated = updated;
  }
  return lastUpdated;
}

function rangeCoversLiveDays(range: AvailabilityRange, liveDays: Set<string>): boolean {
  const start = toUtc(range.startDate);
  const end = toUtc(range.endDate);
  for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86_400_000)) {
    if (liveDays.has(d.toISOString().slice(0, 10))) return true;
  }
  return false;
}

export async function getYachtAvailability(cyaYachtId: string): Promise<YachtAvailability> {
  try {
    const [{ data, error }, live] = await Promise.all([
      getSupabase()
        .from("yacht_availability")
        .select("start_date, end_date, status, note, updated_at")
        .eq("cya_yacht_id", cyaYachtId)
        .order("start_date", { ascending: true }),
      getCyaBookingRanges(cyaYachtId),
    ]);
    const local = error || !Array.isArray(data) ? [] : buildLocalRanges(data);
    // Live CYA records win on overlapping dates: the yacht calendar is the
    // operational source of truth over locally maintained ranges.
    const liveDays = new Set<string>();
    for (const r of live) {
      for (let d = new Date(toUtc(r.startDate)); d <= toUtc(r.endDate); d = new Date(d.getTime() + 86_400_000)) {
        liveDays.add(d.toISOString().slice(0, 10));
      }
    }
    const merged = [...local.filter((r) => !rangeCoversLiveDays(r, liveDays)), ...live];
    const lastUpdated = error || !Array.isArray(data) ? null : localLastUpdated(data);
    return { ranges: merged, lastUpdated, hasLiveData: live.length > 0 };
  } catch {
    return { ranges: [], lastUpdated: null, hasLiveData: false };
  }
}
