import { Link } from "react-router-dom";
import { ENTERPRISE_CATEGORY_LIST } from "../../data/enterpriseConfig.js";

export default function EnterpriseOfficeHub() {
  return (
    <div>
      <section className="blueprint-grid relative overflow-hidden bg-brand-950 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-bronze-500">SpaceFlex Enterprise</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl font-semibold leading-tight sm:text-5xl">
            Enterprise Office Space Leasing
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            From a single fitted office floor to a full corporate headquarters - browse enterprise-grade office
            space and lease it directly through our leasing team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ENTERPRISE_CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.slug}
              to={`/enterprise-office/${cat.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="font-display text-xl font-semibold text-brand-950">{cat.navLabel}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{cat.heroSubtitle}</p>
              <span className="mt-4 text-sm font-medium text-brand-800 group-hover:underline">
                Browse listings →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
