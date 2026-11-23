import { getSupabase } from "@/lib/supabase";
import { CyaApiError, getYachtBookings, type CyaBooking } from "@/lib/cya";
import type { CrewMember } from "@/lib/yacht-detail";

// Server-side reads of MCC yacht content. Availability merges CYA's live,
// documented bookings endpoint with MCC-maintained ranges in Supabase; crew
// merges admin-entered published profiles with crew data CYA supplies in the
// yacht detail record. Failures degrade to empty.

export type CrewProfile = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  nationality: string | null;
  languages: string | null;
  qualifications: string | null;
  interests: string | null;
  culinaryBackground: string | null;
  position: string | null;
  /** "mcc" = admin-approved Supabase profile; "cya" = CYA yacht detail record. */
  source: "mcc" | "cya";
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
  /** Set when the live CYA bookings request genuinely failed (rate limit,
   *  auth, network) — distinct from a valid empty calendar. */
  liveError: string | null;
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
      qualifications: null,
      interests: null,
      culinaryBackground: null,
      position: null,
      source: "mcc" as const,
    }));
  } catch {
    return [];
  }
}

// Merges admin-approved profiles with crew CYA supplies. Curated MCC profiles
// win on a name collision; the rest of the CYA crew follow. Biographies are
// kept verbatim from their source — nothing is rewritten or invented.
export function mergeCrewProfiles(managed: CrewProfile[], cya: CrewMember[]): CrewProfile[] {
  const normalize = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");
  const seen = new Set(managed.map((m) => normalize(m.name)));
  const fromCya: CrewProfile[] = cya
    .filter((m) => !seen.has(normalize(m.name)))
    .map((m) => ({
      id: m.sourceId,
      name: m.name,
      role: m.role,
      bio: m.bio,
      photoUrl: m.photoUrl,
      nationality: m.nationality,
      languages: m.languages,
      qualifications: m.qualifications,
      interests: m.interests,
      culinaryBackground: m.culinaryBackground,
      position: m.position,
      source: "cya" as const,
    }));
  return [...managed, ...fromCya];
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
 * available without a source record. A genuine API failure is logged with
 * safe fields only and returned as an error marker so it can never be
 * mistaken for a valid empty calendar. */
async function getCyaBookingRanges(cyaYachtId: string): Promise<{ ranges: AvailabilityRange[]; error: string | null }> {
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
    return { ranges, error: null };
  } catch (err) {
    const detail =
      err instanceof CyaApiError
        ? `HTTP ${err.status}${err.code ? ` (${err.code})` : ""}`
        : "Network or unexpected error";
    console.error("[availability] live CYA bookings request failed", {
      yachtId: cyaYachtId,
      detail,
    });
    return { ranges: [], error: detail };
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
  // The Supabase read and the live CYA fetch are isolated from each other: a
  // failure in either must never wipe the other's data (previously one shared
  // try/catch turned any single failure into a fully empty calendar, hiding
  // nine good CYA records behind the unavailable fallback).
  const localRead = (async (): Promise<{ ranges: AvailabilityRange[]; lastUpdated: string | null }> => {
    try {
      const { data, error } = await getSupabase()
        .from("yacht_availability")
        .select("start_date, end_date, status, note, updated_at")
        .eq("cya_yacht_id", cyaYachtId)
        .order("start_date", { ascending: true });
      if (error || !Array.isArray(data)) return { ranges: [], lastUpdated: null };
      return { ranges: buildLocalRanges(data), lastUpdated: localLastUpdated(data) };
    } catch (err) {
      console.error("[availability] local ranges read failed", {
        yachtId: cyaYachtId,
        detail: err instanceof Error ? err.message.slice(0, 120) : "unknown",
      });
      return { ranges: [], lastUpdated: null };
    }
  })();
  const liveRead = getCyaBookingRanges(cyaYachtId);
  const [local, live] = await Promise.all([localRead, liveRead]);
  // Live CYA records win on overlapping dates: the yacht calendar is the
  // operational source of truth over locally maintained ranges.
  const liveDays = new Set<string>();
  for (const r of live.ranges) {
    for (let d = new Date(toUtc(r.startDate)); d <= toUtc(r.endDate); d = new Date(d.getTime() + 86_400_000)) {
      liveDays.add(d.toISOString().slice(0, 10));
    }
  }
  const merged = [...local.ranges.filter((r) => !rangeCoversLiveDays(r, liveDays)), ...live.ranges];
  return { ranges: merged, lastUpdated: local.lastUpdated, hasLiveData: live.ranges.length > 0, liveError: live.error };
}
