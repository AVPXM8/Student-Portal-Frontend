import ClientComp from "../PYQResourcesPage.jsx";
import { PYQ_DATA } from "@/data/resourceData";

export async function generateMetadata({ params }) {
  const { examName } = await params;
  const decoded = decodeURIComponent(examName);
  
  // Robust case-insensitive lookup
  const matchedKey = Object.keys(PYQ_DATA).find(key => {
    const k = key.toUpperCase();
    const d = decoded.toUpperCase();
    return k === d || 
           k.replace(/-/g, ' ') === d || 
           k === d.replace(/-/g, ' ') ||
           k.replace(/[- ]/g, '') === d.replace(/[- ]/g, '');
  });
  
  const data = PYQ_DATA[matchedKey];
  const displayTitle = matchedKey || decoded;

  if (!data) return { title: "Exam Not Found | Mathem Solvex" };

  return {
    title: `${displayTitle} Previous Year Papers PDF | Mathem Solvex`,
    description: `Download official ${displayTitle} previous year question papers PDF. Year-wise and topic-wise solutions available for free.`,
    openGraph: {
      title: `${decoded} PYQ Resources`,
      description: `Free PDF downloads for ${decoded} MCA entrance exam.`,
    }
  };
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <ClientComp params={resolvedParams} searchParams={resolvedSearchParams} />;
}
