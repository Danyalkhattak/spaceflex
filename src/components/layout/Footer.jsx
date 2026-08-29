import { Link } from "react-router-dom";
import Icon from "../ui/Icon.jsx";

const FOOTER_COLS = [
  {
    title: "Coworking Spaces",
    links: [
      { to: "/coworking", label: "Browse Coworking Spaces" },
      { to: "/coworking?type=shared_desk", label: "Shared Desks" },
      { to: "/coworking?type=private_cabin", label: "Private Cabins" },
      { to: "/coworking?type=night_shift_coworking", label: "24/7 Night-Shift" },
    ],
  },
  {
    title: "Enterprise Leasing",
    links: [
      { to: "/enterprise-office", label: "Office Hub" },
      { to: "/enterprise-office/commercial-office-floors", label: "Commercial Office Floors" },
      { to: "/enterprise-office/it-park-tech-space", label: "IT Park & Tech Space" },
      { to: "/enterprise-office/corporate-hq", label: "Corporate HQ Leasing" },
    ],
  },
  {
    title: "Housing & Account",
    links: [
      { to: "/housing", label: "Executive Housing Hub" },
      { to: "/housing/it-hostels-g11-islamabad", label: "IT Hostels" },
      { to: "/housing/studio-apartments-for-pros", label: "Studio Apartments" },
      { to: "/my-bookings", label: "My Bookings" },
      { to: "/my-inquiries", label: "My Inquiries" },
    ],
  },
];

const Footer = () => (
  <footer className="bg-brand-950 text-slate-300 relative overflow-hidden">
    {/* Gradient hairline + faint blueprint texture */}
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bronze-500/70 to-transparent" />
    <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" />

    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr] md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-bronze-400 to-bronze-600 text-brand-950">
              <Icon name="building" className="w-4 h-4" />
            </span>
            SpaceFlex
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
            Coworking desks, enterprise office floors, and executive housing — one portal to
            browse, compare, and book workspaces across Pakistan.
          </p>
          <div className="mt-5 space-y-2.5 text-sm text-slate-400">
            <p className="flex items-center gap-2.5">
              <Icon name="mail" className="w-4 h-4 text-bronze-400 shrink-0" />
              leasing@spaceflex.example
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="phone" className="w-4 h-4 text-bronze-400 shrink-0" />
              +92 (0) 300 000 0000
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="clock" className="w-4 h-4 text-bronze-400 shrink-0" />
              Support available 24/7 for night-shift teams
            </p>
          </div>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-bronze-300">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} SpaceFlex Portal. Demo data for evaluation purposes.</p>
        <p className="flex items-center gap-1.5">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-bronze-500" />
          Flexible workspaces, booked in minutes.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
