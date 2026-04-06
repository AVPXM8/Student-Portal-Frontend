import ClientComp from "./TestEnvironmentPage.jsx";

export const metadata = {
  title: "Mock Test Interface | NIMCET & CUET-PG Practice | Mathem Solvex",
  description: "Experience the real exam environment with our mock test interface. Practice NIMCET and CUET-PG questions in a timed, computer-based test format to improve your speed and accuracy.",
  openGraph: {
    title: "Practice Test Environment | Mathem Solvex",
    description: "Build exam confidence with our realistic MCA entrance test simulator.",
  }
};

export default function Page({ params, searchParams }) {
  return <ClientComp params={params} searchParams={searchParams} />;
}
