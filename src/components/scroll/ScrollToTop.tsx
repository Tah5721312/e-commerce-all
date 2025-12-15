'use client';

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-8 right-8 z-40 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors'
      aria-label='Scroll to top'
    >
      <FiArrowUp className='w-5 h-5' />
    </button>
  );
};

export default ScrollToTop;
