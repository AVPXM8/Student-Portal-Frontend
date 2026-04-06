import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("./HomeClient"), { ssr: true });

const SITE_URL = 'https://question.maarula.in';

export const metadata = {
  title: "Mathem Solvex | NIMCET & CUET-PG PYQ Bank | Maarula Classes",
  description: "Access 17+ years of NIMCET, CUET-PG, and MCA entrance PYQs with expert video solutions. Free question bank with topic-wise practice, mock tests, and PYQ paper downloads by Maarula Classes.",
  keywords: "NIMCET PYQ, CUET PG MCA, MCA Entrance Previous Year Questions, Maarula Classes, Mathem Solvex, NIMCET mock test, CUET PG preparation, MCA entrance coaching",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Mathem Solvex | NIMCET & CUET-PG PYQ Bank | Maarula Classes",
    description: "Access 17+ years of NIMCET, CUET-PG, and MCA entrance PYQs with expert video solutions and mock tests.",
    url: SITE_URL,
    type: "website",
    siteName: "Mathem Solvex by Maarula Classes",
    images: [{ url: "https://res.cloudinary.com/dwmj6up6j/image/upload/v1752687380/rqtljy0wi1uzq3itqxoe.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mathem Solvex | NIMCET & CUET-PG PYQ Bank",
    description: "Access 17+ years of NIMCET, CUET-PG, and MCA entrance PYQs with expert video solutions."
  }
};

export default function Page() {
  // JSON-LD schemas for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Maarula Classes",
    "alternateName": "Mathem Solvex",
    "url": "https://maarula.in",
    "logo": "https://res.cloudinary.com/dwmj6up6j/image/upload/v1752687380/rqtljy0wi1uzq3itqxoe.png",
    "description": "India's premier coaching institute for NIMCET, CUET-PG, and MCA entrance examinations.",
    "sameAs": [
      "https://www.youtube.com/@maarulaclasses",
      "https://t.me/maarulaclasses"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mathem Solvex",
    "alternateName": "Maarula Classes Question Bank",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/questions?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient />
    </>
  );
}
