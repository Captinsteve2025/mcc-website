import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "St Martin Catamaran Sailing Course | NauticEd Charter Certification | My Caribbean Charters",
  description:
    "Advanced St Martin catamaran sailing course with NauticEd certification. Charter-ready training for Caribbean and European catamaran charters. 6-day intensive program with SLC + ICC licensing.",
  keywords: [
    "St Martin sailing course",
    "St Martin catamaran course",
    "catamaran sailing course Caribbean",
    "advanced sailing course Caribbean",
    "offshore sailing course Caribbean",
    "NauticEd catamaran certification",
    "Caribbean catamaran training",
    "Bareboat Charter Master St Martin",
    "NauticEd SLC training",
    "SLC certification Caribbean",
    "sailing certification St Martin",
    "catamaran training St Barts",
    "Anguilla sailing course",
    "liveaboard sailing training",
    "charter readiness course",
    "Bali catamaran training",
    "bareboat charter certification",
    "catamaran charter license",
    "European charter certification",
    "Mediterranean sailing license",
    "St Martin sailing school",
    "catamaran skipper course",
    "offshore passage training",
    "NauticEd practical training",
    "Caribbean sailing certification",
    "charter skipper qualification",
    "sailing license Caribbean",
    "catamaran handling course",
    "multi-hull sailing training",
    "international sailing license",
  ],
  openGraph: {
    title: "St Martin Catamaran Sailing Course | NauticEd Charter Certification",
    description:
      "Advanced St Martin catamaran sailing course with NauticEd certification. Charter-ready training for Caribbean and European catamaran charters. 15% off courses before April 2026.",
    url: "https://mycaribbeancharters.com/training/day-skipper-st-martin",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "https://mycaribbeancharters.com/bali/5-4/5-4-01.jpg",
        width: 1200,
        height: 630,
        alt: "Bali 5.4 Catamaran sailing in St Martin Caribbean waters - NauticEd Training",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "St Martin Catamaran Sailing Course | NauticEd Certification",
    description:
      "Advanced catamaran sailing course in St Martin with NauticEd SLC + SLC certification. Charter-ready for Caribbean and European waters.",
    images: [
      "https://mycaribbeancharters.com/bali/5-4/5-4-01.jpg",
    ],
  },
  alternates: {
    canonical: "https://mycaribbeancharters.com/training/day-skipper-st-martin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function DaySkipperStMartinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
