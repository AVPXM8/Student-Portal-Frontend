import ClientComp from "./AboutPage.jsx";

export const metadata = {
  title: "About Maarula Classes — India's Top NIMCET & MCA Entrance Coaching",
  description: "Learn about Maarula Classes, India's premier coaching institute for NIMCET, CUET-PG, and MCA entrance exams. 10+ years of excellence with proven results and expert faculty.",
  alternates: {
    canonical: "https://question.maarula.in/about",
  },
  openGraph: {
    title: "About Maarula Classes — India's Top MCA Entrance Coaching",
    description: "Learn about Maarula Classes, India's premier coaching institute for NIMCET, CUET-PG, and MCA entrance exams.",
    url: "https://question.maarula.in/about",
    type: "website",
    siteName: "Mathem Solvex by Maarula Classes",
  },
};

export default function Page({ params, searchParams }) {
  return <ClientComp params={params} searchParams={searchParams} />;
}
