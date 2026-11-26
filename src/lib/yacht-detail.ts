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

// HTML entity decoding: repeated passes collapse CYA's double-encoded values
// ("&amp;rsquo;" -> "&rsquo;" -> "'"). Passes stop as soon as the text is
// stable, so singly-encoded content decodes exactly once. Unknown named
// references are left as-is; invalid numeric ones are dropped.
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
  let text = str(value);
  if (text === null) return null;
  for (let pass = 0; pass < 3; pass++) {
    const decoded = decodeHtmlEntities(text);
    if (decoded === text) break;
    text = decoded;
  }
  const cleaned = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

// CYA can attach the yacht's brochure copy to the main photo. Only use
// that specific image as a fallback, since the remaining images carry captions.
export function parseYachtOverview(detail: Yacht) {
  const mainImage = str(detail.main_image);
  const photos = Array.isArray(detail.Images) ? detail.Images : [];
  const brochurePhoto = photos.find((photo) => photo && typeof photo === "object" && mainImage && str(photo.image_src) === mainImage);
  const description = cleanText(detail.description);
  const galleryDescription = cleanText(brochurePhoto?.description);
  const source = description ?? (galleryDescription && galleryDescription.length >= 100 ? galleryDescription : null);
  const firstParagraph = source?.split(/\n\s*\n/, 1)[0] ?? null;
  const introduction = firstParagraph && firstParagraph.length <= 650 ? firstParagraph : null;
  return {
    introduction,
    more: source !== introduction ? source : null,
    fromBrochurePhoto: !description && source !== null,
  };
}

export type SeasonRate = {
  title: string;
  category: string | null;
  dates: string | null;
  startDate: string | null;
  endDate: string | null;
  price: string | null;
  currency: string | null;
  guestRates: Array<{ guests: number; amount: number }>;
  apa: number | null;
  turnaroundHours: number | null;
  additionalRateDetails: string | null;
  area: string | null;
  areas: string[];
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
  return currency ? `${currency} ${rounded}` : rounded;
}

function readSeasonNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(str(value) ?? NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

// Detail rates carry guest totals and charter rules on each season.
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
    const guestRates = new Map<number, number>();
    if (Array.isArray(obj.prices)) {
      for (const row of obj.prices) {
        if (!row || typeof row !== "object") continue;
        const guests = readSeasonNumber(row.paxes);
        const amount = readSeasonNumber(row.price);
        if (guests !== null && Number.isSafeInteger(guests) && guests > 0 && amount !== null && amount > 0 && !guestRates.has(guests)) {
          guestRates.set(guests, amount);
        }
      }
    }
    const apa = readSeasonNumber(obj.apa);
    const turnaroundHours = readSeasonNumber(obj.turnaround_hours);
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
      : [];
    rows.push({
      title,
      category: str(obj.season_category),
      dates: start || end ? [start, end].filter(Boolean).join(" \u2013 ") : null,
      startDate: start,
      endDate: end,
      price: rawPrice !== null ? `${formatMoney(rawPrice, currency)} / week` : null,
      currency,
      guestRates: [...guestRates].sort(([a], [b]) => a - b).map(([guests, amount]) => ({ guests, amount })),
      apa: obj.has_apa !== false && apa !== null && apa > 0 ? apa : null,
      turnaroundHours: turnaroundHours !== null && turnaroundHours > 0 ? turnaroundHours : null,
      additionalRateDetails: cleanText(obj.additional_rate_details),
      area: areaNames.slice(0, 4).join(", ") || null,
      areas: areaNames,
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

export function guestAgeRestriction(accommodation: AccommodationSummary) {
  const notes = [accommodation.description, ...accommodation.otherFields.map(({ value }) => value)].join(" ");
  const match = notes.match(/\bfor (\d+) (?:and|&) (\d+) (?:pax|guests),? guests must be under (?:the age of )?(\d+)[^.!?]*\bprior approval\b/i);
  if (!match) return null;
  const [, first, last, age] = match.map(Number);
  if (first < 2 || last !== first + 1 || last !== accommodation.pax || age < 1 || age > 17) return null;
  return { adults: first - 1, maximum: last, age };
}

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
  const unit = str(detail.fuel_consumption_unit);
  if (fuel !== null && fuel > 0 && unit && /[a-z]/i.test(unit)) {
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
const ROLE_KEYS = ["crew_position", "position", "crewRole", "role", "title", "job_title", "crewPosition"] as const;
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
// Sanitize CYA rich-text HTML for display. CYA sometimes double-encodes its
// markup (the whole string arrives as &lt;pre&gt;...&lt;br/&gt; text), so
// entity decoding runs FIRST and is repeated while fully-encoded tags keep
// appearing. Everything then passes a strict tag allowlist that rebuilds each
// tag bare — style/class/on* attributes can never survive — and scripts,
// styles and comments are dropped outright. Shared by crew and menu content.
const CREW_HTML_ALLOWED_TAGS = new Set(["p", "br", "b", "strong", "i", "em", "ul", "ol", "li"]);

export function sanitizeCrewHtml(value: unknown): string | null {
  let text = str(value);
  if (text === null) return null;
  // Un-wrap repeatedly: "&lt;pre&gt;" becomes "<pre>", which the next pass
  // recognizes as a tag. Bounded so hostile input cannot loop forever.
  for (let pass = 0; pass < 3; pass++) {
    const decoded = decodeHtmlEntities(text);
    if (decoded === text) break;
    text = decoded;
  }
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

export type YachtReview = { title: string | null; comment: string };

export function parseYachtReviews(detail: Yacht): YachtReview[] {
  if (!Array.isArray(detail.reviews)) return [];
  return detail.reviews.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const comment = cleanText(sanitizeCrewHtml(item.description));
    return comment ? [{ title: str(item.title), comment }] : [];
  });
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

// --- Menus & food photography (menuDetails / menuGeneral) -------------------

export type MenuPhoto = { url: string; description: string | null; path: string };

export type MenuCategory = {
  title: string;
  /** Allowlist-sanitized HTML when CYA supplies markup. */
  bodyHtml: string | null;
  bodyText: string | null;
  photo: MenuPhoto | null;
  path: string;
};

export type MenuSection = { title: string; bodyText: string };

export type MenuSummary = {
  /** Written-menu records from menuDetails. Photo-only records are excluded. */
  categories: MenuCategory[];
  photos: MenuPhoto[];
  general: {
    photo: MenuPhoto | null;
    /** Full decoded general description (diagnostics). */
    descriptionHtml: string | null;
    descriptionText: string | null;
    /** Genuine introductory lines preceding the first menu heading. */
    introText: string | null;
    /** Written menu sections detected inside the general description. */
    sections: MenuSection[];
    /** Chef name explicitly attributed inside the CYA menu content, if any. */
    chefName: string | null;
  } | null;
};

// Chef attribution written into the menu content itself (e.g. "Handcrafted by
// Chef Heather Arndt"). Requires the literal word "Chef" followed by 1–3
// capitalised name words on the same line; all-caps words (menu headings such
// as "MENUS TAILORED...") are never treated as name words. Nothing is guessed
// beyond that pattern.
function extractChefAttribution(text: string): string | null {
  const nameWord = "[A-Z][\\p{L}'’.\\-]*[\\p{Ll}][\\p{L}'’.\\-]*";
  const match = text.match(new RegExp(`\\bChef[ \\t]+(${nameWord}(?:[ \\t]+${nameWord}){0,2})`, "u"));
  return match ? match[1].trim() : null;
}

// Course vocabulary used only to LOCATE section boundaries inside a free-text
// menu description. The heading text itself is always rendered exactly as CYA
// supplied it — nothing is hardcoded for a specific yacht.
const MENU_SECTION_WORD_PATTERN =
  /(BREAKFAST|BRUNCH|LUNCH|DINNER|SUPPER|CANAP[ÉE]S|STARTERS|APPETIZERS|MAIN COURSES|MAINS|ENTR[ÉE]ES|SOUPS|SALADS|SANDWICHES|DESSERTS|P[ÂA]TISSERIE|BAKING|BREADS|VEGETARIAN|PLANT.BASED|SWEET TREATS|CHEESE BOARD|SNACKS|SIDES|KIDS)/;

// A section heading is a standalone ALL-CAPS line containing a course word.
// Title-Case subheadings ("Pork", "Freshly Baked Pastries") contain lowercase
// letters and stay inside their section body.
function isMenuSectionHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 60) return false;
  if (/[a-z\u00e0-\u00ff]/.test(trimmed)) return false;
  return MENU_SECTION_WORD_PATTERN.test(trimmed);
}

// Splits a general menu description into its genuine intro (everything before
// the first recognised heading) and collapsed-menu sections. When no heading
// can be reliably detected the whole text becomes ONE section so the complete
// menu stays collapsed inside a single accordion and no intro is fabricated.
function splitMenuDescription(text: string): { introText: string | null; sections: MenuSection[] } {
  const lines = text.split("\n");
  const introLines: string[] = [];
  const sections: MenuSection[] = [];
  let current: { title: string; body: string[] } | null = null;
  for (const line of lines) {
    if (isMenuSectionHeading(line)) {
      if (current && current.body.some((l) => l.trim().length > 0)) {
        sections.push({ title: current.title, bodyText: current.body.join("\n").trim() });
      }
      current = { title: line.trim(), body: [] };
      continue;
    }
    if (current) current.body.push(line);
    else introLines.push(line);
  }
  if (current && current.body.some((l) => l.trim().length > 0)) {
    sections.push({ title: current.title, bodyText: current.body.join("\n").trim() });
  }
  if (sections.length === 0) {
    return { introText: null, sections: [{ title: "Sample Menu", bodyText: text.trim() }] };
  }
  const introText = introLines.join("\n").replace(/\n{2,}/g, "\n\n").trim();
  return { introText: introText.length > 0 ? introText : null, sections };
}

const MENU_TITLE_KEYS = ["menuTitle", "title", "meal", "meal_type", "course", "category", "menu_title", "name", "menu_category", "type"];
const MENU_CATEGORY_KEYS = ["menuCategory", "menu_category", "category", "meal", "meal_type", "course", "type"];
const MENU_BODY_KEYS = ["menuDescription", "menu_description", "description", "menu", "items", "details", "body", "text", "content", "menu_items", "dishes"];
const MENU_PHOTO_KEYS = ["menuImage", "menu_image", "image", "image_src", "photo", "photo_url", "menu_image2", "image_url", "picture", "photo_src", "src"];
const MENU_PHOTO_COLLECTION_KEYS = ["Images", "images", "photos", "menu_images", "gallery", "Photos"];
const MENU_DESC_KEYS = ["description", "caption", "alt", "title", "name"];

// CYA's form placeholder for an unset category — not a real menu category.
const MENU_PLACEHOLDER_TITLES = new Set(["select category", "select", "n/a", "none"]);

// Accepts every URL shape CYA has been observed to emit: https, http and
// protocol-relative strings. http and protocol-relative are upgraded to https
// because browsers block mixed-content images on an https page — the host is
// the same, only the scheme changes.
function photoUrlFromValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^http:\/\//i.test(trimmed)) return `https://${trimmed.slice(7)}`;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  return null;
}

function menuPhotoDescription(obj: Record<string, unknown>): string | null {
  for (const dKey of MENU_DESC_KEYS) {
    const text = cleanText(obj[dKey]);
    if (text !== null) return text;
  }
  return null;
}

// Gathers every photograph under an entry's image-shaped fields. Handles plain
// URL strings, arrays of URLs or of {image_src,...} objects, and nested photo
// objects — previously a non-string menuImage was silently discarded.
function menuPhotosFrom(obj: Record<string, unknown>, prefix: string): MenuPhoto[] {
  const out: MenuPhoto[] = [];
  for (const key of MENU_PHOTO_KEYS) {
    const value = obj[key];
    if (value === undefined || value === null) continue;
    const url = photoUrlFromValue(value);
    if (url) {
      out.push({ url, description: menuPhotoDescription(obj), path: `${prefix}.${key}` });
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "string") {
            const itemUrl = photoUrlFromValue(item);
            if (itemUrl) out.push({ url: itemUrl, description: null, path: `${prefix}.${key}[${index}]` });
        } else if (item && typeof item === "object" && !Array.isArray(item)) {
          out.push(...menuPhotosFrom(item as Record<string, unknown>, `${prefix}.${key}[${index}]`));
        }
      });
      continue;
    }
    if (typeof value === "object") {
      out.push(...menuPhotosFrom(value as Record<string, unknown>, `${prefix}.${key}`));
    }
  }
  return out;
}

