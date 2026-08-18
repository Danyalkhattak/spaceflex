import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import EnsureUserSynced from "../auth/EnsureUserSynced.jsx";
import RouteErrorBoundary from "./RouteErrorBoundary.jsx";

const Layout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EnsureUserSynced />
      <Navbar />
      <main className="flex-1">
        <RouteErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
