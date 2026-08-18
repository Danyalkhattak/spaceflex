import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} SpaceFlex. Coworking spaces &amp; desk rentals.
      </p>
      <div className="flex items-center gap-6 text-sm text-slate-500">
        <Link to="/coworking" className="hover:text-slate-900">
          Coworking Spaces
        </Link>
        <Link to="/my-bookings" className="hover:text-slate-900">
          My Bookings
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