// Resolves the yacht's sample menus and food photography. Accepts arrays,
// single objects or JSON-encoded text for menuDetails. Nothing is invented:
// a category needs a body or a photo to render; empty labels are dropped.
export function parseMenus(detail: Yacht): MenuSummary {
  const categories: MenuCategory[] = [];
  const photos: MenuPhoto[] = [];
  const seenPhotos = new Set<string>();
  const addPhoto = (...incoming: MenuPhoto[]) => {
    for (const photo of incoming) {
      if (photo && !seenPhotos.has(photo.url)) {
        seenPhotos.add(photo.url);
        photos.push(photo);
      }
    }
  };
  const collectPhotoCollection = (obj: Record<string, unknown>, prefix: string) => {
    for (const key of MENU_PHOTO_COLLECTION_KEYS) {
      const value = obj[key];
      if (!Array.isArray(value)) continue;
      value.forEach((item, index) => {
        if (typeof item === "string" && /^https:\/\//.test(item)) {
          addPhoto({ url: item, description: null, path: `${prefix}.${key}[${index}]` });
        } else if (item && typeof item === "object" && !Array.isArray(item)) {
          addPhoto(...menuPhotosFrom(item as Record<string, unknown>, `${prefix}.${key}[${index}]`));
        }
      });
    }
  };

  const readCategory = (obj: Record<string, unknown>, prefix: string): MenuCategory | null => {
    let title: string | null = null;
    for (const key of MENU_TITLE_KEYS) {
      const text = cleanText(obj[key]);
      if (text !== null) {
        title = text;
        break;
      }
    }
    // CYA's form emits "Select Category" when no category was chosen — a
    // placeholder, not a menu course. Prefer menuCategory when it holds a
    // real value, and drop placeholder titles entirely.
    if (title !== null && MENU_PLACEHOLDER_TITLES.has(title.toLowerCase())) title = null;
    if (title === null) {
      for (const key of MENU_CATEGORY_KEYS) {
        const text = cleanText(obj[key]);
        if (text !== null && !MENU_PLACEHOLDER_TITLES.has(text.toLowerCase())) {
          title = text;
          break;
        }
      }
    }
    let bodyRaw: unknown;
    let bodyKey: string | null = null;
    for (const key of MENU_BODY_KEYS) {
      if (obj[key] !== undefined && obj[key] !== null) {
        bodyRaw = obj[key];
        bodyKey = key;
        break;
      }
    }
    const entryPhotos = menuPhotosFrom(obj, prefix);
    for (const p of entryPhotos) addPhoto(p);
    const photo = entryPhotos[0] ?? null;
    collectPhotoCollection(obj, prefix);
    const bodyHtml = sanitizeCrewHtml(bodyRaw);
    const bodyText = cleanText(bodyRaw);
    // A written-menu accordion needs genuine written content. Photo-only CYA
    // records feed the gallery (above) and never become accordion panels.
    const hasBody =
      bodyText !== null || (bodyHtml !== null && cleanText(bodyHtml) !== null);
    if (!hasBody) return null;
    return {
      title: title ?? "Sample Menu",
      bodyHtml,
      bodyText,
      photo,
      path: bodyKey ? `${prefix}.${bodyKey}` : prefix,
    };
  };

  const md = detail.menuDetails;
  if (Array.isArray(md)) {
    md.forEach((entry, index) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
      const category = readCategory(entry as Record<string, unknown>, `menuDetails[${index}]`);
      if (category) categories.push(category);
    });
  } else if (md && typeof md === "object") {
    const category = readCategory(md as Record<string, unknown>, "menuDetails");
    if (category) categories.push(category);
  } else if (md !== undefined && md !== null) {
    const category = readCategory({ menu: md }, "menuDetails");
    if (category) categories.push(category);
  }

  let general: MenuSummary["general"] = null;
  const mg = detail.menuGeneral;
  if (mg && typeof mg === "object" && !Array.isArray(mg)) {
    const obj = mg as Record<string, unknown>;
    const generalPhotos = menuPhotosFrom(obj, "menuGeneral");
    for (const p of generalPhotos) addPhoto(p);
    const photo = generalPhotos[0] ?? null;
    collectPhotoCollection(obj, "menuGeneral");
    const descriptionHtml = sanitizeCrewHtml(obj.menuDescription ?? obj.description ?? obj.about ?? obj.menu_description ?? obj.text);
    const descriptionText = cleanText(obj.menuDescription ?? obj.description ?? obj.about ?? obj.menu_description ?? obj.text);
    if (photo || descriptionHtml || descriptionText) {
      const split = descriptionText ? splitMenuDescription(descriptionText) : { introText: null, sections: [] };
      const chefName = split.introText ? extractChefAttribution(split.introText) : null;
      general = { photo, descriptionHtml, descriptionText, introText: split.introText, sections: split.sections, chefName };
    }
  }

  return { categories, photos, general };
}

