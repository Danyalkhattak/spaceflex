import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PropertyCard from "./PropertyCard.jsx";
import SearchFilterBar from "./SearchFilterBar.jsx";
import InquiryForm from "./InquiryForm.jsx";

const DEFAULT_FILTERS = {
  query: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  minCapacity: "",
  sortBy: "newest",
};

const PAGE_SIZE = 9;

/**
 * Generic enterprise-office category page (hero, intro, search/filter/sort,
 * paginated property grid, general inquiry CTA), driven by enterpriseConfig.js.
 * Shared by CommercialOfficeFloors/ITParkTechSpace/CorporateHQLeasing so the
 * page markup and pagination logic aren't duplicated three times.
 *
 * Pagination uses a cursor stack (Previous/Next) rather than the built-in
 * `usePaginatedQuery` hook, because the existing `searchProperties` query
 * (search/queries.ts) already defines its own cursor/pageSize contract
 * (documented in README.md) - reusing it as-is instead of changing its
 * signature to match the built-in hook's PaginationOptions convention.
 */
export default function EnterpriseCategoryPage({ config }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showGeneralInquiry, setShowGeneralInquiry] = useState(false);
  const [cursorStack, setCursorStack] = useState([null]); // history of page-start cursors
  const [pageIndex, setPageIndex] = useState(0);

  // Any filter change starts the listing over from page 1. Done here in the
  // event handler (not a useEffect keyed on the filter fields) so the reset
  // and the filter update land in a single render pass.
  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);
    setCursorStack([null]);
    setPageIndex(0);
  }

  const args = {
    propertyType: config.propertyType,
    query: filters.query || undefined,
    city: filters.city || undefined,
    minPrice: filters.minPrice === "" ? undefined : Number(filters.minPrice),
    maxPrice: filters.maxPrice === "" ? undefined : Number(filters.maxPrice),
    minCapacity: filters.minCapacity === "" ? undefined : Number(filters.minCapacity),
    sortBy: filters.sortBy,
    pageSize: PAGE_SIZE,
    cursor: cursorStack[pageIndex] ?? undefined,
  };

  const result = useQuery(api.search.queries.searchProperties, args);
  const isLoading = result === undefined;
  const items = result?.items ?? [];
  const hasMore = result?.hasMore ?? false;

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
      <section className="blueprint-grid relative overflow-hidden bg-brand-950 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-bronze-500">{config.heroEyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {config.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">{config.heroSubtitle}</p>
          <button
            type="button"
            onClick={() => setShowGeneralInquiry(true)}
            className="mt-6 rounded-md bg-bronze-500 px-5 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-bronze-600"
          >
            Talk to the leasing team
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-slate-600">{config.intro}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {config.highlightAmenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <SearchFilterBar filters={filters} onChange={handleFiltersChange} />
        </div>

        <div className="mt-8">
          {isLoading && <PropertyGridSkeleton />}

          {!isLoading && items.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium text-slate-700">No properties match those filters.</p>
              <p className="mt-1 text-sm text-slate-500">Try clearing a filter or broadening your search.</p>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((property) => (
                  <PropertyCard key={property._id} property={property} />
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
                    className="rounded-md border border-brand-800 px-4 py-2 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {showGeneralInquiry && (
          <div className="mx-auto mt-10 max-w-xl" id="general-inquiry">
            {/* propertyId intentionally omitted - createInquiry's propertyId is
                optional (inquiries/mutations.ts), so this reuses the exact same
                mutation as a per-property inquiry instead of a parallel path. */}
            <InquiryForm propertyTitle={config.heroTitle} />
          </div>
        )}
      </section>
    </div>
  );
}

function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="aspect-[16/10] bg-slate-100" />
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
