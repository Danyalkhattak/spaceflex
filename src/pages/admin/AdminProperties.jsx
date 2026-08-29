import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import LoadingState from "../../components/ui/Spinner.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { getErrorMessage } from "../../utils/errors.js";
import { formatPrice, titleCase } from "../../lib/format.js";
import { CATEGORY_OPTIONS } from "./adminMeta.js";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const AdminProperties = () => {
  const properties = useQuery(api.properties.queries.adminGetAllProperties, {});
  const imagesByProperty = useQuery(
    api.properties.images.getPrimaryImagesForProperties,
    properties && properties.length > 0
      ? { propertyIds: properties.map((p) => p._id) }
      : "skip"
  );

  const setFeatured = useMutation(api.properties.mutations.setFeaturedProperty);
  const deactivate = useMutation(api.properties.mutations.deactivateProperty);
  const reactivate = useMutation(api.properties.mutations.reactivateProperty);
  const removeProperty = useMutation(api.properties.mutations.deleteProperty);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtered = useMemo(() => {
    if (!properties) return [];
    const needle = search.trim().toLowerCase();
    return properties.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "inactive" && p.isActive) return false;
      if (needle) {
        const haystack = `${p.title} ${p.city} ${p.area} ${p.slug}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [properties, search, categoryFilter, statusFilter]);

  async function runMutation(propertyId, mutationFn, args) {
    setError("");
    setBusyId(propertyId);
    try {
      await mutationFn(args);
      setConfirmDeleteId(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  if (properties === undefined) {
    return <LoadingState label="Loading properties…" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Properties</h2>
          <p className="text-sm text-slate-500">
            {properties.length} total · {filtered.length} shown — create, edit, feature,
            deactivate, and delete listings.
          </p>
        </div>
        <Button as={Link} to="/admin/properties/new">
          + New property
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, city, area…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="building"
          title="No properties match"
          message="Adjust the filters above, or create a new property."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((property) => {
            const image = imagesByProperty?.[property._id];
            const busy = busyId === property._id;
            const confirmingDelete = confirmDeleteId === property._id;
            return (
              <div
                key={property._id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {image?.secureUrl ? (
                      <img
                        src={image.secureUrl}
                        alt={image.altText || property.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/admin/properties/${property._id}/edit`}
                        className="font-semibold text-slate-900 hover:underline"
                      >
                        {property.title}
                      </Link>
                      <Badge tone={property.isActive ? "green" : "red"} className="capitalize">
                        {property.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {property.isFeatured && <Badge tone="violet">Featured</Badge>}
                      <Badge tone={property.isBookable ? "blue" : "slate"}>
                        {property.isBookable ? "Instant booking" : "Inquiry only"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {titleCase(property.category)} · {titleCase(property.propertyType)} ·{" "}
                      {property.area}, {property.city}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-700">
                      {formatPrice(property.price, property.currency, property.pricePeriod)}
                      {property.capacity !== undefined ? ` · capacity ${property.capacity}` : ""}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400 break-all">/{property.slug}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      as={Link}
                      to={`/admin/properties/${property._id}/edit`}
                      variant="secondary"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        runMutation(property._id, setFeatured, {
                          propertyId: property._id,
                          isFeatured: !property.isFeatured,
                        })
                      }
                    >
                      {property.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                    {property.isActive ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          runMutation(property._id, deactivate, { propertyId: property._id })
                        }
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          runMutation(property._id, reactivate, { propertyId: property._id })
                        }
                      >
                        Reactivate
                      </Button>
                    )}
                    {confirmingDelete ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="danger"
                          size="sm"
                          loading={busy}
                          onClick={() =>
                            runMutation(property._id, removeProperty, {
                              propertyId: property._id,
                            })
                          }
                        >
                          Confirm delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Keep
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmDeleteId(property._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
