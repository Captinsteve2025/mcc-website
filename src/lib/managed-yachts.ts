export interface ManagedYacht {
  slug: string;
  name: string;
  builder: string;
  model: string;
  year: number;
  vesselType: string;
  charterType: string;
  charterArea: string;
  heroEyebrow: string;
  tagline: string;
  summary: string;
  quickFacts: string[];
  // Null means no published rate: the page shows "Charter rates on request".
  displayRate: string | null;
  minimumNights: number | null;
  heroImage: string;
  heroImageAlt: string;
  heroVideo: string | null;
  shareImage: string;
}

export interface YachtCrewMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  photoAlt: string;
}

export interface YachtNote {
  title: string;
  body: string;
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
  heroEyebrow: "Private Luxury Crewed Yacht Charter",
  tagline: "Your Private Luxury Power Catamaran in the Virgin Islands",
  summary:
    "Discover the Caribbean in exceptional comfort aboard ATLAS, a luxurious Aquila 54 power catamaran. Explore beautiful islands, secluded anchorages and crystal-clear waters while your professional crew takes care of the details.",
  quickFacts: ["Aquila 54 Power Catamaran", "2024", "Private Crewed Charter", "USVI & BVI"],
  displayRate: null,
  minimumNights: 5,
  // Placeholder: generic Caribbean water. Replace with an ATLAS-specific photograph.
  heroImage: "/images/caribbean-water-bg.webp",
  heroImageAlt: "ATLAS, Aquila 54 luxury power catamaran",
  heroVideo: null,
  shareImage: "/images/caribbean-water-bg.webp",
};

export const aquanimity: ManagedYacht = {
  slug: "aquanimity",
  name: "Aquanimity",
  builder: "Dufour",
  model: "Dufour 48",
  year: 2021,
  vesselType: "Yacht",
  charterType: "Professionally crewed charter",
  charterArea: "British Virgin Islands",
  heroEyebrow: "Professionally Crewed Yacht Charter",
  tagline: "A Professionally Crewed Dufour 48 in the British Virgin Islands",
  summary:
    "Aquanimity is a 2021 Dufour 48 for up to eight guests in four cabins. Managed by My Caribbean Charters, she combines comfortable private accommodation with the personalized service of a professional two-person crew.",
  quickFacts: ["Dufour 48", "2021", "8 Guests", "4 Cabins", "2 Crew"],
  displayRate: "From $24,600",
  minimumNights: null,
  heroImage: "/images/aquanimity/Aquanimity-Dufour-48-Yacht-Charter-BVI.jpg",
  heroImageAlt: "Aquanimity yacht charter in the British Virgin Islands",
  heroVideo: "/video/aquanimity-hero.mp4",
  shareImage: "/images/aquanimity/Aquanimity-Dufour-48-Yacht-Charter-BVI.jpg",
};

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

export const aquanimityAbout = {
  eyebrow: "About Aquanimity",
  title: "Comfortable Accommodation and Personal Service",
  paragraphs: [
    "Aquanimity is a 2021 Dufour 48 for up to eight guests in four cabins. Managed by My Caribbean Charters, she combines comfortable private accommodation with the personalized service of a professional two-person crew.",
    "Her layout is well suited to families and groups looking to explore the British Virgin Islands, with meals, sailing and the daily itinerary coordinated around the charter party.",
  ],
};

export const aquanimityCrew: YachtCrewMember[] = [
  {
    name: "Sariese Barker",
    role: "Chef / First Mate",
    bio: "Growing up by the ocean, Sariese developed a natural love for life on the water and a passion for creating memorable experiences for guests. Combining warm Australian hospitality with hands-on maritime experience, she brings an energetic, attentive approach aboard AQUANIMITY. Sariese has worked across both the culinary and operational sides of yachting, preparing and presenting meals for charter guests while also assisting with provisioning, deck operations, mooring, anchoring, line handling and watersports. An active PADI Divemaster, her qualifications also include STCW, Food Safe Handling, Food Allergen Awareness and Security Awareness. In the galley, she enjoys preparing fresh, flavorful meals tailored to guest preferences and dietary requirements.",
    photo: "/images/aquanimity/sariese-barker.png",
    photoAlt: "Sariese Barker, Chef / First Mate aboard Aquanimity",
  },
  {
    name: "Bailey Rawe",
    role: "Captain",
    bio: "Bailey grew up on the southwest coast of England in a family with a strong sailing and boatbuilding heritage. A qualified RYA Yachtmaster Offshore, he has experience in charter operations, offshore yacht deliveries and professional deck work. His maritime qualifications also include MCA STCW, RYA Radar, Short Range Radio, Diesel Engine Maintenance and Powerboat Level 2, and he is a PADI Advanced Open Water and Rescue Diver. Bailey is also an experienced watersports instructor, with experience teaching sailing, kitesurfing, wakeboarding, kayaking, paddleboarding and snorkeling. As Captain, he enjoys creating a safe, relaxed and fun atmosphere while sharing his knowledge of sailing and the Caribbean.",
    photo: "/images/aquanimity/bailey-rawe.png",
    photoAlt: "Bailey Rawe, Captain aboard Aquanimity",
  },
];

export const aquanimityNotes: YachtNote[] = [
  {
    title: "Water Toys & Onboard Amenities",
    body: "MCC will confirm Aquanimity's current water toys and onboard amenities for your requested dates so the proposal reflects the yacht's current equipment.",
  },
  {
    title: "Charter Style & Terms",
    body: "Professionally crewed charter. Exact inclusions, exclusions and seasonal terms are confirmed in the charter proposal.",
  },
];

export const aquanimityFaqs: { question: string; answer: string }[] = [
  {
    question: "How many guests can Aquanimity accommodate?",
    answer: "Aquanimity has four cabins and accommodates up to eight guests. Our charter team will confirm the arrangements for your dates.",
  },
  {
    question: "How many crew are aboard?",
    answer: "Aquanimity is managed with a professional two-person crew: a Captain and a Chef / First Mate.",
  },
  {
    question: "Where does Aquanimity cruise?",
    answer: "Aquanimity explores the British Virgin Islands. Itineraries are subject to weather, operating permissions and clearance requirements.",
  },
  {
    question: "Are water toys and amenities included?",
    answer: "Our team will confirm Aquanimity's current water toys and onboard amenities for your dates, so your proposal reflects the yacht's current equipment.",
  },
  {
    question: "What is included in the charter rate?",
    answer: "Your personalized quotation will explain the applicable inclusions, exclusions and seasonal terms.",
  },
  {
    question: "How do we book Aquanimity?",
    answer: "Complete the enquiry form. An MCC charter specialist will confirm availability, provide a quotation and explain the booking and deposit process.",
  },
];

export const MCC_PHONE_DISPLAY = "+1 (786) 520-1558";
export const MCC_PHONE_HREF = "tel:+1-786-520-1558";
export const MCC_SITE_URL = "https://www.mycaribbeancharters.com";
