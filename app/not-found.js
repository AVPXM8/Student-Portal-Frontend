import Link from 'next/link';
import styles from './NotFound.module.css';

export const metadata = {
  title: "Page Not Found | Mathem Solvex",
  description: "The page you're looking for doesn't exist. Browse NIMCET & CUET-PG PYQs, articles, and resources on Mathem Solvex.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.bgBlur} />
      
      <div className={styles.glitch} aria-hidden="true">
        404
      </div>
      
      <h1 className={styles.title}>Oops! Page Not Found</h1>
      
      <p className={styles.description}>
        We searched high and low, but couldn&apos;t find that page. 
        It might have been moved or deleted. Let&apos;s get you back on track!
      </p>
      
      <nav className={styles.buttonGroup}>
        <Link href="/" className={styles.primaryBtn}>
          Take Me Home
        </Link>
        <Link href="/questions" className={styles.secondaryBtn}>
          Browse Questions
        </Link>
        <Link href="/articles" className={styles.secondaryBtn}>
          Read Articles
        </Link>
      </nav>
    </main>
  );
}
