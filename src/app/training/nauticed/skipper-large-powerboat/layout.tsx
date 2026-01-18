import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skipper Large Powerboat Course | NauticEd | My Caribbean Charters",
  description: "Learn to skipper large powerboats and power catamarans with NauticEd certification. Engine handling, docking, and navigation for power vessels.",
  keywords: [
    "powerboat skipper course",
    "large powerboat training",
    "power catamaran course",
    "NauticEd powerboat",
    "motor yacht training",
    "powerboat certification Caribbean",
  ],
  openGraph: {
    title: "Skipper Large Powerboat Course | NauticEd | My Caribbean Charters",
    description: "Learn to skipper large powerboats and power catamarans. Engine handling, docking, and navigation training.",
    url: "https://mycaribbeancharters.com/training/nauticed/skipper-large-powerboat",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "https://mycaribbeancharters.com/hero/bali-52-sailing.jpg",
        width: 1200,
        height: 630,
        alt: "Skipper Large Powerboat course - Power vessel training",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skipper Large Powerboat | NauticEd Course",
    description: "Power vessel certification for large boats and power cats.",
    images: ["https://mycaribbeancharters.com/hero/bali-52-sailing.jpg"],
  },
  alternates: {
    canonical: "https://mycaribbeancharters.com/training/nauticed/skipper-large-powerboat",
  },
};

export default function SkipperLargePowerboatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
