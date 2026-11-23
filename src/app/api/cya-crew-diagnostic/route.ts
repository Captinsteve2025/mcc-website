import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getYachtDetail } from "@/lib/cya";
import {
  parseCrewWithTrace,
  parseCrewGeneral,
  parseMenus,
  unusedCrewEntryKeys,
  type MenuCategory,
} from "@/lib/yacht-detail";
import { getYachtCrew, mergeCrewProfiles } from "@/lib/yacht-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Yacht crew-profile diagnostic: fetches the full authenticated CYA detail
// record for one yacht, reports every crew-shaped field with its type, the
// exact field paths the parser used, the parsed profile count, and a
// raw-vs-delivered comparison against what the public Meet Your Crew section
// receives. The verdict distinguishes "CYA supplies no crew data" from "the
// parser failed to recognize it". Credentials never appear in the output;
// emails and phone numbers inside values are redacted before serialization.

const DEFAULT_YACHT_ID = "69f33df0b5a1600bf785869e"; // ENDLESS HORIZON

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function redactText(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email removed]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[phone removed]");
}

function preview(value: unknown, max = 160): string | null {
  if (value === null || value === undefined) return null;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (text === null) return null;
  const clipped = text.length > max ? `${text.slice(0, max)}…` : text;
  return redactText(clipped);
}

function describeValue(value: unknown): { type: string; preview: string | null } {
  return {
    type: Array.isArray(value) ? "array" : value === null ? "null" : typeof value,
    preview: preview(value),
  };
}

const MENU_KNOWN_ENTRY_KEYS = new Set([
  "title",
  "meal",
  "meal_type",
  "course",
  "category",
  "menu_title",
  "name",
  "menu_category",
  "type",
  "menuTitle",
  "menuCategory",
  "menuDescription",
  "menuImage",
  "description",
  "menu",
  "items",
  "details",
  "body",
  "text",
  "content",
  "menu_description",
  "menu_items",
  "dishes",
  "image",
  "image_src",
  "photo",
  "photo_url",
  "menu_image",
  "image_url",
  "picture",
  "photo_src",
  "src",
  "caption",
  "alt",
]);

