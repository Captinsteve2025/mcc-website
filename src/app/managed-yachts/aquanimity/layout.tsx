import type { Metadata } from "next";
import { aquanimity } from "@/lib/managed-yachts";
import { buildYachtSocialMetadata } from "@/lib/yacht-social";

const title = "Aquanimity Dufour 48 Crewed Charter | British Virgin Islands";
const description =
  "Charter Aquanimity, a 2021 Dufour 48 for up to eight guests in four cabins, with a professional two-person crew in the British Virgin Islands. Meet the crew and request availability.";

export const metadata: Metadata = {
  ...buildYachtSocialMetadata(title, description, `/managed-yachts/${aquanimity.slug}`, aquanimity.slug, aquanimity.heroImageAlt),
  keywords: [
    "Aquanimity Dufour 48 charter",
    "Dufour 48 crewed charter BVI",
    "Crewed yacht charter British Virgin Islands",
    "Luxury crewed yacht charter BVI",
    "Private yacht charter BVI",
    "Eight guest crewed charter BVI",
  ],
  alternates: { canonical: `https://www.mycaribbeancharters.com/managed-yachts/${aquanimity.slug}` },
  robots: { index: true, follow: true },
};

export default function AquanimityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
