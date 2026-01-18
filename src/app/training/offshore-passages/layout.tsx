import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offshore Passage Training | Ocean Sailing Courses | VIYB",
  description: "Master offshore sailing with professional passage training. Learn ocean navigation, weather routing, and passage planning for blue water cruising adventures.",
  keywords: [
    "offshore sailing course",
    "ocean passage training",
    "blue water sailing",
    "offshore navigation course",
    "passage making training",
    "ocean sailing certification",
  ],
  openGraph: {
    title: "Offshore Passage Training | Ocean Sailing | VIYB",
    description: "Master offshore sailing with professional passage training. Ocean navigation, weather routing, and passage planning.",
    url: "https://services.virginislandsyachtbroker.com/training/offshore-passages",
    siteName: "Virgin Islands Yacht Broker",
    images: [
      {
        url: "https://services.virginislandsyachtbroker.com/hero/bali-52-sailing.jpg",
        width: 1200,
        height: 630,
        alt: "Offshore passage training - Ocean sailing courses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Offshore Passage Training | Blue Water Sailing",
    description: "Professional offshore sailing and passage making courses.",
    images: ["https://services.virginislandsyachtbroker.com/hero/bali-52-sailing.jpg"],
  },
  alternates: {
    canonical: "https://services.virginislandsyachtbroker.com/training/offshore-passages",
  },
};

export default function OffshorePassagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
