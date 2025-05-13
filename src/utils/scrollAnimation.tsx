
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = () => {
  const [observerRef, setObserverRef] = useState<IntersectionObserver | null>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-section');
          }
        });
      },
      { threshold: 0.1 }
    );

    setObserverRef(observer);

    return () => {
      if (observerRef) {
        observerRef.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (observerRef) {
      elementsRef.current.forEach((el) => {
        if (el) {
          observerRef.observe(el);
        }
      });
    }
  }, [observerRef]);

  const ref = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
      if (observerRef) {
        observerRef.observe(el);
      }
    }
  };

  return ref;
};
