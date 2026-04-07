import ClientComp from "./SingleQuestionPage.jsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const SITE_URL = 'https://question.maarula.in';

function stripToPlain(s = '') {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$+[^$]*\$+/g, ' ')
    .replace(/\\\[.*?\\\]/gs, ' ')
    .replace(/\\\((.|[\n])*?\\\)/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/questions/public/${id}`, { next: { revalidate: 3600 } });
    const question = await res.json();
    
    if (!question || !question.questionText) return { title: "Question Not Found" };

    const plainText = stripToPlain(question.questionText).slice(0, 160);
    const titleSnippet = plainText.slice(0, 65);
    const examLabel = question.exam || 'MCA Entrance';
    const subjectLabel = question.subject || '';
    const yearLabel = question.year || '';

    const title = `${examLabel} ${yearLabel} ${subjectLabel} PYQ — ${titleSnippet}… | Mathem Solvex`;
    const description = `Practice this ${subjectLabel} question from ${examLabel} ${yearLabel} with step-by-step solution and video explanation. ${plainText}`;
    const image = question.questionImageURL || "https://res.cloudinary.com/dwmj6up6j/image/upload/v1752687380/rqtljy0wi1uzq3itqxoe.png";
    const url = `${SITE_URL}/question/${id}`;

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
        images: [{ url: image }],
        type: 'article',
        siteName: 'Mathem Solvex by Maarula Classes',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return { title: "Mathem Solvex | Question PYQ Solutions" };
  }
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Fetch question data server-side for JSON-LD
  let jsonLd = null;
  try {
    const res = await fetch(`${API_BASE}/api/questions/public/${resolvedParams.id}`, { next: { revalidate: 3600 } });
    const q = await res.json();
    if (q && q.questionText) {
      const plainQ = stripToPlain(q.questionText).slice(0, 300);
      const correctIdx = q.options?.findIndex(o => o.isCorrect);
      const correctText = correctIdx >= 0 ? stripToPlain(q.options[correctIdx]?.text || '').slice(0, 200) : '';

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": `${q.exam || 'MCA'} ${q.year || ''} ${q.subject || ''} Question`,
        "about": {
          "@type": "Thing",
          "name": q.subject || q.topic || 'MCA Entrance',
        },
        "educationalAlignment": {
          "@type": "AlignmentObject",
          "alignmentType": "educationalSubject",
          "targetName": q.subject || '',
        },
        "hasPart": [{
          "@type": "Question",
          "text": plainQ,
          "acceptedAnswer": correctText ? {
            "@type": "Answer",
            "text": correctText,
          } : undefined,
        }],
        "provider": {
          "@type": "Organization",
          "name": "Maarula Classes",
          "url": "https://maarula.in",
        },
      };
    }
  } catch (_) {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ClientComp params={resolvedParams} searchParams={resolvedSearchParams} />
    </>
  );
}
