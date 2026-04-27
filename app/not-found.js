import Link from 'next/link';

export const metadata = {
  title: "Page Not Found | Mathem Solvex",
  description: "The page you're looking for doesn't exist. Browse NIMCET & CUET-PG PYQs, articles, and resources on Mathem Solvex.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'var(--font-outfit), sans-serif',
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #FF5E0E, #FFB800)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '12px',
      }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.3rem', color: '#1E293B', marginBottom: '8px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#64748B', maxWidth: '480px', marginBottom: '32px', lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. 
        Try exploring our question bank or articles instead.
      </p>
      <nav style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          padding: '12px 28px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FF5E0E, #FFB800)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.95rem',
          textDecoration: 'none',
          transition: 'transform 0.2s',
        }}>
          ← Go Home
        </Link>
        <Link href="/questions" style={{
          padding: '12px 28px',
          borderRadius: '12px',
          border: '2px solid #FF5E0E',
          color: '#FF5E0E',
          fontWeight: 600,
          fontSize: '0.95rem',
          textDecoration: 'none',
        }}>
          Browse Questions
        </Link>
        <Link href="/articles" style={{
          padding: '12px 28px',
          borderRadius: '12px',
          border: '2px solid #E2E8F0',
          color: '#64748B',
          fontWeight: 600,
          fontSize: '0.95rem',
          textDecoration: 'none',
        }}>
          Read Articles
        </Link>
      </nav>
    </main>
  );
}
