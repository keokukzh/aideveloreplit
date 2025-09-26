import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all scroll-reveal elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach((el) => observer.observe(el));

    return () => {
      scrollRevealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};