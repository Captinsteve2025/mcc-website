import type { Metadata } from "next";

const pageUrl = "https://www.mycaribbeancharters.com/managed-yachts/aquanimity";
const shareImage = "https://www.mycaribbeancharters.com/images/aquanimity/aquanimity-hero.jpg";
const title = "Aquanimity Dufour 48 Crewed Charter | British Virgin Islands";
const description =
  "Charter Aquanimity, a 2021 Dufour 48 for up to eight guests in four cabins, with a professional two-person crew in the British Virgin Islands. Meet the crew and request availability.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Aquanimity Dufour 48 charter",
    "Dufour 48 crewed charter BVI",
    "Crewed yacht charter British Virgin Islands",
    "Luxury crewed yacht charter BVI",
    "Private yacht charter BVI",
    "Eight guest crewed charter BVI",
  ],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "My Caribbean Charters",
    title,
    description,
    locale: "en_US",
    images: [{ url: shareImage, width: 1200, height: 700, alt: "Aquanimity yacht charter in the British Virgin Islands" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Professionally crewed Dufour 48 charters in the British Virgin Islands.",
    images: [shareImage],
  },
};

export default function AquanimityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
