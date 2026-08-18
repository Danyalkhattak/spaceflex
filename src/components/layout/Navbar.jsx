import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUser, SignInButton, UserButton } from "@clerk/react";
import Icon from "../ui/Icon.jsx";
import Button from "../ui/Button.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
  }`;

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Icon name="building" className="w-4.5 h-4.5" />
          </span>
          <span className="font-semibold text-slate-900 tracking-tight">SpaceFlex</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/coworking" className={navLinkClass}>
            Coworking Spaces
          </NavLink>
          {isSignedIn && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Sign in</Button>
            </SignInButton>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 py-3 space-y-3 bg-white">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <div className="py-1.5">Home</div>
          </NavLink>
          <NavLink to="/coworking" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <div className="py-1.5">Coworking Spaces</div>
          </NavLink>
          {isSignedIn && (
            <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              <div className="py-1.5">My Bookings</div>
            </NavLink>
          )}
          <div className="pt-2">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="w-full">
                  Sign in
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
