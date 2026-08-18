import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CoworkingCard from "../features/coworking/CoworkingCard.jsx";
import CoworkingFilters from "../features/coworking/CoworkingFilters.jsx";
import LoadingState from "../components/ui/Spinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";

const DEFAULT_FILTERS = {
  query: "",
  propertyType: "",
  city: "",
  maxPrice: "",
  sortBy: "newest",
};

// Known SpaceFlex coworking cities, kept as a static fallback list so the
// city dropdown is populated even before any results load.
const FALLBACK_CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi"];

const CoworkingListPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    propertyType: searchParams.get("type") ?? "",
  }));

  const args = useMemo(
    () => ({
      category: "coworking",
      query: filters.query.trim() || undefined,
      propertyType: filters.propertyType || undefined,
      city: filters.city || undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      sortBy: filters.sortBy,
      pageSize: 24,
    }),
    [filters]
  );

  const result = useQuery(api.search.queries.searchProperties, args);
  const isLoading = result === undefined;

  const cities = useMemo(() => {
    if (!result?.items?.length) return FALLBACK_CITIES;
    return Array.from(new Set(result.items.map((p) => p.city))).sort();
  }, [result]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Coworking Spaces &amp; Desk Rentals
        </h1>
        <p className="mt-2 text-slate-500 max-w-2xl">
          Shared desk subscriptions, private cabins for startups, and 24/7 night-shift
          coworking floors — browse and book instantly.
        </p>
      </div>

      <CoworkingFilters filters={filters} onChange={setFilters} cities={cities} />

      <div className="mt-6">
        {isLoading && <LoadingState label="Loading coworking spaces…" />}

        {!isLoading && result && result.items.length === 0 && (
          <EmptyState
            title="No coworking spaces match your filters"
            message="Try widening your search or clearing a filter."
            action={
              <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </Button>
            }
          />
        )}

        {!isLoading && result && result.items.length > 0 && (
          <>
            <p className="text-sm text-slate-500 mb-4">
              {result.items.length} space{result.items.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.items.map((property) => (
                <CoworkingCard key={property._id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoworkingListPage;
