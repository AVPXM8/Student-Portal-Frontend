import ClientComp from "./ReportIssuePage.jsx";

export const metadata = {
  title: "Report an Issue | Mathem Solvex",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <ClientComp params={resolvedParams} searchParams={resolvedSearchParams} />;
}
