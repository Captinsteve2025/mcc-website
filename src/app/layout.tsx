import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
