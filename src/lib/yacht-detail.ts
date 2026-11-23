import type { Yacht } from "@/lib/cya";

// Typed, defensive parsing of the verified `yachts_get` response. Every
// accessor returns null/empty when CYA does not supply the value; nothing is
// invented and no raw HTML reaches the page.

export function str(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

// CYA returns the spelling `lenght`. Its value may be "80" with a separate
// `units` field ("ft"/"m"). Never assume a unit.
export function lengthWithUnit(detail: Yacht): { value: number; unit: string } | null {
  const value = num(detail.lenght);
  if (value === null) return null;
  const unit = str(detail.units) ?? str(detail.lenght_unit) ?? str(detail.length_unit);
  return { value, unit: unit ?? "ft" };
}

function dimensionWithUnit(detail: Yacht, key: string): { value: number; unit: string } | null {
  const value = num(detail[key]);
  if (value === null) return null;
  const unit = str(detail.units) ?? str(detail.lenght_unit) ?? str(detail.length_unit);
  return { value, unit: unit ?? "ft" };
}

export function beamWithUnit(detail: Yacht) {
  return dimensionWithUnit(detail, "beam");
}

export function draftWithUnit(detail: Yacht) {
  return dimensionWithUnit(detail, "draft");
}

export type GalleryImage = {
  src: string;
  title: string | null;
  description: string | null;
  category: string | null;
};

// Verified live: main_image is an HTTPS URL and Images is an array of objects
// carrying image_src plus optional title/description/category.
export function collectGallery(detail: Yacht): GalleryImage[] {
  const gallery: GalleryImage[] = [];
  const seen = new Set<string>();
  const push = (src: string | null, title: string | null = null, description: string | null = null, category: string | null = null) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    gallery.push({ src, title, description, category });
  };

  push(str(detail.main_image));

  const images = detail.Images;
  if (Array.isArray(images)) {
    for (const item of images) {
      if (typeof item === "string") {
        push(item);
      } else if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        push(str(obj.image_src), str(obj.title), str(obj.description), str(obj.category));
      }
    }
  } else if (typeof images === "string" && images.startsWith("https://")) {
    push(images);
  }
  return gallery;
}

// One-pass HTML entity decoding: a named or numeric reference found in the
// original text is decoded exactly once, so "&amp;bull;" becomes the literal
// text "&bull;" and is never decoded a second time. Unknown named references
// are left as-is; invalid numeric ones are dropped.
const NAMED_ENTITIES: Record<string, string> = {
  bull: "\u2022",
  middot: "\u00b7",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201c",
  rdquo: "\u201d",
  deg: "\u00b0",
  euro: "\u20ac",
  pound: "\u00a3",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
  eacute: "\u00e9",
  egrave: "\u00e8",
  agrave: "\u00e0",
  ccedil: "\u00e7",
  ntilde: "\u00f1",
  auml: "\u00e4",
  ouml: "\u00f6",
  uuml: "\u00fc",
  szlig: "\u00df",
};

