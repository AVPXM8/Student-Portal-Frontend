/**
 * ServerMathContent — React Server Component
 *
 * Renders HTML content that already has KaTeX-processed math
 * (produced by renderMathSSR) as static server-rendered markup.
 *
 * NO "use client" — this component is intentionally a Server Component
 * so the rendered math is present in the initial HTML for crawlers.
 */

import 'katex/dist/katex.min.css';

/**
 * @param {object} props
 * @param {string}  props.html        - Pre-rendered HTML from renderMathSSR()
 * @param {string} [props.className]  - Optional CSS class
 * @param {string} [props.tag]        - HTML tag to wrap with (default: "div")
 */
export default function ServerMathContent({ html = '', className = '', tag = 'div' }) {
  const Tag = tag;
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
