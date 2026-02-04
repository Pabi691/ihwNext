import { useEffect } from 'react';
import { useLocation } from '@/components/compat/router';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on route change
  }, [location]);

  return null;
};

export default ScrollToTop;

