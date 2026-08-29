import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/react";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import Icon from "../ui/Icon.jsx";
import Button from "../ui/Button.jsx";

const navLinkClass = ({ isActive }) =>
  `relative flex h-16 items-center px-1 text-sm font-medium transition-colors
   after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:rounded-full
   after:bg-bronze-500 after:transition-transform after:duration-200 after:origin-center
   ${
     isActive
       ? "text-brand-950 after:scale-x-100"
       : "text-slate-500 hover:text-brand-950 after:scale-x-0 hover:after:scale-x-100"
   }`;

const Navbar = () => {
  const { isSignedIn } = useUser();
  const { isAdmin } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "bg-white/85 border-slate-200/80 shadow-[0_8px_24px_-16px_rgba(10,32,56,0.25)]"
          : "bg-white/70 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <Icon name="building" className="w-4.5 h-4.5" />
          </span>
          <span className="font-display font-semibold text-lg text-brand-950 tracking-tight">
            SpaceFlex
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/coworking" className={navLinkClass}>
            Coworking
          </NavLink>
          <NavLink to="/enterprise-office" className={navLinkClass}>
            Enterprise
          </NavLink>
          <NavLink to="/housing" className={navLinkClass}>
            Housing
          </NavLink>
          {isSignedIn && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          )}
          {isSignedIn && (
            <NavLink to="/my-inquiries" className={navLinkClass}>
              My Inquiries
            </NavLink>
          )}
          {isSignedIn && isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <UserButton />
              <SignOutButton>
                <button className="text-sm font-medium text-slate-500 hover:text-brand-950 transition-colors">
                  Sign out
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">
                Sign in
                <Icon name="arrowRight" className="w-4 h-4" />
              </Button>
            </SignInButton>
          )}
        </div>

        <button
          type="button"
          className={`md:hidden p-2 rounded-lg transition-colors ${
            menuOpen ? "text-brand-950 bg-brand-50" : "text-slate-600 hover:bg-slate-100"
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1 shadow-[0_16px_32px_-20px_rgba(10,32,56,0.3)] animate-slide-down">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/coworking", label: "Coworking Spaces" },
            { to: "/enterprise-office", label: "Enterprise Office Leasing" },
            { to: "/housing", label: "Executive Housing" },
          ]
            .concat(
              isSignedIn
                ? [
                    { to: "/my-bookings", label: "My Bookings" },
                    { to: "/my-inquiries", label: "My Inquiries" },
                    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
                  ]
                : []
            )
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-950"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-950"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          <div className="pt-3 border-t border-slate-100">
            {isSignedIn ? (
              <div className="flex items-center justify-between px-1">
                <UserButton />
                <SignOutButton>
                  <button className="text-sm font-medium text-slate-500 hover:text-brand-950 transition-colors">
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="w-full">
                  Sign in
                  <Icon name="arrowRight" className="w-4 h-4" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