const ENTITY_PATTERN = /&([a-zA-Z][a-zA-Z0-9]{1,30}|#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6});/g;

function decodeHtmlEntities(text: string): string {
  return text.replace(ENTITY_PATTERN, (match, body: string) => {
    if (body.startsWith("#")) {
      const codePoint =
        body[1] === "x" || body[1] === "X"
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      if (
        !Number.isInteger(codePoint) ||
        codePoint < 32 ||
        codePoint > 0x10ffff ||
        (codePoint >= 0xd800 && codePoint <= 0xdfff)
      ) {
        return "";
      }
      return String.fromCodePoint(codePoint);
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

// Strip markup and decode entities from CYA plain-text fields. Decoding runs
// BEFORE tag stripping so numeric references like &#8226; become their real
// character instead of vanishing; anything that decodes into a tag is stripped
// with the rest, never rendered. Used for specs, amenities, watersports,
// accommodation and season text — plain text only. Rich CYA HTML (the general
// crew description) goes through the separate HTML sanitizer instead.
export function cleanText(value: unknown): string | null {
  const text = str(value);
  if (text === null) return null;
  const cleaned = decodeHtmlEntities(text)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

export type SeasonRate = {
  title: string;
  category: string | null;
  dates: string | null;
  price: string | null;
  area: string | null;
  details: string | null;
  pickup: string | null;
  basePort: string | null;
  charterType: string | null;
  terms: string | null;
};

function formatMoney(amount: number, currency: string | null): string {
  const rounded = Math.round(amount).toLocaleString("en-US");
  if (currency === "USD") return `$${rounded}`;
  if (currency === "EUR") return `\u20ac${rounded}`;
  if (currency === "GBP") return `\u00a3${rounded}`;
  return currency ? `${currency} ${rounded}` : `$${rounded}`;
}

// Verified seasons[] structure: title, season_category, start_date, end_date,
// base_price, currency, location_areas, location_details, preferred_pickup,
// base_port, charter_type, terms. Currency is never assumed to be USD.
export function parseSeasons(detail: Yacht): SeasonRate[] {
  const seasons = detail.seasons;
  if (!Array.isArray(seasons)) return [];
  const rows: SeasonRate[] = [];
  for (const s of seasons) {
    if (!s || typeof s !== "object") continue;
    const obj = s as Record<string, unknown>;
    const title = str(obj.title) ?? "Season";
    const start = str(obj.start_date);
    const end = str(obj.end_date);
    const rawPrice = num(obj.base_price);
    const currency = str(obj.currency);
    const areaNames = Array.isArray(obj.location_areas)
      ? obj.location_areas
          .map((a) =>
            typeof a === "string"
              ? a
              : a && typeof a === "object"
                ? str((a as Record<string, unknown>).label ?? (a as Record<string, unknown>).name)
                : null
          )
          .filter((n): n is string => Boolean(n))
          .slice(0, 4)
          .join(", ")
      : null;
    rows.push({
      title,
      category: str(obj.season_category),
      dates: start || end ? [start, end].filter(Boolean).join(" \u2013 ") : null,
      price: rawPrice !== null ? `${formatMoney(rawPrice, currency)} / week` : null,
      area: areaNames,
      details: cleanText(obj.location_details),
      pickup: cleanText(obj.preferred_pickup),
      basePort: cleanText(obj.base_port),
      charterType: cleanText(obj.charter_type),
      terms: cleanText(obj.terms),
    });
  }
  return rows;
}

export type AccommodationSummary = {
  pax: number | null;
  cabins: number | null;
  configLine: string | null;
  bathrooms: string | null;
  otherFields: Array<{ label: string; value: string }>;
  description: string | null;
};

// Verified accommodations object: cabin counts, bathroom fixtures and free
// text. Only meaningful, non-zero values are rendered.
export function parseAccommodation(detail: Yacht): AccommodationSummary {
  const acc = detail.accommodations;
  const result: AccommodationSummary = {
    pax: num(detail.pax),
    cabins: num(detail.cabins),
    configLine: null,
    bathrooms: null,
    otherFields: [],
    description: null,
  };
  if (!acc || typeof acc !== "object" || Array.isArray(acc)) {
    result.description = cleanText(acc);
    return result;
  }
  const obj = acc as Record<string, unknown>;

  const cabinParts: string[] = [];
  const cabinLabels: Array<[string, string]> = [
    ["king_cabins", "king cabin"],
    ["queen_cabins", "queen cabin"],
    ["double_cabins", "double cabin"],
    ["single_cabins", "single cabin"],
    ["twin_cabins", "twin cabin"],
    ["pullman_berts", "pullman berth"],
  ];
  for (const [key, label] of cabinLabels) {
    const count = num(obj[key]);
    if (count === null || count <= 0) continue;
    cabinParts.push(`${count} ${label}${count > 1 ? "s" : ""}`);
  }
  if (cabinParts.length > 0) {
    const list =
      cabinParts.length > 1
        ? `${cabinParts.slice(0, -1).join(", ")} and ${cabinParts[cabinParts.length - 1]}`
        : cabinParts[0];
    result.configLine = list.charAt(0).toUpperCase() + list.slice(1);
  }

  const showers = num(obj.showers);
  const heads = num(obj.heads);
  const electricHeads = num(obj.electrics_heads);
  const bathParts: string[] = [];
  if (showers !== null && showers > 0) bathParts.push(`${showers} shower${showers > 1 ? "s" : ""}`);
  const headCount = heads ?? electricHeads;
  if (headCount !== null && headCount > 0) bathParts.push(`${headCount} bathroom${headCount > 1 ? "s" : ""}`);
  if (bathParts.length > 0) result.bathrooms = bathParts.join(" \u00b7 ");

  const shown = new Set([
    "king_cabins",
    "queen_cabins",
    "double_cabins",
    "single_cabins",
    "twin_cabins",
    "pullman_berts",
    "showers",
    "heads",
    "electrics_heads",
  ]);
  for (const [key, value] of Object.entries(obj)) {
    if (shown.has(key)) continue;
    const text = cleanText(value);
    if (text === null) continue;
    if (/^(true|false|0|no)$/i.test(text)) continue;
    result.otherFields.push({ label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value: text });
  }

  const desc =
    cleanText(obj.description) ??
    cleanText(obj.details) ??
    cleanText(obj.text) ??
    cleanText(obj.accommodation);
  if (desc) result.description = desc;
  return result;
}

export type Amenity = { label: string; value: string };

// Amenities are assembled only from fields the detail record actually carries.
// No amenity is claimed from defaults.
export function parseAmenities(detail: Yacht): Amenity[] {
  const amenities: Amenity[] = [];
  const add = (label: string, value: unknown, positive?: string) => {
    if (typeof value === "boolean") {
      if (value && positive) amenities.push({ label, value: positive });
      return;
    }
    const text = cleanText(value);
    if (text === null) return;
    if (/^(false|no|0)$/i.test(text)) return;
    amenities.push({ label, value: /^(true|yes)$/i.test(text) ? (positive ?? "On board") : text });
  };

  add("Air conditioning", detail.air_conditioning, "On board");
  add("Overnight air conditioning", detail.fldAcAllNight, "Runs through the night");
  add("Watermaker", detail.water_make, "On board");
  const waterCap = num(detail.water_capacity);
  if (waterCap !== null && waterCap > 0) amenities.push({ label: "Water capacity", value: `${waterCap} L` });
  const fuel = num(detail.fuel_consumption);
  if (fuel !== null && fuel > 0) {
    const unit = str(detail.fuel_consumption_unit) ?? "L/h";
    amenities.push({ label: "Fuel consumption", value: `${fuel} ${unit}` });
  }
  add("Wi-Fi", detail.wifi, "On board");
  add("Starlink", detail.starlink, "On board");
  add("Generator", detail.generator, "On board");
  add("Inverter", detail.inverter, "On board");
  add("Ice maker", detail.ice_maker, "On board");
  add("Deck shower", detail.deck_shower, "On board");
  add("BBQ", detail.bbq, "On board");
  add("Children allowed", detail.ChildrenAllowed, "Families welcome");
  const children = detail.children_allowed ?? detail.kids_allowed;
  if (typeof children === "boolean") add("Children allowed", children, "Families welcome");
  return amenities;
}

export type WatersportsSummary = {
  /** Tender shown prominently (make/model/engine/horsepower when supplied). */
  tender: string | null;
  /** Recreational equipment, leading bullets removed, quantities preserved. */
  items: string[];
};

// Leading bullet/decoration characters: the card grid already shows an icon,
// so a leading "&bull;", "•", "-" or "*" carries no information. Only stripped
// when followed by content, and never touched mid-item.
const LEADING_BULLET = /^(?:\u2022|\u00b7|[-*]|\u25cf|\u25aa|\u2013|\u2014)\s+/;

function normalizeToyItem(text: string): string | null {
  // Drop bare category labels like "Toys:" or "Tender:" that carry no equipment.
  if (/^[a-z][a-z /]*:\s*$/i.test(text)) return null;
  let item = text.replace(LEADING_BULLET, "").replace(/\s{2,}/g, " ").trim();
  if (item.length === 0 || item.length > 80) return null;
  item = item.charAt(0).toUpperCase() + item.slice(1);
  return item;
}

// Watersports items from watersports/other_toys (arrays of strings/objects or
// HTML text). Only equipment this yacht actually carries is listed. A tender
// (dinghy) is separated out for prominent display; nothing is added or inferred.
export function parseWatersports(detail: Yacht): WatersportsSummary {
  const items: string[] = [];
  let tender: string | null = null;
  const seen = new Set<string>();
  const push = (value: unknown) => {
    const text = cleanText(value);
    if (text === null) return;
    for (const line of text.split(/\n|,(?=\s*[A-Z])/)) {
      const normalized = normalizeToyItem(line.trim());
      if (normalized === null) continue;
      const key = normalized.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      if (tender === null && /\b(tender|dinghy)\b/i.test(normalized)) {
        tender = normalized;
        continue;
      }
      items.push(normalized);
    }
  };

  const ws = detail.watersports;
  if (Array.isArray(ws)) {
    for (const item of ws) {
      if (typeof item === "string") push(item);
      else if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        push(obj.name ?? obj.title ?? obj.label ?? obj.item);
      }
    }
  } else {
    push(ws);
  }
  const toys = detail.other_toys;
  if (Array.isArray(toys)) {
    for (const item of toys) {
      if (typeof item === "string") push(item);
      else if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        push(obj.name ?? obj.title ?? obj.label ?? obj.item);
      }
    }
  } else if (detail.other_toys !== ws) {
    push(toys);
  }
  return { tender, items };
}

export type CrewMemberPaths = {
  collection: string;
  name: string | null;
  role: string | null;
  bio: string | null;
  photo: string | null;
  nationality: string | null;
  languages: string | null;
  qualifications: string | null;
  interests: string | null;
  culinaryBackground: string | null;
  position: string | null;
};

export type CrewMember = {
  sourceId: string;
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
  /** Exact CYA field paths each value was read from (e.g. "crew[0].crew_name"). */
  paths: CrewMemberPaths;
};

// Candidate field names CYA may use for crew. The OpenAPI `yachts_get` example
// carries no crew fields (its list is "a representative subset"), so these are
// resolved against the live response only — a candidate that matches is the
// mapping, one that never matches is reported by the crew diagnostic.
const CREW_COLLECTION_KEYS = [
  "crew",
  "crewDetails",
  "crew_members",
  "Crew",
  "CrewedMembers",
  "crewList",
  "yacht_crew",
  "crewed_members",
] as const;

// Verified live production names (crewDetails[].crewName / crewImage) sit
// first among their candidates; the remaining candidates cover CYA's other
// observed formats.
const NAME_KEYS = ["crew_name", "crewName", "name", "full_name", "fullname", "crewName2", "member_name"] as const;
const ROLE_KEYS = ["crew_position", "position", "crewRole", "role", "title", "job_title"] as const;
const BIO_KEYS = ["bio", "biography", "crew_bio", "crewBiography", "crewDescription", "about", "description", "comments", "text"] as const;
const PHOTO_KEYS = ["crew_image", "crewImage", "image", "photo", "photo_url", "image_src", "picture", "crew_photo", "image_url"] as const;
const NATIONALITY_KEYS = ["nationality", "crew_nationality", "crewNationality", "citizenship"] as const;
const LANGUAGE_KEYS = ["languages", "language", "languages_spoken", "crew_languages"] as const;
const QUALIFICATION_KEYS = ["qualifications", "qualification", "crewQualifications", "crewQualification", "crewLicenses", "crewLicences", "licenses", "licences", "certificates", "credentials"] as const;
const INTEREST_KEYS = ["interests", "crewInterests", "hobbies", "pastimes"] as const;
const CULINARY_KEYS = ["culinary_background", "culinary", "culinaryBackground", "chef_background", "cooking_style", "culinary_style", "food_style", "crewCulinaryBackground"] as const;
const POSITION_KEYS = ["position", "crew_position", "position_title", "crewPosition"] as const;

type FieldHit = { value: string; path: string };

function firstString(obj: Record<string, unknown>, keys: readonly string[]): FieldHit | null {
  for (const key of keys) {
    const text = cleanText(obj[key]);
    if (text !== null) return { value: text, path: key };
  }
  return null;
}

function firstPhoto(obj: Record<string, unknown>, keys: readonly string[]): FieldHit | null {
  for (const key of keys) {
    const text = str(obj[key]);
    if (text && /^https:\/\//.test(text)) return { value: text, path: key };
  }
  return null;
}

export type CrewParseTrace = {
  members: CrewMember[];
  /** Top-level crew collections the parser matched and read. */
  matchedCollectionKeys: string[];
  /** Every top-level key whose name looks crew-related, matched or not. */
  crewShapedTopLevelKeys: Array<{ key: string; type: string }>;
  /** Raw entries the parser read, for the raw-vs-delivered comparison. */
  rawEntries: Array<{ collection: string; index: number; entry: Record<string, unknown> }>;
};

// Resolves crew from the yacht detail record, recording exactly which field
// paths were used. Accepts an array, a single object, or JSON-encoded text.
// Every member keeps its original biography verbatim.
export function parseCrewWithTrace(detail: Yacht): CrewParseTrace {
  const members: CrewMember[] = [];
  const matchedCollectionKeys: string[] = [];
  const rawEntries: CrewParseTrace["rawEntries"] = [];
  const crewShapedTopLevelKeys = Object.entries(detail)
    .filter(([key]) => /crew|captain|chef|steward|deckhand/i.test(key))
    .map(([key, value]) => ({
      key,
      type: Array.isArray(value) ? "array" : value === null ? "null" : typeof value,
    }));

  for (const key of CREW_COLLECTION_KEYS) {
    const raw = detail[key];
    if (raw === undefined || raw === null) continue;
    const entries: Array<{ entry: Record<string, unknown>; index: number }> = [];
    if (Array.isArray(raw)) {
      raw.forEach((item, index) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          entries.push({ entry: item as Record<string, unknown>, index });
        }
      });
    } else if (raw && typeof raw === "object") {
      entries.push({ entry: raw as Record<string, unknown>, index: 0 });
    } else if (typeof raw === "string" && raw.trim().startsWith("[")) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item, index) => {
            if (item && typeof item === "object" && !Array.isArray(item)) {
              entries.push({ entry: item as Record<string, unknown>, index });
            }
          });
        }
      } catch {
        // Non-JSON text: surfaced by the diagnostic, never guessed at.
      }
    }
    if (entries.length === 0) continue;
    matchedCollectionKeys.push(key);

    for (const { entry, index } of entries) {
      const name = firstString(entry, NAME_KEYS);
      if (name === null) continue;
      const prefix = `${key}[${index}]`;
      const role = firstString(entry, ROLE_KEYS);
      const bio = firstString(entry, BIO_KEYS);
      const photo = firstPhoto(entry, PHOTO_KEYS);
      const nationality = firstString(entry, NATIONALITY_KEYS);
      const languages = firstString(entry, LANGUAGE_KEYS);
      const qualifications = firstString(entry, QUALIFICATION_KEYS);
      const interests = firstString(entry, INTEREST_KEYS);
      const culinary = firstString(entry, CULINARY_KEYS);
      const position = firstString(entry, POSITION_KEYS);
      members.push({
        sourceId: str(entry._id) ?? str(entry.id) ?? `${key}:${members.length}`,
        name: name.value,
        role: role?.value ?? "Crew member",
        bio: bio?.value ?? null,
        photoUrl: photo?.value ?? null,
        nationality: nationality?.value ?? null,
        languages: languages?.value ?? null,
        qualifications: qualifications?.value ?? null,
        interests: interests?.value ?? null,
        culinaryBackground: culinary?.value ?? null,
        position: position?.value ?? null,
        paths: {
          collection: key,
          name: `${prefix}.${name.path}`,
          role: role ? `${prefix}.${role.path}` : null,
          bio: bio ? `${prefix}.${bio.path}` : null,
          photo: photo ? `${prefix}.${photo.path}` : null,
          nationality: nationality ? `${prefix}.${nationality.path}` : null,
          languages: languages ? `${prefix}.${languages.path}` : null,
          qualifications: qualifications ? `${prefix}.${qualifications.path}` : null,
          interests: interests ? `${prefix}.${interests.path}` : null,
          culinaryBackground: culinary ? `${prefix}.${culinary.path}` : null,
          position: position ? `${prefix}.${position.path}` : null,
        },
      });
      rawEntries.push({ collection: key, index, entry });
    }
  }
  return { members, matchedCollectionKeys, crewShapedTopLevelKeys, rawEntries };
}

