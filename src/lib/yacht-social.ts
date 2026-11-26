import type { Metadata } from "next";
import { yachtSeasonAreaNames, type Yacht } from "@/lib/cya";
import { cleanText, guestAgeRestriction, lengthWithUnit, parseAccommodation, parseSeasons, str } from "@/lib/yacht-detail";

export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;
export const CYA_YACHT_ID = /^[a-f0-9]{8,32}$/i;

const siteOrigin = process.env.MCC_PUBLIC_SITE_URL || "https://mcc-website-one.vercel.app";
const siteName = "My Caribbean Charters";
const countWords = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function yachtName(value: unknown) {
  const name = cleanText(value)?.replace(/\s+/g, " ") ?? "Charter Yacht";
  if (!name.includes(" ") || name !== name.toUpperCase()) return name;
  return name.split(" ").map((word, index) => {
    if (/^[IVX]{2,5}$/.test(word)) return word;
    if (index > 0 && /^(AND|OF|THE)$/.test(word)) return word.toLowerCase();
    return word[0] + word.slice(1).toLowerCase();
  }).join(" ");
}

function cruisingArea(yacht: Yacht) {
  const areas = [...parseSeasons(yacht).map(({ area }) => area), ...yachtSeasonAreaNames(yacht)].join(", ");
  if (/\bBVI\b|British Virgin Islands/i.test(areas)) {
    return { title: "BVI Yacht Charter", lead: "Explore the British Virgin Islands aboard" };
  }
  if (/\bUSVI\b|U\.?S\.? Virgin Islands|Virgin Islands \(US\)/i.test(areas)) {
    return { title: "USVI Yacht Charter", lead: "Explore the U.S. Virgin Islands aboard" };
  }
  return { title: "Yacht Charter", lead: "Charter" };
}

export function buildYachtSocialMetadata(
  title: string,
  description: string,
  listingPath: string,
  imageId: string,
  imageAlt: string,
): Metadata {
  const url = new URL(listingPath, siteOrigin).href;
  const image = {
    url: new URL(`/api/yacht-social-image/${encodeURIComponent(imageId)}`, siteOrigin).href,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    type: "image/jpeg",
    alt: imageAlt,
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName, locale: "en_US", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function cyaYachtSocialMetadata(id: string, yacht: Yacht): Metadata {
  const name = yachtName(yacht.yachtName);
  const area = cruisingArea(yacht);
  const length = lengthWithUnit(yacht);
  const unit = str(yacht.units) ?? str(yacht.lenght_unit) ?? str(yacht.length_unit);
  const lengthUnit = /^(ft|foot|feet|')$/i.test(unit ?? "") ? "foot"
    : /^(m|metres?|meters?)$/i.test(unit ?? "") ? "metre" : null;
  const size = length && length.value > 0 && lengthUnit ? `${length.value}-${lengthUnit}` : null;
  const builder = cleanText(yacht.builder_name);
  const type = cleanText(yacht.yachtType)?.toLowerCase() ?? "yacht";
  const vessel = [size, builder, type].filter(Boolean).join(" ");
  const accommodation = parseAccommodation(yacht);
  const { cabins, pax } = accommodation;
  const cabinCount = cabins && cabins > 0 ? countWords[cabins] || String(cabins) : null;
  const notes = [accommodation.description, ...accommodation.otherFields.map(({ value }) => value)].join(" ");
  const ensuite = cabinCount && new RegExp(
    `\\b(?:${cabins}|${cabinCount}) (?:[\\w-]+,? ){0,3}en[ -]?suite cabins?\\b`, "i",
  ).test(notes);
  const cabinSummary = cabinCount ? ` with ${cabinCount}${ensuite ? " ensuite" : ""} cabin${cabins === 1 ? "" : "s"}` : "";
  const ageRestriction = guestAgeRestriction(accommodation);
  const guestCount = ageRestriction?.adults ?? pax;
  const guestSummary = guestCount && guestCount > 0
    ? ` for up to ${guestCount} ${ageRestriction ? "adults" : guestCount === 1 ? "guest" : "guests"}` : "";
  const article = /^[aeiou]/i.test(vessel) || /^(8\d|11|18)-/.test(vessel) ? "an" : "a";
  const lead = area.lead === "Charter" ? `Charter ${name}, ` : `${area.lead} `;
  const description = `${lead}${article} ${vessel}${cabinSummary}${guestSummary}.`;

  return buildYachtSocialMetadata(
    `${name} | ${area.title}`, description, `/charter-yachts/${id}`, id, `${name} charter preview`,
  );
}
