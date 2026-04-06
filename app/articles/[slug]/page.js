import ClientComp from "./SinglePostPage.jsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const SITE_URL = 'https://question.maarula.in';

function stripHtml(s = '') {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/posts/${slug}`, { next: { revalidate: 3600 } });
    const post = await res.json();

    if (!post || !post.title) return { title: "Article Not Found" };

    const description = post.metaDescription || stripHtml(post.content || '').slice(0, 160);
    const image = post.featuredImage || "https://res.cloudinary.com/dwmj6up6j/image/upload/v1752687380/rqtljy0wi1uzq3itqxoe.png";
    const url = `${SITE_URL}/articles/${slug}`;

    return {
      title: `${post.title} | Maarula Classes`,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: post.title,
        description,
        url,
        images: [{ url: image, width: 1200, height: 630 }],
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        siteName: 'Mathem Solvex by Maarula Classes',
        section: post.category || 'Education',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return { title: "Maarula Classes | Latest Updates" };
  }
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Fetch post server-side for JSON-LD Article schema
  let jsonLd = null;
  try {
    const res = await fetch(`${API_BASE}/api/posts/${resolvedParams.slug}`, { next: { revalidate: 3600 } });
    const post = await res.json();
    if (post && post.title) {
      const description = post.metaDescription || stripHtml(post.content || '').slice(0, 300);
      const image = post.featuredImage || "https://res.cloudinary.com/dwmj6up6j/image/upload/v1752687380/rqtljy0wi1uzq3itqxoe.png";

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": description,
        "image": image,
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt || post.createdAt,
        "author": {
          "@type": "Organization",
          "name": "Maarula Classes",
          "url": "https://maarula.in",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Maarula Classes",
          "url": "https://maarula.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://res.cloudinary.com/dwmj6up6j/image/upload/v1752687380/rqtljy0wi1uzq3itqxoe.png",
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SITE_URL}/articles/${resolvedParams.slug}`,
        },
        "articleSection": post.category || "Education",
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
