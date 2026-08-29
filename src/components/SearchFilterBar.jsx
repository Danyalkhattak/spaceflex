import { useRef, useState } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export default function SearchFilterBar({ filters, onChange }) {
  const [queryDraft, setQueryDraft] = useState(filters.query ?? "");
  const debounceRef = useRef(null);

  function handleQueryInput(value) {
    setQueryDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Debounce keyword search so we don't fire a Convex search query on
    // every keystroke - this is the "avoid unnecessary API calls" path.
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, query: value });
    }, 400);
  }

  function handleField(field, value) {
    onChange({ ...filters, [field]: value });
  }

  function handleClear() {
    // Cancel any pending debounced query first - otherwise a timer fired
    // after Clear would re-apply the pre-clear text with a stale filters
    // snapshot (the type-then-clear-within-400ms race).
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
    setQueryDraft("");
    onChange({ query: "", city: "", minPrice: "", maxPrice: "", minCapacity: "", sortBy: "newest" });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label htmlFor="ef-query" className="mb-1 block text-xs font-medium text-slate-500">
            Search
          </label>
          <input
            id="ef-query"
            type="text"
            value={queryDraft}
            onChange={(e) => handleQueryInput(e.target.value)}
            placeholder="Title, location, amenities…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="ef-city" className="mb-1 block text-xs font-medium text-slate-500">
            City
          </label>
          <input
            id="ef-city"
            type="text"
            value={filters.city ?? ""}
            onChange={(e) => handleField("city", e.target.value)}
            placeholder="e.g. Lahore"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="ef-min-price" className="mb-1 block text-xs font-medium text-slate-500">
            Min price
          </label>
          <input
            id="ef-min-price"
            type="number"
            min="0"
            value={filters.minPrice ?? ""}
            onChange={(e) => handleField("minPrice", e.target.value)}
            placeholder="Any"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="ef-max-price" className="mb-1 block text-xs font-medium text-slate-500">
            Max price
          </label>
          <input
            id="ef-max-price"
            type="number"
            min="0"
            value={filters.maxPrice ?? ""}
            onChange={(e) => handleField("maxPrice", e.target.value)}
            placeholder="Any"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="ef-sort" className="mb-1 block text-xs font-medium text-slate-500">
            Sort by
          </label>
          <select
            id="ef-sort"
            value={filters.sortBy ?? "newest"}
            onChange={(e) => handleField("sortBy", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="ef-capacity" className="text-xs font-medium text-slate-500">
            Min capacity
          </label>
          <input
            id="ef-capacity"
            type="number"
            min="0"
            value={filters.minCapacity ?? ""}
            onChange={(e) => handleField("minCapacity", e.target.value)}
            placeholder="Any"
            className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto text-sm font-medium text-brand-800 hover:underline"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
