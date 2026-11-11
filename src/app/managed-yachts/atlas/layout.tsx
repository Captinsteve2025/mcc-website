import type { Metadata } from "next";

const pageUrl = "https://www.mycaribbeancharters.com/managed-yachts/atlas";
const shareImage = "https://www.mycaribbeancharters.com/images/caribbean-water-bg.webp";

export const metadata: Metadata = {
  title: "ATLAS Aquila 54 Luxury Crewed Charter | Virgin Islands",
  description:
    "Charter ATLAS, a luxury Aquila 54 power catamaran in the Virgin Islands. Discover the yacht, explore Caribbean itineraries and request availability.",
  keywords: [
    "Aquila 54 crewed charter Virgin Islands",
    "ATLAS Aquila 54 charter",
    "Luxury power catamaran USVI",
    "Crewed motor catamaran Virgin Islands",
    "Private yacht charter St Thomas",
    "Aquila 54 Caribbean charter",
    "Luxury yacht charter USVI",
    "Crewed power catamaran BVI",
  ],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "My Caribbean Charters",
    title: "ATLAS Aquila 54 Luxury Crewed Charter | Virgin Islands",
    description:
      "Charter ATLAS, a luxury Aquila 54 power catamaran in the Virgin Islands. Discover the yacht, explore Caribbean itineraries and request availability.",
    locale: "en_US",
    images: [{ url: shareImage, width: 1200, height: 630, alt: "Caribbean waters for ATLAS charters" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLAS Aquila 54 Luxury Crewed Charter | Virgin Islands",
    description: "Private crewed Aquila 54 power catamaran charters in the Virgin Islands.",
    images: [shareImage],
  },
};

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
