import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sailing Courses & Certifications | NauticEd Training | My Caribbean Charters",
  description: "Professional sailing courses and certifications in the Caribbean. NauticEd partner offering Bareboat Charter Master and catamaran training programs. US Coast Guard approved.",
  keywords: [
    "sailing courses Caribbean",
    "NauticEd certification",
    "bareboat charter training",
    "day skipper course Caribbean",
    "catamaran sailing course",
    "sailing certification Virgin Islands",
    "learn to sail Caribbean",
  ],
  openGraph: {
    title: "Sailing Courses & Certifications | My Caribbean Charters",
    description: "Professional sailing courses in the Caribbean. Get certified with NauticEd - Bareboat Charter Master and catamaran training programs.",
    siteName: "My Caribbean Charters",
    images: [
      {
        url: "/hero/day-skipper.jpg",
        width: 1200,
        height: 630,
        alt: "Sailing training in the Caribbean - Learn to sail with My Caribbean Charters",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sailing Courses & Certifications | Caribbean Training",
    description: "Professional sailing courses in the Caribbean. NauticEd partner - get certified for bareboat charter.",
    images: ["/hero/day-skipper.jpg"],
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
