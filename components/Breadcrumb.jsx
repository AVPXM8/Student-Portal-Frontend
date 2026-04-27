"use client";
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Visual-only Breadcrumb navigation.
 * JSON-LD BreadcrumbList schema is rendered server-side in each page.js
 * to guarantee it appears in the initial HTML for Googlebot.
 * This component renders only the visible <nav> element.
 * 
 * @param {{ items: { label: string, href?: string }[] }} props
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" style={navStyle}>
      <ol style={olStyle}>
        {items.map((item, i) => (
          <li key={i} style={liStyle}>
            {i > 0 && <ChevronRight size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} style={linkStyle}>{item.label}</Link>
            ) : (
              <span style={currentStyle}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const navStyle = { marginBottom: '16px' };
const olStyle = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px',
  padding: 0,
  margin: 0,
  fontSize: '0.85rem',
};
const liStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};
const linkStyle = {
  color: '#f97316',
  textDecoration: 'none',
  fontWeight: 600,
};
const currentStyle = {
  color: '#64748b',
  fontWeight: 500,
  maxWidth: '280px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
