import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NauticEd Prerequisites Checklist | Bareboat Charter Master St. Martin | VIYB",
  description:
    "Complete checklist of required NauticEd online courses before your 6-day practical training in St. Martin. Skipper, Coastal Navigation, Sail Trim, COLREGs, and Anchoring courses required.",
  keywords: [
    "NauticEd prerequisites",
    "sailing course requirements",
    "Bareboat Charter Master prerequisites",
    "NauticEd online courses",
    "sailing certification requirements",
    "SLC license requirements",
    "SLC certification prerequisites",
    "bareboat charter requirements",
  ],
  openGraph: {
    title: "NauticEd Prerequisites Checklist | Bareboat Charter Master St. Martin",
    description:
      "Required NauticEd online courses before your practical training. Skipper, Coastal Navigation, Sail Trim, COLREGs, and Anchoring.",
    url: "https://services.virginislandsyachtbroker.com/training/nauticed-prerequisites",
    siteName: "Virgin Islands Yacht Broker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NauticEd Prerequisites | Bareboat Charter Master Training",
    description:
      "Complete checklist of required NauticEd courses before your 6-day practical training in St. Martin.",
  },
};

export default function NauticEdPrerequisitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
