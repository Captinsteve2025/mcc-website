import { formatPrice } from "@/lib/data";

export interface ManagedYacht {
  slug: string;
  name: string;
  builder: string;
  model: string;
  year: number;
  vesselType: string;
  charterType: string;
  charterArea: string;
  ratesVerified: boolean;
  standardWeeklyRateUsd: number;
  holidayWeeklyRateUsd: number;
  minimumNights: number;
  heroImage: string;
  heroImageAlt: string;
  shareImage: string;
}

export const atlas: ManagedYacht = {
  slug: "atlas",
  name: "ATLAS",
  builder: "Aquila",
  model: "Aquila 54",
  year: 2024,
  vesselType: "Power catamaran",
  charterType: "Private crewed charter",
  charterArea: "USVI & BVI",
  // Set to true only after the charter rate sheet is verified. While false, no prices are shown.
  ratesVerified: false,
  standardWeeklyRateUsd: 43000,
  holidayWeeklyRateUsd: 50000,
  minimumNights: 5,
  // Placeholder: generic Caribbean water. Replace with an ATLAS-specific photograph.
  heroImage: "/images/caribbean-water-bg.webp",
  heroImageAlt: "ATLAS, Aquila 54 luxury power catamaran",
  shareImage: "/images/caribbean-water-bg.webp",
};

export function formatYachtRate(yacht: ManagedYacht): string {
  if (!yacht.ratesVerified) return "Charter rates on request";
  return `From ${formatPrice(yacht.standardWeeklyRateUsd)} per week`;
}

export const atlasKnownSpecs: { label: string; value: string }[] = [
  { label: "Name", value: atlas.name },
  { label: "Builder", value: atlas.builder },
  { label: "Model", value: atlas.model },
  { label: "Year", value: String(atlas.year) },
  { label: "Type", value: atlas.vesselType },
  { label: "Charter type", value: "Crewed" },
  { label: "Cruising region", value: "Virgin Islands" },
];

export const atlasDestinations: { name: string; description: string }[] = [
  {
    name: "St Thomas",
    description: "Beautiful coastline, lively island culture and convenient access to the US Virgin Islands.",
  },
  {
    name: "St John",
    description: "Spectacular beaches, protected waters and memorable snorkeling opportunities.",
  },
  {
    name: "Virgin Gorda",
    description: "Dramatic natural scenery, secluded bays and beautiful island destinations.",
  },
  {
    name: "Jost Van Dyke",
    description: "Relaxed Caribbean atmosphere and famous waterfront experiences.",
  },
];

export const atlasFaqs: { question: string; answer: string }[] = [
  {
    question: "Is ATLAS a private yacht charter?",
    answer: "Yes. ATLAS is offered as a private crewed yacht charter, providing your group with a personalized Caribbean experience.",
  },
  {
    question: "What type of yacht is ATLAS?",
    answer: "ATLAS is an Aquila 54 luxury power catamaran.",
  },
  {
    question: "Where can we cruise aboard ATLAS?",
    answer: "Charters may include the US Virgin Islands and British Virgin Islands, subject to operating permissions, departure location and applicable clearance requirements.",
  },
  {
    question: "Can we customize our itinerary?",
    answer: "Yes. Your charter specialist and captain can help plan an itinerary around your interests, subject to weather and operational requirements.",
  },
  {
    question: "How many guests can ATLAS accommodate?",
    answer: "Our charter team will confirm the approved guest capacity and accommodation arrangements for your dates.",
  },
  {
    question: "What is included in the charter rate?",
    answer: "Your personalized quotation will explain the applicable inclusions, exclusions and charter terms.",
  },
  {
    question: "How do we book ATLAS?",
    answer: "Complete the enquiry form. An MCC charter specialist will confirm availability, provide a quotation and explain the booking and deposit process.",
  },
];

export const MCC_PHONE_DISPLAY = "+1 (786) 520-1558";
export const MCC_PHONE_HREF = "tel:+1-786-520-1558";
export const MCC_SITE_URL = "https://www.mycaribbeancharters.com";
