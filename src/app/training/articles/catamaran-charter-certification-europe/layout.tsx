import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get Certified to Charter a Catamaran in Europe | VIYB",
  description:
    "Complete guide to catamaran charter certification for European waters. Learn about ICC, SLC, and NauticEd requirements for Mediterranean sailing in Croatia, Greece, Spain and beyond.",
  keywords: [
    "catamaran charter certification Europe",
    "SLC license",
    "SLC certification",
    "Mediterranean sailing license",
    "European charter requirements",
    "Croatia sailing license",
    "Greece charter certification",
    "bareboat charter Europe",
    "sailing license Mediterranean",
    "catamaran certification requirements",
  ],
  openGraph: {
    title: "How to Get Certified to Charter a Catamaran in Europe",
    description:
      "Complete guide to catamaran charter certification for European waters. ICC, SLC, and NauticEd requirements for Mediterranean sailing.",
    url: "https://services.virginislandsyachtbroker.com/training/articles/catamaran-charter-certification-europe",
    siteName: "Virgin Islands Yacht Broker",
    images: [
      {
        url: "https://services.virginislandsyachtbroker.com/bali/5-4/5-4-01.jpg",
        width: 1200,
        height: 630,
        alt: "Catamaran sailing - European charter certification guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Get Certified to Charter a Catamaran in Europe",
    description:
      "Complete guide to ICC, SLC, and NauticEd certification for European catamaran chartering.",
    images: ["https://services.virginislandsyachtbroker.com/bali/5-4/5-4-01.jpg"],
  },
  alternates: {
    canonical: "https://services.virginislandsyachtbroker.com/training/articles/catamaran-charter-certification-europe",
  },
};

export default function CatamaranCharterCertificationEuropeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
