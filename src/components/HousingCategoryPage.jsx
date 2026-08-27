import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import HousingCard from "../features/housing/HousingCard.jsx";
import HousingFilters from "../features/housing/HousingFilters.jsx";
import { EmptyState } from "./ui/EmptyState.jsx";
import Button from "./ui/Button.jsx";

const DEFAULT_FILTERS = {
  query: "",
  city: "",
  maxPrice: "",
  sortBy: "newest",
};

const PAGE_SIZE = 9;

/**
 * Generic housing category page (hero, intro, search/filter/sort, paginated
 * property grid), driven by housingMeta.js's HOUSING_CATEGORIES config.
 * Shared by the three named sub-pages (IT hostels, studio apartments,
 * corporate guest houses) so the page markup and pagination logic aren't
 * duplicated three times - same pattern as EnterpriseCategoryPage.jsx.
 *
 * Unlike EnterpriseCategoryPage, housing listings are instantly bookable
 * (isBookable: true in seed.ts), so this links straight to each property's
 * detail page with a BookingForm rather than opening an inquiry form here.
 */
export default function HousingCategoryPage({ config }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [cursorStack, setCursorStack] = useState([null]); // history of page-start cursors
  const [pageIndex, setPageIndex] = useState(0);

  // Any filter change starts the listing over from page 1, in the same
  // render pass as the filter update (not a useEffect keyed on the fields).
  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);
    setCursorStack([null]);
    setPageIndex(0);
  }

  const args = {
    propertyType: config.propertyType,
    query: filters.query || undefined,
    city: filters.city || undefined,
    maxPrice: filters.maxPrice === "" ? undefined : Number(filters.maxPrice),
    sortBy: filters.sortBy,
    pageSize: PAGE_SIZE,
    cursor: cursorStack[pageIndex] ?? undefined,
  };

  const result = useQuery(api.search.queries.searchProperties, args);
  const isLoading = result === undefined;
  const items = result?.items ?? [];
  const hasMore = result?.hasMore ?? false;

  const cities = Array.from(new Set(items.map((p) => p.city))).sort();

  function goNext() {
    if (!result?.continueCursor) return;
    setCursorStack((stack) => {
      const next = stack.slice(0, pageIndex + 1);
      next.push(result.continueCursor);
      return next;
    });
    setPageIndex((i) => i + 1);
  }

  function goPrevious() {
    setPageIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            {config.heroEyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            {config.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">{config.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-slate-600">{config.intro}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {config.highlightAmenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <HousingFilters filters={filters} onChange={handleFiltersChange} cities={cities} />
        </div>

        <div className="mt-8">
          {isLoading && <PropertyGridSkeleton />}

          {!isLoading && items.length === 0 && (
            <EmptyState
              title="No properties match those filters"
              message="Try clearing a filter or broadening your search."
              action={
                <Button variant="secondary" onClick={() => handleFiltersChange(DEFAULT_FILTERS)}>
                  Clear filters
                </Button>
              }
            />
          )}

          {!isLoading && items.length > 0 && (
            <>
              <p className="text-sm text-slate-500 mb-4">
                {items.length} propert{items.length !== 1 ? "ies" : "y"} found
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((property) => (
                  <HousingCard key={property._id} property={property} />
                ))}
              </div>

              {(pageIndex > 0 || hasMore) && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={pageIndex === 0}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-500">Page {pageIndex + 1}</span>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasMore}
                    className="rounded-md border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] bg-slate-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
