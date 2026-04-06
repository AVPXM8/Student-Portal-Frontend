"use client";

import React from 'react';
import useMathJax from '@/hooks/useMathJax';

const MathPreview = ({ latexString = '', className = '', style = {} }) => {
  // Guard: don’t let MathJax mutate during the very first paint
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Clean the string: MathJax 3 hates &nbsp; and some other HTML artifacts inside LaTeX
  const cleaned = React.useMemo(() => {
    if (!latexString) return '';
    let strToClean = typeof latexString === 'string' ? latexString : String(latexString || '');
    if (typeof latexString === 'object') strToClean = latexString.text || '';
    
    return strToClean
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/<br\s*\/?>/gi, '\n')
      // Ensure LaTeX blocks have proper spacing
      .replace(/(\$|\\\(|\\\[)/g, ' $1')
      .replace(/(\$|\\\)|\\\])/g, '$1 ');
  }, [latexString]);

  useMathJax(mounted ? [cleaned] : []);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
};

export default MathPreview;
