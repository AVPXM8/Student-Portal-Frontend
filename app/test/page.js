import ClientComp from "./TestEnvironmentPage.jsx";

const SITE_URL = 'https://question.maarula.in';

export const metadata = {
  title: "Mock Test Interface | NIMCET & CUET-PG Practice | Mathem Solvex",
  description: "Experience the real exam environment with our mock test interface. Practice NIMCET and CUET-PG questions in a timed, computer-based test format to improve your speed and accuracy.",
  keywords: "NIMCET mock test, CUET PG mock test online, MCA entrance practice test, CBT exam simulator, NIMCET practice paper",
  alternates: {
    canonical: `${SITE_URL}/test`,
  },
  openGraph: {
    title: "Practice Test Environment | Mathem Solvex",
    description: "Build exam confidence with our realistic MCA entrance test simulator.",
    url: `${SITE_URL}/test`,
    type: "website",
    siteName: "Mathem Solvex by Maarula Classes",
  },
  twitter: {
    card: "summary",
    title: "Mock Test — NIMCET & CUET-PG Practice | Mathem Solvex",
    description: "Practice in a realistic exam environment.",
  },
};

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <ClientComp params={resolvedParams} searchParams={resolvedSearchParams} />;
}
