"use client";
import Link from 'next/link';
import {  useSearchParams , useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';

import api from "@/api";
import Breadcrumb from '@/components/Breadcrumb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from "./ArticleListPage.module.css";

// Safe excerpt builder (client-side)
const toPlainText = (html = '') => {
  const el = document.createElement('div');
  el.innerHTML = html;
  const text = el.textContent || el.innerText || '';
  return text.replace(/\s+/g, ' ').trim();
};
const excerpt = (html = '', n = 160) => {
  const t = toPlainText(html);
  return t.length > n ? `${t.slice(0, n).trim()}…` : t;
};

const FALLBACK_IMAGE =
  'https://res.cloudinary.com/dwmj6up6j/image/upload/f_auto,q_auto,w_1200/v1752687380/rqtljy0wi1uzq3itqxoe.png';

const SITE_ORIGIN = 'https://question.maarula.in';
const POSTS_PER_PAGE = 12;

const ArticleListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pagination state
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch posts with pagination
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/posts', {
          params: { page: currentPage, limit: POSTS_PER_PAGE }
        });
        const data = res.data;
        // Backend returns { posts, total, page, totalPages }
        setPosts(Array.isArray(data.posts) ? data.posts : (Array.isArray(data) ? data : []));
        setTotalPosts(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch posts', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', String(page));
      router.push('?' + newParams.toString(), { scroll: false });
    }
  };

  // Feature the newest post (page 1 only), list the rest
  const isFirstPage = currentPage === 1;
  const featured = isFirstPage ? posts[0] : null;
  const gridPosts = isFirstPage ? posts.slice(1) : posts;

  // Generate page buttons with ellipses
  const renderPageButtons = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) end = Math.min(totalPages, maxVisible);
    if (currentPage > totalPages - 3) start = Math.max(1, totalPages - maxVisible + 1);

    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => goToPage(1)} className={`${styles.pageBtn} ${currentPage === 1 ? styles.activePageBtn : ''}`}>1</button>
      );
      if (start > 2) pages.push(<span key="sep-s" className={styles.ellipsis}>…</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} onClick={() => goToPage(i)} className={`${styles.pageBtn} ${currentPage === i ? styles.activePageBtn : ''}`} disabled={loading}>{i}</button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="sep-e" className={styles.ellipsis}>…</span>);
      pages.push(
        <button key={totalPages} onClick={() => goToPage(totalPages)} className={`${styles.pageBtn} ${currentPage === totalPages ? styles.activePageBtn : ''}`}>{totalPages}</button>
      );
    }

    return pages;
  };

  // JSON-LD: Breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_ORIGIN}/articles` },
    ],
  };

  // JSON-LD: ItemList
  const itemListSchema = useMemo(() => {
    const list = posts.map((p, i) => ({
      '@type': 'ListItem',
      position: (currentPage - 1) * POSTS_PER_PAGE + i + 1,
      url: `${SITE_ORIGIN}/articles/${p.slug}`,
      name: p.title,
    }));
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListOrder: 'http://schema.org/ItemListUnordered',
      numberOfItems: totalPosts,
      itemListElement: list,
    };
  }, [posts, currentPage, totalPosts]);

  const blogSchema = useMemo(() => {
    const items = posts.slice(0, 12).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: excerpt(p.content, 180),
      url: `${SITE_ORIGIN}/articles/${p.slug}`,
      image: p.featuredImage || FALLBACK_IMAGE,
      datePublished: p.createdAt,
      dateModified: p.updatedAt || p.createdAt,
      author: { '@type': 'Organization', name: 'Maarula Classes' },
      publisher: {
        '@type': 'Organization',
        name: 'Maarula Classes',
        logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE },
      },
    }));
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Maarula Articles & Exam News',
      url: `${SITE_ORIGIN}/articles`,
      blogPost: items,
    };
  }, [posts]);

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerBreadcrumb}>
           <Breadcrumb 
             items={[
               { label: 'Home', href: '/' },
               { label: 'Updates', href: '/articles' }
             ]} 
           />
        </div>
        
        <div className={styles.badgeRow}>
           <div className={styles.liveBadge} aria-hidden="true">
             <span className={styles.pulseDot}></span>
             Live Updates
           </div>
        </div>

        <h1 className={styles.h1}>Stay Informed with <span>Latest Exam Updates</span></h1>
        <p className={styles.subhead}>
          Your daily source for NIMCET, CUET-PG exam news, preparation strategies, and expert insights from Maarula Classes.
        </p>
      </header>

      {/* Loading */}
      {loading && <div className={styles.loader}>Loading articles…</div>}

      {/* Featured article (page 1 only) */}
      {!loading && featured && (
        <Link href={`/articles/${featured.slug}`}
          className={styles.featuredCard}
          aria-label={`Read: ${featured.title}`}
        >
          <figure className={styles.featuredMedia}>
            <img
              src={featured.featuredImage || FALLBACK_IMAGE}
              alt={featured.title}
              className={styles.featuredImage}
              loading="lazy"
              decoding="async"
              width="1200"
              height="630"
            />
          </figure>
          <div className={styles.featuredContent}>
            {featured.category && <span className={styles.postCategory}>{featured.category}</span>}
            <h2 className={styles.postTitle}>{featured.title}</h2>
            <p className={styles.postExcerpt}>{excerpt(featured.content, 180)}</p>
            <span className={styles.readMore}>Read Full Article →</span>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {!loading && gridPosts.length > 0 && (
        <section aria-label="More articles" className={styles.postGrid}>
          {gridPosts.map(post => (
            <Link href={`/articles/${post.slug}`}
              key={post._id}
              className={styles.postCard}
              aria-label={`Read: ${post.title}`}
            >
              <div className={styles.cardImageContainer}>
                <img
                  src={post.featuredImage || FALLBACK_IMAGE}
                  alt={post.title}
                  className={styles.cardImage}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="338"
                />
              </div>
              <div className={styles.postContent}>
                {post.category && <span className={styles.postCategory}>{post.category}</span>}
                <h3 className={styles.postTitleSmall}>{post.title}</h3>
                <p className={styles.cardExcerpt}>{excerpt(post.content, 120)}</p>
                <span className={styles.readMoreSmall}>Read More →</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Article pagination">
          <button
            className={styles.paginationArrow}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} /> Prev
          </button>

          <div className={styles.pageNumbers}>
            {renderPageButtons()}
          </div>

          <button
            className={styles.paginationArrow}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            Next <ChevronRight size={20} />
          </button>
        </nav>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className={styles.emptyState}>
          No articles found. Please check back soon.
        </div>
      )}
    </div>
  );
};

export default ArticleListPage;
