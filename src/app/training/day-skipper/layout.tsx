import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bareboat Charter Master Course BVI | Learn to Sail Caribbean | VIYB",
  description: "Earn your Bareboat Charter Master certification in the British Virgin Islands. Hands-on sailing instruction in the world's best cruising grounds. Perfect for aspiring sailors.",
  keywords: [
    "Bareboat Charter Master course BVI",
    "learn to sail Caribbean",
    "sailing certification Virgin Islands",
    "Bareboat Charter Master training",
    "beginner sailing course",
    "BVI sailing lessons",
  ],
  openGraph: {
    title: "Bareboat Charter Master Course | Learn to Sail in the BVI | VIYB",
    description: "Earn your Bareboat Charter Master certification in the British Virgin Islands. Hands-on instruction in world-class cruising grounds.",
    url: "https://services.virginislandsyachtbroker.com/training/day-skipper",
    siteName: "Virgin Islands Yacht Broker",
    images: [
      {
        url: "https://services.virginislandsyachtbroker.com/hero/day-skipper.jpg",
        width: 1200,
        height: 630,
        alt: "Bareboat Charter Master sailing course in the British Virgin Islands",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bareboat Charter Master Course BVI | Sailing Certification",
    description: "Learn to sail in the British Virgin Islands. Bareboat Charter Master certification course.",
    images: ["https://services.virginislandsyachtbroker.com/hero/day-skipper.jpg"],
  },
  alternates: {
    canonical: "https://services.virginislandsyachtbroker.com/training/day-skipper",
  },
};

export default function DaySkipperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
