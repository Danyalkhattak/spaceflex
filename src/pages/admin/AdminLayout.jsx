import { Link, NavLink, Outlet } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/react";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import LoadingState from "../../components/ui/Spinner.jsx";
import Icon from "../../components/ui/Icon.jsx";

/**
 * Shared shell for every /admin route. Gates rendering on a verified admin
 * profile (the server still enforces requireAdmin on every query/mutation -
 * this gate is purely so admins see a sensible UI instead of raw errors).
 */
const NAV_ITEMS = [
  { to: "/admin", end: true, label: "Dashboard", icon: "building" },
  { to: "/admin/properties", label: "Properties", icon: "location" },
  { to: "/admin/bookings", label: "Bookings", icon: "calendar" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "search" },
  { to: "/admin/users", label: "Users", icon: "users" },
];

const AdminLayout = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { profile, isLoading: profileLoading, isAdmin } = useCurrentUser();

  if (!isLoaded || (isSignedIn && profileLoading)) {
    return <LoadingState label="Checking your access…" />;
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Admin sign-in required</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with an administrator account to manage SpaceFlex.
        </p>
        <SignInButton mode="modal">
          <button className="mt-5 rounded-md bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
            Sign in
          </button>
        </SignInButton>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Admins only</h1>
        <p className="mt-2 text-sm text-slate-600">
          This area is restricted to SpaceFlex administrators. If you believe you should have
          access, ask an existing admin to promote your account
          (admin/permissions:promoteToAdmin).
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-100">
            <Icon name="shield" className="w-3.5 h-3.5" />
            Admin console
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brand-950 tracking-tight">
            SpaceFlex Admin
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Signed in as <span className="font-medium text-brand-900">{profile?.name}</span> ({profile?.email})
          </p>
        </div>
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-900 transition-colors shrink-0"
        >
          <Icon name="arrowUpRight" className="w-4 h-4" />
          View live site
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr]">
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0 lg:p-2 lg:bg-white lg:rounded-2xl lg:border lg:border-slate-200/80 lg:shadow-soft">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-brand-50 hover:text-brand-900"
                    }`
                  }
                >
                  <Icon name={item.icon} className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
