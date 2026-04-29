/*
 * ScrollToTop.jsx
 * A utility component that resets the window scroll position to the top whenever the route changes.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Utility component that listens to route changes and scrolls to the top of the window
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
