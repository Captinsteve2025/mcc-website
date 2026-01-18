import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why St Martin Is Ideal for Advanced Catamaran Training | VIYB",
  description:
    "Discover why St Martin offers the perfect conditions for advanced catamaran sailing training. Trade winds, multi-island passages, and international waters for charter-ready skills.",
  keywords: [
    "St Martin sailing",
    "Caribbean catamaran training",
    "advanced sailing course",
    "offshore sailing Caribbean",
    "catamaran training location",
    "St Martin sailing school",
    "Caribbean sailing conditions",
    "trade wind sailing",
    "multi-island sailing training",
    "offshore passage training Caribbean",
  ],
  openGraph: {
    title: "Why St Martin Is Ideal for Advanced Catamaran Training",
    description:
      "Trade winds, multi-island passages, and international waters make St Martin the Caribbean's premier destination for serious catamaran sailing education.",
    url: "https://services.virginislandsyachtbroker.com/training/articles/why-st-martin-catamaran-training",
    siteName: "Virgin Islands Yacht Broker",
    images: [
      {
        url: "https://services.virginislandsyachtbroker.com/bali/5-4/5-4-01.jpg",
        width: 1200,
        height: 630,
        alt: "Catamaran sailing in St Martin Caribbean waters",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why St Martin Is Ideal for Advanced Catamaran Training",
    description:
      "Perfect trade winds, multi-island passages, and international waters for charter-ready catamaran training.",
    images: ["https://services.virginislandsyachtbroker.com/bali/5-4/5-4-01.jpg"],
  },
  alternates: {
    canonical: "https://services.virginislandsyachtbroker.com/training/articles/why-st-martin-catamaran-training",
  },
};

export default function WhyStMartinTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
