import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NauticEd Sailing Courses | Professional Certifications | My Caribbean Charters",
  description: "NauticEd sailing certifications in the British Virgin Islands. From Bareboat Charter Master to Captain rank, get internationally recognized sailing credentials.",
  keywords: [
    "NauticEd courses BVI",
    "sailing certification Caribbean",
    "NauticEd training",
    "professional sailing courses",
    "international sailing license",
    "NauticEd partner Caribbean",
  ],
  openGraph: {
    title: "NauticEd Sailing Courses | Professional Certifications | My Caribbean Charters",
    description: "NauticEd sailing certifications in the BVI. Internationally recognized credentials from Bareboat Charter Master to Captain rank.",
    url: "https://mycaribbeancharters.com/training/nauticed",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "https://mycaribbeancharters.com/hero/day-skipper.jpg",
        width: 1200,
        height: 630,
        alt: "NauticEd sailing certification courses in the BVI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NauticEd Courses | BVI Sailing Certifications",
    description: "Professional NauticEd sailing certifications in the Caribbean.",
    images: ["https://mycaribbeancharters.com/hero/day-skipper.jpg"],
  },
  alternates: {
    canonical: "https://mycaribbeancharters.com/training/nauticed",
  },
};

export default function NauticEdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
