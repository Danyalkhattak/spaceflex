import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/react";
import { useEnsureUser } from "../../hooks/useEnsureUser.js";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";

const navLinks = [
  { to: "/enterprise-office", label: "Enterprise Office Leasing" },
];

export default function Navbar() {
  const { isSignedIn } = useUser();
  const { isAdmin } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  useEnsureUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-brand-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-900 text-sm font-bold text-white">
            SF
          </span>
          SpaceFlex
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-900" : "text-slate-600 hover:bg-slate-50 hover:text-brand-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isSignedIn && (
            <NavLink
              to="/my-inquiries"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-900" : "text-slate-600 hover:bg-slate-50 hover:text-brand-900"
                }`
              }
            >
              My Inquiries
            </NavLink>
          )}
          {isSignedIn && isAdmin && (
            <NavLink
              to="/admin/inquiries"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-900" : "text-slate-600 hover:bg-slate-50 hover:text-brand-900"
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isSignedIn ? (
            <>
              <UserButton />
              <SignOutButton>
                <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-900">
                  Sign out
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-md bg-brand-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800">
                Sign in
              </button>
            </SignInButton>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </NavLink>
            ))}
            {isSignedIn && (
              <NavLink
                to="/my-inquiries"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Inquiries
              </NavLink>
            )}
            {isSignedIn && isAdmin && (
              <NavLink
                to="/admin/inquiries"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Admin
              </NavLink>
            )}
            <div className="mt-2 border-t border-slate-100 pt-3">
              {isSignedIn ? (
                <div className="flex items-center justify-between">
                  <UserButton />
                  <SignOutButton>
                    <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-600">Sign out</button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full rounded-md bg-brand-900 px-4 py-2 text-sm font-semibold text-white">
                    Sign in
                  </button>
                </SignInButton>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
