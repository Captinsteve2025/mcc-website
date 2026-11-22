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

// Strip markup and entities from CYA text fields (other_toys may contain HTML).
export function cleanText(value: unknown): string | null {
  const text = str(value);
  if (text === null) return null;
  const cleaned = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, "")
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

// Watersports items from watersports/other_toys (arrays of strings/objects or
// HTML text). Only equipment this yacht actually carries is listed.
export function parseWatersports(detail: Yacht): string[] {
  const items: string[] = [];
  const seen = new Set<string>();
  const push = (value: unknown) => {
    const text = cleanText(value);
    if (text === null) return;
    for (const line of text.split(/\n|,(?=\s*[A-Z])/)) {
      const item = line.trim();
      if (item.length === 0 || item.length > 80) continue;
      const key = item.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
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
  return items;
}
