import { getSupabase } from "@/lib/supabase";

// Server-side reads of MCC-maintained yacht content. CYA's licensed API does
// not currently expose crew profiles or dated availability (verified: no such
// endpoints exist in the client and inventing paths is prohibited), so this
// content is entered through the MCC admin interface and stored in Supabase.
// Only approved/published rows are readable; failures degrade to empty.

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

export async function getYachtAvailability(cyaYachtId: string): Promise<YachtAvailability> {
  try {
    const { data, error } = await getSupabase()
      .from("yacht_availability")
      .select("start_date, end_date, status, note, updated_at")
      .eq("cya_yacht_id", cyaYachtId)
      .order("start_date", { ascending: true });
    if (error || !Array.isArray(data)) return { ranges: [], lastUpdated: null };
    const validStatuses = new Set(["available", "booked", "hold", "transit", "unavailable"]);
    const ranges: AvailabilityRange[] = [];
    let lastUpdated: string | null = null;
    for (const row of data) {
      if (!validStatuses.has(row.status)) continue;
      const start = typeof row.start_date === "string" ? row.start_date.slice(0, 10) : null;
      const end = typeof row.end_date === "string" ? row.end_date.slice(0, 10) : null;
      if (!start || !end) continue;
      ranges.push({
        startDate: start,
        endDate: end,
        status: row.status as AvailabilityRange["status"],
        note: typeof row.note === "string" && row.note.trim() ? row.note.trim() : null,
      });
      const updated = typeof row.updated_at === "string" ? row.updated_at : null;
      if (updated && (lastUpdated === null || updated > lastUpdated)) lastUpdated = updated;
    }
    return { ranges, lastUpdated };
  } catch {
    return { ranges: [], lastUpdated: null };
  }
}
