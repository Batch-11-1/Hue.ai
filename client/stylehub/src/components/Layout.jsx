/*
 * Layout.jsx
 * Wrapper component to provide a consistent top-level structure and handling of scroll position across routes.
 */
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

// Defines the root layout structure containing utility wrappers and an outlet for routing content
const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default Layout;