export function parseCrew(detail: Yacht): CrewMember[] {
  return parseCrewWithTrace(detail).members;
}

// Raw crew-entry keys the parser never reads — the crew diagnostic reports
// these as data CYA supplies that the website would omit.
export function unusedCrewEntryKeys(entry: Record<string, unknown>): string[] {
  const consumed = new Set<string>([
    ...NAME_KEYS,
    ...ROLE_KEYS,
    ...BIO_KEYS,
    ...PHOTO_KEYS,
    ...NATIONALITY_KEYS,
    ...LANGUAGE_KEYS,
    ...QUALIFICATION_KEYS,
    ...INTEREST_KEYS,
    ...CULINARY_KEYS,
    ...POSITION_KEYS,
    "_id",
    "id",
  ]);
  return Object.keys(entry).filter((k) => !consumed.has(k));
}

// HTML sanitizing for CYA's general crew description. Only a small tag
// allowlist survives; every attribute is stripped, so no link, style or event
// handler can reach the page. Entities stay inert as text.
const CREW_HTML_ALLOWED_TAGS = new Set(["p", "br", "b", "strong", "i", "em", "ul", "ol", "li"]);

export function sanitizeCrewHtml(value: unknown): string | null {
  const text = str(value);
  if (text === null) return null;
  const out = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (_match, slash: string, tag: string) => {
      const lower = tag.toLowerCase();
      if (!CREW_HTML_ALLOWED_TAGS.has(lower)) return "";
      if (lower === "br") return "<br/>";
      return `<${slash}${lower}>`;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return out.length > 0 ? out : null;
}

export type CrewGeneral = {
  photoUrl: string | null;
  /** Allowlist-sanitized HTML (p, br, b, strong, i, em, ul, ol, li only). */
  descriptionHtml: string | null;
  descriptionText: string | null;
  paths: { photo: string | null; description: string | null };
};

// General crew information: CYA supplies crewGeneral.crewImage and
// crewGeneral.crewDescription (HTML). Rendered as introductory content above
// the individual profiles — never duplicated as a member.
export function parseCrewGeneral(detail: Yacht): CrewGeneral | null {
  const raw = detail.crewGeneral;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const photo = firstPhoto(obj, ["crewImage", "image", "photo", "photo_url", "image_src"]);
  const usedDescKey = obj.crewDescription !== undefined ? "crewDescription" : obj.description !== undefined ? "description" : "about";
  const descRaw = obj[usedDescKey];
  const descriptionHtml = sanitizeCrewHtml(descRaw);
  const descriptionText = cleanText(descRaw);
  if (!photo && !descriptionHtml && !descriptionText) return null;
  return {
    photoUrl: photo?.value ?? null,
    descriptionHtml,
    descriptionText,
    paths: {
      photo: photo ? `crewGeneral.${photo.path}` : null,
      description: descRaw !== undefined && descRaw !== null ? `crewGeneral.${usedDescKey}` : null,
    },
  };
}
