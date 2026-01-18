// Types
export interface Yacht {
  id: string;
  name: string;
  slug: string;
  type: "catamaran" | "monohull" | "motor" | "power-catamaran";
  charterType: "crewed" | "bareboat" | "cabin";
  destination: string;
  destinationSlug: string;
  guests: number;
  cabins: number;
  length: number;
  year: number;
  priceFrom: number;
  priceTo: number;
  images: string[];
  featured: boolean;
  description: string;
  highlights: string[];
  included: string[];
  crewInfo?: {
    captain: string;
    chef?: string;
    experience: string;
  };
  sampleItinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  reviews: {
    rating: number;
    author: string;
    text: string;
    date: string;
  }[];
  collections: string[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  image: string;
  yachtCount: number;
  description: string;
}

export interface CharterStyle {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
}

// Charter Styles
export const charterStyles: CharterStyle[] = [
  {
    id: "crewed",
    name: "Crewed Charters",
    slug: "crewed",
    description: "All-inclusive luxury with captain and chef",
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80",
  },
  {
    id: "bareboat",
    name: "Bareboat Charters",
    slug: "bareboat",
    description: "Captain your own adventure",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80",
  },
  {
    id: "cabin",
    name: "Cabin Charters",
    slug: "cabin",
    description: "Book by the cabin, share the journey",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  },
  {
    id: "sail-stay",
    name: "Sail & Stay",
    slug: "sail-stay",
    description: "Combine sailing with boutique resorts",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  },
];

// Destinations
export const destinations: Destination[] = [
  {
    id: "bvi",
    name: "British Virgin Islands",
    slug: "british-virgin-islands",
    image: "/images/bvi-the-baths.jpg",
    yachtCount: 48,
    description: "The sailing capital of the Caribbean",
  },
  {
    id: "usvi",
    name: "US Virgin Islands",
    slug: "us-virgin-islands",
    image: "/images/usvi-snorkeling.jpg",
    yachtCount: 32,
    description: "Pristine beaches and crystal waters",
  },
  {
    id: "stmartin",
    name: "St Martin",
    slug: "st-martin",
    image: "/images/st-martin-swimming.jpg",
    yachtCount: 24,
    description: "French-Dutch island paradise",
  },
  {
    id: "grenadines",
    name: "The Grenadines",
    slug: "grenadines",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    yachtCount: 18,
    description: "Unspoiled tropical beauty",
  },
  {
    id: "bahamas",
    name: "Bahamas",
    slug: "bahamas",
    image: "/images/bahamas-exumas.jpg",
    yachtCount: 36,
    description: "Island-hopping paradise",
  },
  {
    id: "antigua",
    name: "Antigua",
    slug: "antigua",
    image: "/images/antigua-beach.jpg",
    yachtCount: 22,
    description: "365 beaches to explore",
  },
];

// Collections
export const collections: Collection[] = [
  { id: "best-crewed-bvi", name: "Best Crewed Yachts in the BVI", slug: "best-crewed-bvi", description: "Our top-rated crewed charters" },
  { id: "luxury-power-cats", name: "Luxury Power Catamarans", slug: "luxury-power-catamarans", description: "Speed and comfort combined" },
];

// Yachts
export const yachts: Yacht[] = [
  {
    id: "1",
    name: "Serenity",
    slug: "serenity",
    type: "catamaran",
    charterType: "crewed",
    destination: "British Virgin Islands",
    destinationSlug: "british-virgin-islands",
    guests: 8,
    cabins: 4,
    length: 52,
    year: 2022,
    priceFrom: 28000,
    priceTo: 35000,
    images: [
      "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    ],
    featured: true,
    description: "Experience unparalleled luxury aboard Serenity, a stunning 52ft Lagoon catamaran perfectly suited for exploring the British Virgin Islands.",
    highlights: [
      "Award-winning captain and chef team",
      "Paddleboards, kayaks, and snorkeling gear included",
      "Onboard jacuzzi on flybridge",
      "Gourmet farm-to-table cuisine",
    ],
    included: [
      "Professional captain and chef",
      "All meals and premium beverages",
      "Water toys and snorkeling equipment",
      "Fuel and dockage fees",
      "Airport transfers",
    ],
    crewInfo: {
      captain: "Captain James Sterling",
      chef: "Chef Maria Santos",
      experience: "15+ years combined Caribbean experience",
    },
    sampleItinerary: [
      { day: 1, title: "Norman Island", description: "Board at Nanny Cay, sail to the famous Caves" },
      { day: 2, title: "The Baths", description: "Explore the iconic boulders at Virgin Gorda" },
      { day: 3, title: "Anegada", description: "Visit the coral island for pristine beaches" },
      { day: 4, title: "Jost Van Dyke", description: "Famous Foxy's and White Bay Beach" },
      { day: 5, title: "Sandy Cay", description: "Uninhabited island paradise" },
      { day: 6, title: "Cooper Island", description: "Eco-resort beach club" },
      { day: 7, title: "Return", description: "Leisurely sail back to Nanny Cay" },
    ],
    reviews: [
      { rating: 5, author: "The Johnson Family", text: "Absolutely magical week! Captain James knew all the secret spots.", date: "March 2024" },
    ],
    collections: ["best-crewed-bvi", "family-friendly"],
  },
  {
    id: "2",
    name: "Azure Dream",
    slug: "azure-dream",
    type: "power-catamaran",
    charterType: "crewed",
    destination: "British Virgin Islands",
    destinationSlug: "british-virgin-islands",
    guests: 10,
    cabins: 5,
    length: 62,
    year: 2023,
    priceFrom: 45000,
    priceTo: 55000,
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80",
    ],
    featured: true,
    description: "Azure Dream represents the pinnacle of power catamaran luxury with expansive deck spaces and a dedicated crew of three.",
    highlights: [
      "62ft Fountaine Pajot Power Catamaran",
      "Master suite with private terrace",
      "Full water sports center",
      "Crew of 3 including dive instructor",
    ],
    included: [
      "Captain, chef, and steward",
      "Premium open bar",
      "SCUBA diving for certified divers",
      "All meals prepared fresh daily",
    ],
    crewInfo: {
      captain: "Captain Alex Rivera",
      chef: "Chef Pierre Laurent",
      experience: "20+ years luxury charter experience",
    },
    sampleItinerary: [
      { day: 1, title: "Departure", description: "Set sail from Tortola to Peter Island" },
      { day: 2, title: "Virgin Gorda", description: "The Baths and North Sound" },
      { day: 3, title: "Anegada", description: "Flamingos and reef snorkeling" },
      { day: 4, title: "Scrub Island", description: "Private resort beach day" },
      { day: 5, title: "Jost Van Dyke", description: "White Bay and Soggy Dollar Bar" },
      { day: 6, title: "Norman Island", description: "The Indians diving" },
      { day: 7, title: "Return", description: "Final breakfast and disembark" },
    ],
    reviews: [
      { rating: 5, author: "The Williams Group", text: "This yacht exceeded all expectations!", date: "April 2024" },
    ],
    collections: ["best-crewed-bvi", "luxury-power-cats"],
  },
  {
    id: "3",
    name: "Island Time",
    slug: "island-time",
    type: "catamaran",
    charterType: "bareboat",
    destination: "British Virgin Islands",
    destinationSlug: "british-virgin-islands",
    guests: 8,
    cabins: 4,
    length: 45,
    year: 2021,
    priceFrom: 8500,
    priceTo: 12000,
    images: [
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80",
      "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80",
    ],
    featured: true,
    description: "Island Time is the perfect bareboat for experienced sailors looking to explore the BVI at their own pace.",
    highlights: [
      "Easy single-handed sailing",
      "Fully equipped galley",
      "Bow trampolines for relaxing",
      "Electric windlass and autopilot",
    ],
    included: [
      "Complete yacht briefing",
      "Snorkeling equipment",
      "Dinghy with outboard",
      "Linens and towels",
    ],
    sampleItinerary: [
      { day: 1, title: "Nanny Cay", description: "Pick up and provisioning" },
      { day: 2, title: "Norman Island", description: "The Caves and Pirate's Bight" },
      { day: 3, title: "The Baths", description: "Iconic Virgin Gorda landmark" },
      { day: 4, title: "North Sound", description: "Bitter End Yacht Club" },
      { day: 5, title: "Jost Van Dyke", description: "Great Harbour and Foxy's" },
      { day: 6, title: "Sandy Spit", description: "Postcard-perfect island" },
      { day: 7, title: "Return", description: "Return to Nanny Cay" },
    ],
    reviews: [
      { rating: 5, author: "Captain Bob", text: "Great boat, well maintained.", date: "January 2024" },
    ],
    collections: ["best-value"],
  },
  {
    id: "4",
    name: "Windward Spirit",
    slug: "windward-spirit",
    type: "monohull",
    charterType: "crewed",
    destination: "Grenadines",
    destinationSlug: "grenadines",
    guests: 6,
    cabins: 3,
    length: 55,
    year: 2020,
    priceFrom: 22000,
    priceTo: 28000,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80",
    ],
    featured: true,
    description: "Windward Spirit is a classic sailing yacht designed for those who love the art of sailing.",
    highlights: [
      "Traditional sailing experience",
      "Intimate 6-guest capacity",
      "Expert Grenadines knowledge",
      "Exceptional cuisine",
    ],
    included: [
      "Professional crew",
      "All meals and local beverages",
      "Water sports equipment",
      "Fuel and anchorage fees",
    ],
    crewInfo: {
      captain: "Captain Tom Blackwood",
      chef: "Chef Anna Chen",
      experience: "12 years sailing the Grenadines",
    },
    sampleItinerary: [
      { day: 1, title: "St Vincent", description: "Board and sail to Bequia" },
      { day: 2, title: "Mustique", description: "Celebrity island and Basil's Bar" },
      { day: 3, title: "Tobago Cays", description: "Marine park and turtle watching" },
      { day: 4, title: "Mayreau", description: "Salt Whistle Bay" },
      { day: 5, title: "Canouan", description: "Luxury resort island" },
      { day: 6, title: "Union Island", description: "Clifton Harbor" },
      { day: 7, title: "Return", description: "Sail back to St Vincent" },
    ],
    reviews: [
      { rating: 5, author: "Adventure Seekers", text: "The Grenadines are magical!", date: "March 2024" },
    ],
    collections: ["family-friendly"],
  },
  {
    id: "5",
    name: "Paradise Found",
    slug: "paradise-found",
    type: "power-catamaran",
    charterType: "crewed",
    destination: "Bahamas",
    destinationSlug: "bahamas",
    guests: 8,
    cabins: 4,
    length: 60,
    year: 2024,
    priceFrom: 48000,
    priceTo: 58000,
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    ],
    featured: true,
    description: "Paradise Found is the newest addition to the Bahamas fleet cruising effortlessly through the Exumas.",
    highlights: [
      "2024 Leopard 60 Powercat",
      "Swimming pigs excursion",
      "Nurse shark encounters",
      "Private sandbar picnics",
    ],
    included: [
      "Crew of 3",
      "All meals and premium bar",
      "Fuel",
      "Water sports equipment",
      "National park fees",
    ],
    crewInfo: {
      captain: "Captain Sarah Collins",
      chef: "Chef Marcus Williams",
      experience: "Bahamas specialists with 10+ years",
    },
    sampleItinerary: [
      { day: 1, title: "Nassau", description: "Board and cruise to Allan's Cay" },
      { day: 2, title: "Norman's Cay", description: "Drug plane wreck snorkel" },
      { day: 3, title: "Big Major Cay", description: "Swimming pigs!" },
      { day: 4, title: "Compass Cay", description: "Nurse sharks" },
      { day: 5, title: "Staniel Cay", description: "Thunderball Grotto" },
      { day: 6, title: "Private Sandbar", description: "Champagne lunch" },
      { day: 7, title: "Return", description: "Back to Nassau" },
    ],
    reviews: [
      { rating: 5, author: "Bucket Listers", text: "Swimming with the pigs was incredible!", date: "April 2024" },
    ],
    collections: ["luxury-power-cats", "family-friendly"],
  },
];

