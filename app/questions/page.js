import ClientComp from "./QuestionLibraryPage.jsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const exam = resolvedSearchParams.exam || '';
  const subject = resolvedSearchParams.subject || '';
  const year = resolvedSearchParams.year || '';
  const search = resolvedSearchParams.search || '';
  const pageStr = resolvedSearchParams.page || '1';
  const page = parseInt(pageStr, 10);

  const bits = [];
  if (exam) bits.push(exam);
  if (subject) bits.push(subject);
  if (year) bits.push(year);
  if (search) bits.push(`"${search}"`);
  
  const prefix = bits.length ? `${bits.join(' ')} PYQs | ` : '';
  const pageNum = page > 1 ? `Page ${page} | ` : '';
  const title = `${prefix}MCA Entrance Question Bank ${pageNum}| Maarula Classes`;

  const descBits = [];
  if (exam) descBits.push(exam);
  if (subject) descBits.push(subject);
  if (year) descBits.push(`Year ${year}`);
  if (search) descBits.push(`matching "${search}"`);
  
  const filterDesc = descBits.length ? `Filtered by ${descBits.join(', ')}. ` : '';
  const description = `Practice 17 years of MCA entrance PYQs (NIMCET, CUET PG & more) with detailed solutions and video explanations across Mathematics, Computer Science, English, Logical Reasoning, and Aptitude. ${filterDesc}Search and filter to prepare smarter.`;

  // Fix H5: Canonical should always be the base URL to avoid infinite URL variants
  const canonicalUrl = `https://question.maarula.in/questions`;
  const image = "https://question.maarula.in/og/maarula-question-bank.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  let initialQuestions = [];
  let initialTotalDocs = 0;
  let initialTotalPages = 1;

  try {
    const queryParams = new URLSearchParams(resolvedSearchParams);
    queryParams.set('noOptions', 'true');
    const res = await fetch(`${API_BASE}/api/questions/public?${queryParams.toString()}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      initialQuestions = Array.isArray(data.questions) ? data.questions : [];
      initialTotalDocs = data.totalDocs || 0;
      initialTotalPages = data.totalPages || 1;
    }
  } catch (error) {
    console.error("Failed to fetch initial questions:", error);
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://question.maarula.in" },
      { "@type": "ListItem", "position": 2, "name": "Question Bank" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ClientComp 
        params={resolvedParams} 
        searchParams={resolvedSearchParams} 
        initialQuestions={initialQuestions}
        initialTotalDocs={initialTotalDocs}
        initialTotalPages={initialTotalPages}
      />
    </>
  );
}