const MENU_KNOWN_PHOTO_COLLECTIONS = new Set(["Images", "images", "photos", "menu_images", "gallery", "Photos"]);

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
  const ids = requested.length > 0 ? requested.slice(0, 6) : [DEFAULT_YACHT_ID];

  const yachts = await Promise.all(
    ids.map(async (yachtId) => {
      try {
        const detail = await getYachtDetail(yachtId);
        const trace = parseCrewWithTrace(detail);
        const general = parseCrewGeneral(detail);
        const menus = parseMenus(detail);
        const managedCrew = await getYachtCrew(yachtId);
        const delivered = mergeCrewProfiles(managedCrew, trace.members);

        // Menu field structure: raw shapes of menuDetails/menuGeneral, every
        // recognized text field's exact path, photo URLs with descriptions,
        // the meal categories CYA supplies, and fields the parser omits.
        const menuOmitted = [
          ...(Array.isArray(detail.menuDetails)
            ? detail.menuDetails
                .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === "object" && !Array.isArray(e))
                .flatMap((entry, i) =>
                  Object.keys(entry)
                    .filter((k) => !MENU_KNOWN_ENTRY_KEYS.has(k) && !MENU_KNOWN_PHOTO_COLLECTIONS.has(k))
                    .map((k) => ({ path: `menuDetails[${i}].${k}`, ...describeValue(entry[k]) }))
                )
            : []),
          ...(detail.menuGeneral && typeof detail.menuGeneral === "object" && !Array.isArray(detail.menuGeneral)
            ? Object.keys(detail.menuGeneral as Record<string, unknown>)
                .filter((k) => !MENU_KNOWN_ENTRY_KEYS.has(k) && !MENU_KNOWN_PHOTO_COLLECTIONS.has(k))
                .map((k) => ({ path: `menuGeneral.${k}`, ...describeValue((detail.menuGeneral as Record<string, unknown>)[k]) }))
            : []),
        ];

        const menuReport = {
          menuDetailsPresent: detail.menuDetails !== undefined && detail.menuDetails !== null,
          menuDetailsType: Array.isArray(detail.menuDetails)
            ? "array"
            : detail.menuDetails === null
              ? "null"
              : typeof detail.menuDetails,
          menuGeneralPresent: detail.menuGeneral !== undefined && detail.menuGeneral !== null,
          categories: menus.categories.map((c: MenuCategory) => ({
            title: c.title,
            path: c.path,
            bodyFormat: c.bodyHtml ? "html" : c.bodyText ? "text" : "none",
            bodyPreview: preview(c.bodyText ?? c.bodyHtml, 200),
            photo: c.photo,
          })),
          categoryCount: menus.categories.length,
          photoCount: menus.photos.length,
          photos: menus.photos,
          general: menus.general,
          omittedFields: menuOmitted,
          verdict: (() => {
            if (menus.categories.length > 0 || menus.photos.length > 0 || menus.general) {
              return {
                code: "menu_delivered",
                headline: `${menus.categories.length} menu category(ies) and ${menus.photos.length} food photograph(s) parsed and delivered to the public page.`,
              };
            }
            if (detail.menuDetails !== undefined && detail.menuDetails !== null) {
              return {
                code: "parser_gap",
                headline: "menuDetails exists in the CYA response but the parser recognized no menu content in it.",
                explanation:
                  "The Dining & Cuisine section is hidden because of a mapping gap, not missing data. Check the omitted-fields list for the unrecognized field names.",
              };
            }
            return {
              code: "no_source_data",
              headline: "CYA supplies no menuDetails or menuGeneral for this yacht.",
              explanation:
                "The Dining & Cuisine section is hidden because CYA genuinely holds no menu data here. Nothing is fabricated.",
            };
          })(),
        };

        const matchedKeys = new Set(trace.matchedCollectionKeys);
        const crewShapedRawFields = trace.crewShapedTopLevelKeys.map((f) => {
          const raw = (detail as Record<string, unknown>)[f.key];
          return { key: f.key, matched: matchedKeys.has(f.key), ...describeValue(raw) };
        });

        // Everything crew-shaped that exists in CYA but never reaches the page:
        // unrecognized top-level collections plus fields inside parsed entries
        // that the component does not consume.
        const omittedData = [
          ...crewShapedRawFields.filter((f) => !f.matched).map((f) => ({ path: f.key, type: f.type, preview: f.preview })),
          ...trace.rawEntries.flatMap(({ collection, index, entry }) =>
            unusedCrewEntryKeys(entry).map((key) => ({
              path: `${collection}[${index}].${key}`,
              ...describeValue(entry[key]),
            }))
          ),
        ];

        const verdict = (() => {
          if (trace.members.length > 0) {
            return {
              code: "crew_parsed",
              headline: `${trace.members.length} crew profile(s) parsed from CYA and delivered to the public page.`,
              explanation:
                "The parser matched CYA's crew fields. Compare the parsed members below against the delivered table to confirm biographies and photographs survive intact.",
            };
          }
          if (trace.crewShapedTopLevelKeys.length > 0) {
            return {
              code: "parser_gap",
              headline: "Crew-shaped data exists in the CYA response but the parser does not recognize it.",
              explanation:
                "The Meet Your Crew section is hidden on the public page because of a mapping gap, not missing data. Add the unrecognized field names listed under omitted data to the parser's candidate keys.",
            };
          }
          return {
            code: "no_crew_data",
            headline: "CYA's detail record for this yacht carries no crew fields at all.",
            explanation:
              "The Meet Your Crew section is hidden because CYA genuinely supplies no crew data here — this is not a parser failure. Crew profiles must come from MCC's admin-maintained records unless CYA confirms an alternative crew source.",
          };
        })();

        return {
          yachtId,
          yachtName: typeof detail.yachtName === "string" ? detail.yachtName : null,
          verdict,
          parsedCount: trace.members.length,
          crewGeneral: general
            ? {
                photoPresent: general.photoUrl !== null,
                photoUrl: general.photoUrl,
                descriptionPresent: general.descriptionHtml !== null,
                descriptionPreview: preview(general.descriptionText, 220),
                paths: general.paths,
              }
            : null,
          members: trace.members.map((m) => ({
            name: m.name,
            role: m.role,
            bioPresent: m.bio !== null,
            bioPreview: m.bio ? preview(m.bio, 220) : null,
            photoUrl: m.photoUrl,
            nationality: m.nationality,
            languages: m.languages,
            qualifications: m.qualifications,
            interests: m.interests,
            culinaryBackground: m.culinaryBackground,
            paths: m.paths,
          })),
          fieldPathsUsed: trace.members.flatMap((m) =>
            Object.entries(m.paths)
              .filter(([, path]) => path !== null)
              .map(([field, path]) => `${field}: ${path}`)
          ),
          crewShapedRawFields,
          omittedData,
          delivered: delivered.map((m) => ({
            name: m.name,
            role: m.role,
            source: m.source,
            bioPresent: m.bio !== null,
            bioCharacters: m.bio?.length ?? null,
            photoPresent: m.photoUrl !== null,
          })),
          menus: menuReport,
          allTopLevelFields: Object.keys(detail),
        };
      } catch (err) {
        return {
          yachtId,
          yachtName: null,
          error: err instanceof Error ? err.message.slice(0, 200) : "Unknown error",
        };
      }
    })
  );

  return NextResponse.json({
    executedServerSide: true,
    note: "Email addresses and phone numbers inside field values are redacted. No API credentials are included.",
    yachts,
  });
}