// --- Raw menu image references (health monitoring) ---------------------------

export type RawMenuImageRef = {
  path: string;
  kind: "https-url" | "http-url" | "protocol-relative-url" | "non-url-string" | "array" | "object";
  /** The URL exactly as CYA supplied it, when the value is URL-shaped. */
  url: string | null;
  /** The https URL the parser derives from this value, when URL-shaped. */
  normalizedUrl: string | null;
  /** Why this value can never become a photograph, when applicable. */
  rejectionReason: string | null;
  /** Outcome in the delivered photo list: delivered, duplicate of an earlier
   *  reference (deduplicated by URL), or not delivered. */
  outcome: "delivered" | "duplicate" | "not-delivered";
  /** Path of the earlier reference this duplicates, when outcome=duplicate. */
  duplicateOf: string | null;
};

const MENU_IMAGE_FIELD_PATTERN = /^(menu_?images?|images?|image_?src|image_?url|photos?|photo_?url|photo_?src|pictures?|src)$/i;

// Reports every image-shaped field CYA supplies in the menu records, with the
// value's shape and how the parser treated it — delivered, a duplicate caught
// by deduplication, or not delivered with the reason — so nothing is silently
// discarded without a stated cause.
export function collectRawMenuImageRefs(detail: Yacht): RawMenuImageRef[] {
  const refs: RawMenuImageRef[] = [];
  const firstRefForUrl = new Map<string, string>();
  const settle = (ref: Omit<RawMenuImageRef, "outcome" | "duplicateOf">): RawMenuImageRef => {
    if (ref.normalizedUrl !== null) {
      const existing = firstRefForUrl.get(ref.normalizedUrl);
      if (existing !== undefined && existing !== ref.path) {
        return { ...ref, outcome: "duplicate", duplicateOf: existing };
      }
      firstRefForUrl.set(ref.normalizedUrl, ref.path);
    }
    return { ...ref, outcome: "not-delivered", duplicateOf: null };
  };
  const classifyString = (path: string, value: string): RawMenuImageRef =>
    settle(
      (() => {
        const trimmed = value.trim();
        if (/^https:\/\//i.test(trimmed)) return { path, kind: "https-url" as const, url: trimmed, normalizedUrl: trimmed, rejectionReason: null };
        if (/^http:\/\//i.test(trimmed)) return { path, kind: "http-url" as const, url: trimmed, normalizedUrl: `https://${trimmed.slice(7)}`, rejectionReason: null };
        if (/^\/\//.test(trimmed)) return { path, kind: "protocol-relative-url" as const, url: trimmed, normalizedUrl: `https:${trimmed}`, rejectionReason: null };
        return { path, kind: "non-url-string" as const, url: null, normalizedUrl: null, rejectionReason: "Value is not a web address (no http/https/protocol-relative prefix)." };
      })()
    );
  const scan = (obj: Record<string, unknown>, prefix: string) => {
    for (const [key, value] of Object.entries(obj)) {
      if (!MENU_IMAGE_FIELD_PATTERN.test(key)) continue;
      const path = `${prefix}.${key}`;
      if (typeof value === "string") {
        if (value.trim().length > 0) refs.push(classifyString(path, value));
      } else if (Array.isArray(value)) {
        refs.push({ path, kind: "array", url: null, normalizedUrl: null, rejectionReason: null, outcome: "not-delivered", duplicateOf: null });
        value.forEach((item, index) => {
          if (typeof item === "string" && item.trim().length > 0) {
            refs.push(classifyString(`${path}[${index}]`, item));
          } else if (item && typeof item === "object" && !Array.isArray(item)) {
            scan(item as Record<string, unknown>, `${path}[${index}]`);
          }
        });
      } else if (value && typeof value === "object") {
        scan(value as Record<string, unknown>, path);
      }
    }
  };
  const md = detail.menuDetails;
  if (Array.isArray(md)) {
    md.forEach((entry, index) => {
      if (entry && typeof entry === "object" && !Array.isArray(entry)) scan(entry as Record<string, unknown>, `menuDetails[${index}]`);
    });
  } else if (md && typeof md === "object") {
    scan(md as Record<string, unknown>, "menuDetails");
  }
  const mg = detail.menuGeneral;
  if (mg && typeof mg === "object" && !Array.isArray(mg)) scan(mg as Record<string, unknown>, "menuGeneral");
  // Mark references whose normalized URL actually made it into the parsed
  // menus as delivered, so the report reflects the real parser outcome.
  const delivered = new Set(parseMenus(detail).photos.map((p) => p.url));
  return refs.map((ref) =>
    ref.normalizedUrl !== null && delivered.has(ref.normalizedUrl)
      ? { ...ref, outcome: "delivered" as const, duplicateOf: null }
      : ref
  );
}
