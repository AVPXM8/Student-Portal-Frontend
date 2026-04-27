"use client";

import { useEffect, useRef } from 'react';

const useMathJax = (dependencies, containerRef) => {
  const retryRef = useRef(null);

  useEffect(() => {
    if (retryRef.current) clearTimeout(retryRef.current);

    const typeset = () => {
      if (typeof window?.MathJax?.typesetPromise === 'function') {
        const elements = containerRef && containerRef.current ? [containerRef.current] : undefined;
        // Do not clear the typeset cache globally if we are only typesetting specific elements
        if (!elements) {
          window.MathJax.typesetClear?.();
        }
        
        // Use MathJax typesetting queue to prevent concurrent typeset errors
        let promise = window.MathJax.startup?.promise || Promise.resolve();
        promise = promise.then(() => window.MathJax.typesetPromise(elements))
                         .catch((err) => console.log('MathJax typeset failed: ', err));
                         
        if (window.MathJax.startup) {
          window.MathJax.startup.promise = promise;
        }
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
  }, [JSON.stringify(dependencies), containerRef]);
};

export default useMathJax;