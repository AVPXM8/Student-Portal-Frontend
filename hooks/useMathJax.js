"use client";

import { useEffect, useRef } from 'react';

const useMathJax = (dependencies) => {
  const retryRef = useRef(null);

  useEffect(() => {
    if (retryRef.current) clearTimeout(retryRef.current);

    const typeset = () => {
      if (typeof window?.MathJax?.typesetPromise === 'function') {
        window.MathJax.typesetClear?.();
        window.MathJax.typesetPromise().catch(() => {});
      } else {
        // MathJax not loaded yet — retry
        retryRef.current = setTimeout(typeset, 500);
      }
    };

    // Small delay to let DOM paint first
    const id = setTimeout(typeset, 50);
    return () => {
      clearTimeout(id);
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [JSON.stringify(dependencies)]);
};

export default useMathJax;