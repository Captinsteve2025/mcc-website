import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NauticEd vs RYA for Catamaran Charter Certification | VIYB",
  description:
    "Compare NauticEd SLC and RYA certifications for bareboat catamaran chartering. Which sailing license is right for your charter goals? Detailed comparison guide.",
  keywords: [
    "NauticEd vs RYA",
    "sailing certification comparison",
    "catamaran charter license",
    "SLC certification",
    "NauticEd Bareboat Charter Master",
    "bareboat charter requirements",
    "sailing qualification comparison",
    "NauticEd SLC",
    "RYA certification",
    "which sailing certification",
  ],
  openGraph: {
    title: "NauticEd vs RYA for Catamaran Charter Certification",
    description:
      "Compare NauticEd SLC and RYA certifications for bareboat catamaran chartering. Find the right sailing license for your charter goals.",
    url: "https://services.virginislandsyachtbroker.com/training/articles/nauticed-vs-rya-certification",
    siteName: "Virgin Islands Yacht Broker",
    images: [
      {
        url: "https://services.virginislandsyachtbroker.com/bali/5-4/5-4-01.jpg",
        width: 1200,
        height: 630,
        alt: "NauticEd vs RYA certification comparison for catamaran sailing",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "NauticEd vs RYA for Catamaran Charter Certification",
    description:
      "Compare NauticEd SLC and RYA certifications. Which is right for bareboat catamaran chartering?",
    images: ["https://services.virginislandsyachtbroker.com/bali/5-4/5-4-01.jpg"],
  },
  alternates: {
    canonical: "https://services.virginislandsyachtbroker.com/training/articles/nauticed-vs-rya-certification",
  },
};

export default function NauticEdVsRYALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
