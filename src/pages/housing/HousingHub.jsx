import { Link } from "react-router-dom";
import { HOUSING_CATEGORY_LIST } from "../../features/housing/housingMeta.js";

export default function HousingHub() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">SpaceFlex Housing</p>
          <h1 className="mt-3 max-w-2xl text-3xl sm:text-4xl font-bold tracking-tight sm:text-5xl">
            Executive Hostels &amp; Corporate Housing
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            From shared IT hostels to private studio apartments and managed guest houses - browse
            SpaceFlex housing and book a room instantly, no waiting on a callback.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOUSING_CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.slug}
              to={`/housing/${cat.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-900">{cat.navLabel}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{cat.heroSubtitle}</p>
              <span className="mt-4 text-sm font-medium text-slate-900 group-hover:underline">
                Browse & book →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
