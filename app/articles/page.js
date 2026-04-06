import ClientComp from "./ArticleListPage.jsx";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const title = `${page > 1 ? `Page ${page} | ` : ''}Articles & Exam News | Maarula Classes`;
  const description = "Latest exam updates, strategy guides, and insights for NIMCET, CUET-PG, and other MCA entrances from Maarula Classes.";
  const url = `https://question.maarula.in/articles${page > 1 ? `?page=${page}` : ''}`;
  const image = "https://res.cloudinary.com/dwmj6up6j/image/upload/f_auto,q_auto,w_1200/v1752687380/rqtljy0wi1uzq3itqxoe.png";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Latest Articles & Exam News for MCA Aspirants",
      description: "Stay updated with preparation strategies and insights from Maarula Classes.",
      url,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Latest Articles & Exam News for MCA Aspirants",
      description: "Stay updated with preparation strategies and insights from Maarula Classes.",
      images: [image],
    },
  };
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <ClientComp params={resolvedParams} searchParams={resolvedSearchParams} />;
}
