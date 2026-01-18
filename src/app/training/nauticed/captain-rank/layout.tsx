import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Captain Rank Certification | NauticEd Advanced | My Caribbean Charters",
  description: "Achieve Captain rank with NauticEd's highest certification level. Advanced sailing skills, leadership, and comprehensive maritime knowledge for experienced sailors.",
  keywords: [
    "Captain rank certification",
    "NauticEd Captain",
    "advanced sailing certification",
    "master sailor qualification",
    "professional sailing credentials",
    "captain sailing license",
  ],
  openGraph: {
    title: "Captain Rank Certification | NauticEd Advanced | My Caribbean Charters",
    description: "Achieve NauticEd's highest certification level. Advanced sailing skills and leadership for experienced sailors.",
    url: "https://mycaribbeancharters.com/training/nauticed/captain-rank",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "https://mycaribbeancharters.com/hero/day-skipper.jpg",
        width: 1200,
        height: 630,
        alt: "Captain Rank sailing certification - NauticEd advanced",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Captain Rank | NauticEd Advanced Certification",
    description: "Highest level NauticEd sailing certification.",
    images: ["https://mycaribbeancharters.com/hero/day-skipper.jpg"],
  },
  alternates: {
    canonical: "https://mycaribbeancharters.com/training/nauticed/captain-rank",
  },
};

export default function CaptainRankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
