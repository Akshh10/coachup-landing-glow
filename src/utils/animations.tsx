
import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
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

    observerRef.current = observer;

    // Observe all current elements
    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const ref = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    }
  };

  return ref;
};

// Framer Motion variants for reuse
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};
