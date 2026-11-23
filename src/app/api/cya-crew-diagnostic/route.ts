import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getYachtDetail } from "@/lib/cya";
import { parseCrew } from "@/lib/yacht-detail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-request crew-field discovery against live CYA yacht details. Same
// token gate as /api/cya-verify: the report never contains credentials, and
// long biographies are truncated. Run as:
//   curl -H "x-admin-token: $ADMIN_API_TOKEN" \
//     "https://<deployment>/api/cya-crew-diagnostic?yacht_ids=<id1>,<id2>"
// Yacht ids default to ENDLESS HORIZON, MISCHIEVOUS, OHANA, VIVA LA VIDA.

const DEFAULT_IDS = [
  "69f33df0b5a1600bf785869e", // ENDLESS HORIZON
  "69f33df2b5a1600bf78586a2", // MISCHIEVOUS
  "6a023755ce6b8709506dfee5", // OHANA
  "69f83a8e8ae166becdd09df5", // VIVA LA VIDA
];

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function clip(value: unknown, max = 160): unknown {
  if (typeof value === "string" && value.length > max) return `${value.slice(0, max)}…`;
  if (Array.isArray(value)) return value.slice(0, 3).map((v) => clip(v, max));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 12)
        .map(([k, v]) => [k, clip(v, max)])
    );
  }
  return value;
}

// Crew-shaped top-level fields with a value-type summary, so a mapping gap is
// visible even when no known collection key matched.
function crewShapedFields(detail: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(detail)) {
    if (!/crew|captain|chef|steward|deckhand|pref_crew/i.test(key)) continue;
    out[key] = clip(value);
  }
  return out;
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

  const requested = (new URL(request.url).searchParams.get("yacht_ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-f0-9]{8,32}$/i.test(s));
  const ids = (requested.length > 0 ? requested : DEFAULT_IDS).slice(0, 6);

  const yachts = await Promise.all(
    ids.map(async (yachtId) => {
      try {
        const detail = await getYachtDetail(yachtId);
        const members = parseCrew(detail);
        return {
          yachtId,
          yachtName: typeof detail.yachtName === "string" ? detail.yachtName : null,
          resolved: members.length > 0,
          members: members.map((m) => ({
            name: m.name,
            role: m.role,
            populatedFields: {
              bio: m.bio !== null,
              photo: m.photoUrl !== null,
              nationality: m.nationality !== null,
              languages: m.languages !== null,
              qualifications: m.qualifications !== null,
              interests: m.interests !== null,
              culinaryBackground: m.culinaryBackground !== null,
            },
            bioPreview: m.bio ? `${m.bio.slice(0, 200)}…` : null,
            photoUrl: m.photoUrl,
          })),
          // Fields present in the raw record that look crew-related but did
          // NOT resolve into members — the mapping-failure signal.
          unresolvedCrewShapedFields: crewShapedFields(detail),
          allTopLevelFields: Object.keys(detail),
        };
      } catch (err) {
        return {
          yachtId,
          yachtName: null,
          resolved: false,
          error: err instanceof Error ? err.message.slice(0, 200) : "Unknown error",
        };
      }
    })
  );

  return NextResponse.json({
    executedServerSide: true,
    note:
      "resolved=true means parseCrew found crew under known collection keys. If a yacht shows unresolvedCrewShapedFields entries but resolved=false, the field names above are the new mapping to add to CREW_COLLECTION_KEYS.",
    yachts,
  });
}
