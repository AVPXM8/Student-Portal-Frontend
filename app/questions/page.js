import ClientComp from "./QuestionLibraryPage.jsx";

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

  const params = new URLSearchParams(resolvedSearchParams);
  const url = `https://question.maarula.in/questions${params.toString() ? `?${params.toString()}` : ''}`;
  const image = "https://question.maarula.in/og/maarula-question-bank.png";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
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
  return <ClientComp params={resolvedParams} searchParams={resolvedSearchParams} />;
}
