import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">SpaceFlex Portal</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-brand-950 sm:text-5xl">
        Commercial real estate, leased end to end.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-600">
        Coworking, enterprise offices, virtual addresses, event venues, and corporate housing - all in one portal.
      </p>
      <Link
        to="/enterprise-office"
        className="mt-8 inline-block rounded-md bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
      >
        Browse Enterprise Office Leasing
      </Link>
    </div>
  );
}
