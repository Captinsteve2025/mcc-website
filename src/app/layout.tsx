import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from "@/components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#061625",
};

export const metadata: Metadata = {
  title: "My Caribbean Charters | Luxury Yacht Charters in the Caribbean",
  description: "Discover the Caribbean's finest yacht charters. Crewed, bareboat, and cabin charters in the British Virgin Islands, US Virgin Islands, St Martin, Grenadines, and Bahamas.",
  keywords: "yacht charter, caribbean sailing, BVI charter, luxury yacht, crewed charter, bareboat",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My Caribbean Charters",
    title: "My Caribbean Charters | Luxury Yacht Charters in the Caribbean",
    description: "Discover the Caribbean's finest yacht charters. Crewed, bareboat, and cabin charters.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        {/* Global Structured Data for SEO */}
        <OrganizationSchema />
        <WebSiteSchema />
        <LocalBusinessSchema />

        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-[#FF7F50] focus:text-white focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
