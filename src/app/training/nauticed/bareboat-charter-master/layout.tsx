import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bareboat Charter Master Certification | NauticEd BVI | My Caribbean Charters",
  description: "Earn your Bareboat Charter Master certification in the BVI. The gold standard for charter sailing credentials, recognized worldwide by charter companies.",
  keywords: [
    "Bareboat Charter Master",
    "NauticEd certification",
    "charter sailing license",
    "BVI sailing certification",
    "bareboat charter qualification",
    "sailing credentials Caribbean",
  ],
  openGraph: {
    title: "Bareboat Charter Master Certification | NauticEd | My Caribbean Charters",
    description: "Earn the gold standard Bareboat Charter Master certification in the BVI. Recognized worldwide by charter companies.",
    url: "https://mycaribbeancharters.com/training/nauticed/bareboat-charter-master",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "https://mycaribbeancharters.com/hero/day-skipper.jpg",
        width: 1200,
        height: 630,
        alt: "Bareboat Charter Master certification course in the BVI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bareboat Charter Master | NauticEd Certification",
    description: "Gold standard sailing certification for bareboat charter.",
    images: ["https://mycaribbeancharters.com/hero/day-skipper.jpg"],
  },
  alternates: {
    canonical: "https://mycaribbeancharters.com/training/nauticed/bareboat-charter-master",
  },
};

export default function BareboatCharterMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