// Helper functions
export function getYachtsByCollection(collectionSlug: string): Yacht[] {
  return yachts.filter(y => y.collections.includes(collectionSlug));
}

export function getYachtsByDestination(destinationSlug: string): Yacht[] {
  return yachts.filter(y => y.destinationSlug === destinationSlug);
}

export function getYachtsByCharterType(charterType: string): Yacht[] {
  return yachts.filter(y => y.charterType === charterType);
}

export function getFeaturedYachts(): Yacht[] {
  return yachts.filter(y => y.featured);
}

export function getYachtBySlug(slug: string): Yacht | undefined {
  return yachts.find(y => y.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Booking steps
export const bookingSteps = [
  { step: 1, title: "Tell Us Your Dreams", description: "Share your dates and preferences", icon: "MessageSquare" },
  { step: 2, title: "Receive Your Shortlist", description: "Our experts curate perfect yacht matches", icon: "Ship" },
  { step: 3, title: "Review & Compare", description: "We'll arrange virtual tours", icon: "Search" },
  { step: 4, title: "Book with Confidence", description: "Secure your charter with flexible payments", icon: "Shield" },
  { step: 5, title: "Set Sail", description: "Arrive to a fully prepared yacht", icon: "Anchor" },
];

// Testimonials - Real MCC Reviews
export const testimonials = [
  {
    id: "1",
    rating: 5,
    author: "Rickie Slate Anderson",
    location: "British Virgin Islands",
    text: "Andrea with My Caribbean Charters is amazing! I worked with her for over a year to find the perfect crewed catamaran for a family vacation for 8 people. She never pushed or tried to upsell and patiently answered my myriad of questions. We got an amazing boat, The Big Dog, with an amazing captain and chef and had the best vacation ever!",
    yacht: "The Big Dog",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "2",
    rating: 5,
    author: "Bethanie Parker DeRose",
    location: "US Virgin Islands",
    text: "We just returned from an incredible trip sailing around St. Thomas and St. John. Andrea was the absolute best in helping me book a charter and plan this trip of a lifetime. Captain Sean on the SY Freestyle could not have been better for our group. We had an amazing experience!",
    yacht: "SY Freestyle",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "3",
    rating: 5,
    author: "Jane Love",
    location: "British Virgin Islands",
    text: "Just spent an AMAZING week cruising with Captain Steve and Chef Andrea! It was the holiday of a lifetime! Steve is an experienced and skilful sailor and we felt at ease with the boat in his hands. Andrea produces the most incredible, nutritious, delicious food! Cannot recommend enough! Five stars from us!",
    yacht: "Crewed Charter",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "4",
    rating: 5,
    author: "Mike Nootens",
    location: "British Virgin Islands",
    text: "We just came off a fantastic week long cruise in the BVI on a Lagoon 42 cat with Capt. Steve as our skipper. He is incredibly knowledgeable about every island...what to do, what to see, where to eat. If you want someone that will have your best interests in mind, you will be in good hands.",
    yacht: "Lagoon 42",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "5",
    rating: 5,
    author: "Lisa Gauch Maurer",
    location: "British Virgin Islands",
    text: "We had a great experience with My Caribbean Charters. Captain Steve took us to all the hot spots. Chef Andrea made the best meals...better than the restaurants we went to! She even cooked the fresh lobster we caught. They made our week memorable!!!",
    yacht: "Crewed Charter",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "6",
    rating: 5,
    author: "David Weingartner",
    location: "British Virgin Islands",
    text: "Thank you Andrea and Gabriella for helping us charter a terrific sailboat in the BVI and helping us all along the way. Would definitely recommend and use again. Thank you!",
    yacht: "Sailboat Charter",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "7",
    rating: 5,
    author: "Sheri Green Youn",
    location: "Jost Van Dyke",
    text: "Andrea Gonzalez and MyCaribbeanCharters organized the best girls trip with a Sail & Stay package that combined 4 days on a catamaran and 3 days in a villa on Jost. Andrea was amazing to work with!!!!",
    yacht: "Sail & Stay",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "8",
    rating: 5,
    author: "Karen Tribble",
    location: "British Virgin Islands",
    text: "The trip of a lifetime cannot recommend enough - first class from start to finish! Every detail wow just wow",
    yacht: "Crewed Charter",
    date: "2024",
    source: "Facebook",
  },
  {
    id: "9",
    rating: 5,
    author: "Lisa Down Zukoski",
    location: "British Virgin Islands",
    text: "Fabulous vacation! Wonderful crew. Steve is a meticulous sailor. Andrea meals were outstanding, so many wonderful sauces to try & fish, fish, fish. The interaction between Captain Steve & Chef Andrea was refreshing. One complements the other! I would definitely sail with these two again.",
    yacht: "Crewed Charter",
    date: "2024",
    source: "Facebook",
  },
];
