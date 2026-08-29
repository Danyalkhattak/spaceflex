import Icon from "../../components/ui/Icon.jsx";
import { COWORKING_PROPERTY_TYPES } from "./coworkingMeta.js";

const CoworkingFilters = ({ filters, onChange, cities }) => {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="relative">
        <Icon
          name="search"
          className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Search coworking spaces by name, area, or city…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          value={filters.propertyType}
          onChange={(e) => set({ propertyType: e.target.value })}
          className="rounded-xl border border-slate-300 text-sm px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="">All plan types</option>
          {COWORKING_PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={filters.city}
          onChange={(e) => set({ city: e.target.value })}
          className="rounded-xl border border-slate-300 text-sm px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: e.target.value })}
          placeholder="Max price"
          className="rounded-xl border border-slate-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />

        <select
          value={filters.sortBy}
          onChange={(e) => set({ sortBy: e.target.value })}
          className="rounded-xl border border-slate-300 text-sm px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default CoworkingFilters;
