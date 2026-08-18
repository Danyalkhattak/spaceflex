import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-brand-950 text-slate-300">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-brand-950">
              SF
            </span>
            SpaceFlex
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Commercial real estate and coworking, leased end to end.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Coworking Spaces
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/coworking" className="hover:text-white">
                Browse Coworking Spaces
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className="hover:text-white">
                My Bookings
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Enterprise Office Leasing
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/enterprise-office/commercial-office-floors" className="hover:text-white">
                Commercial Office Floors
              </Link>
            </li>
            <li>
              <Link to="/enterprise-office/it-park-tech-space" className="hover:text-white">
                IT Park &amp; Tech Space
              </Link>
            </li>
            <li>
              <Link to="/enterprise-office/corporate-hq" className="hover:text-white">
                Corporate HQ Leasing
              </Link>
            </li>
            <li>
              <Link to="/my-inquiries" className="hover:text-white">
                My Inquiries
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
          <p className="mt-3 text-sm text-slate-400">
            Leasing and coworking team available for site visits and booking support.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} SpaceFlex Portal. Demo data for evaluation purposes.
      </div>
    </div>
  </footer>
);

export default Footer;
