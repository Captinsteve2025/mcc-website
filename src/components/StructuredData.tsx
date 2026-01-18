// Structured Data Components for SEO
// These provide rich snippets in Google Search results

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://mycaribbeancharters.com/#organization",
    name: "My Caribbean Charters",
    alternateName: "MCC",
    url: "https://mycaribbeancharters.com",
    logo: {
      "@type": "ImageObject",
      url: "https://mycaribbeancharters.com/images/mcc-logo-white.png",
      width: 200,
      height: 50,
    },
    image: "https://mycaribbeancharters.com/images/mcc-logo-white.png",
    description: "Premier yacht charter services in the Caribbean. Crewed charters, bareboat rentals, and sailing training in the British Virgin Islands, St. Martin, and beyond.",
    foundingDate: "2020",
    areaServed: [
      { "@type": "Place", name: "British Virgin Islands" },
      { "@type": "Place", name: "US Virgin Islands" },
      { "@type": "Place", name: "St. Martin" },
      { "@type": "Place", name: "Bahamas" },
      { "@type": "Place", name: "Antigua" },
      { "@type": "Place", name: "Grenadines" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-786-520-1558",
        contactType: "sales",
        areaServed: "US",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-284-342-3268",
        contactType: "customer service",
        areaServed: "Caribbean",
        availableLanguage: "English",
      },
    ],
    sameAs: [
      "https://www.facebook.com/mycaribbeancharters",
      "https://www.instagram.com/mycaribbeancharters/",
      "https://www.youtube.com/channel/UCeJnv0OcnQ8cFG_lv2ew0Lg",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mycaribbeancharters.com/#website",
    url: "https://mycaribbeancharters.com",
    name: "My Caribbean Charters",
    description: "Luxury yacht charters and sailing training in the Caribbean",
    publisher: {
      "@id": "https://mycaribbeancharters.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://mycaribbeancharters.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://mycaribbeancharters.com/#localbusiness",
    name: "My Caribbean Charters",
    image: "https://mycaribbeancharters.com/images/mcc-logo-white.png",
    url: "https://mycaribbeancharters.com",
    telephone: "+1-786-520-1558",
    email: "bookings@mycaribbeancharters.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tortola",
      addressRegion: "British Virgin Islands",
      addressCountry: "VG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.4207,
      longitude: -64.6399,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
    priceRange: "$$$",
    servesCuisine: "Yacht Charter Services",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  priceRange?: string;
}

export function ServiceSchema({ name, description, url, image, priceRange = "$$$" }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Yacht Charter",
    provider: {
      "@id": "https://mycaribbeancharters.com/#organization",
    },
    name,
    description,
    url,
    image,
    areaServed: {
      "@type": "Place",
      name: "Caribbean",
    },
    priceRange,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface CourseSchemaProps {
  name: string;
  description: string;
  url: string;
  duration: string;
  price: string;
  location: string;
  image?: string;
}

export function CourseSchema({ name, description, url, duration, price, location, image }: CourseSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "My Caribbean Charters",
      url: "https://mycaribbeancharters.com",
    },
    courseMode: "onsite",
    courseWorkload: duration,
    image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    locationCreated: {
      "@type": "Place",
      name: location,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
