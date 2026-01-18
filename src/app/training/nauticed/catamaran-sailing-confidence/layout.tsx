import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catamaran Sailing Confidence Course | NauticEd | My Caribbean Charters",
  description: "Build confidence sailing catamarans with this specialized NauticEd course. Learn catamaran handling, docking, and the unique characteristics of multihull sailing.",
  keywords: [
    "catamaran sailing course",
    "learn to sail catamaran",
    "catamaran handling course",
    "multihull sailing training",
    "NauticEd catamaran",
    "catamaran confidence training",
  ],
  openGraph: {
    title: "Catamaran Sailing Confidence | NauticEd Course | My Caribbean Charters",
    description: "Build confidence sailing catamarans. Learn handling, docking, and multihull sailing characteristics.",
    url: "https://mycaribbeancharters.com/training/nauticed/catamaran-sailing-confidence",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "https://mycaribbeancharters.com/hero/bali-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Catamaran sailing confidence course - Learn multihull sailing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catamaran Sailing Confidence | NauticEd",
    description: "Specialized course for catamaran handling and confidence.",
    images: ["https://mycaribbeancharters.com/hero/bali-hero.jpg"],
  },
  alternates: {
    canonical: "https://mycaribbeancharters.com/training/nauticed/catamaran-sailing-confidence",
  },
};

export default function CatamaranSailingConfidenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
