import type { Metadata } from "next";
import { atlas } from "@/lib/managed-yachts";
import { buildYachtSocialMetadata } from "@/lib/yacht-social";

const title = "ATLAS Aquila 54 Luxury Crewed Charter | Virgin Islands";
const description =
  "Charter ATLAS, a luxury Aquila 54 power catamaran in the Virgin Islands. Discover the yacht, explore Caribbean itineraries and request availability.";

export const metadata: Metadata = {
  ...buildYachtSocialMetadata(title, description, `/managed-yachts/${atlas.slug}`, atlas.slug, "Caribbean waters for ATLAS charters"),
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
  alternates: { canonical: `https://www.mycaribbeancharters.com/managed-yachts/${atlas.slug}` },
  robots: { index: true, follow: true },
};

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
