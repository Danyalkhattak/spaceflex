import { Link, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import InquiryForm from "../../components/InquiryForm.jsx";
import { formatPrice, titleCase } from "../../lib/format.js";
import { ENTERPRISE_CATEGORY_LIST } from "../../data/enterpriseConfig.js";

export default function PropertyDetail() {
  const { slug } = useParams();
  const property = useQuery(api.properties.queries.getPropertyBySlug, { slug });
  const images = useQuery(
    api.properties.images.getPropertyImages,
    property ? { propertyId: property._id } : "skip"
  );

  if (property === undefined) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-72 rounded-xl bg-slate-100" />
          <div className="h-6 w-1/2 rounded bg-slate-100" />
          <div className="h-4 w-1/3 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (property === null || property.category !== "office") {
    // Mirrors the CoworkingDetailPage / housing PropertyDetail guards: an
    // enterprise URL must never render a property from another pillar
    // (with the wrong inquiry form and breadcrumb context).
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Property not found</h1>
        <p className="mt-2 text-slate-600">This listing may have been removed or the link is incorrect.</p>
        <Link to="/enterprise-office" className="mt-4 inline-block text-brand-800 underline">
          Back to Enterprise Office Leasing
        </Link>
      </div>
    );
  }

  const categoryConfig = ENTERPRISE_CATEGORY_LIST.find((c) => c.propertyType === property.propertyType);
  const gallery = images ?? [];
  const primary = gallery.find((img) => img.isPrimary) ?? gallery[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/enterprise-office" className="hover:text-brand-800">
          Enterprise Office Leasing
        </Link>
        {categoryConfig && (
          <>
            {" / "}
            <Link to={`/enterprise-office/${categoryConfig.slug}`} className="hover:text-brand-800">
              {categoryConfig.navLabel}
            </Link>
          </>
        )}
      </nav>

      {!property.isActive && (
        <div className="mb-4 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">
          This listing is currently unavailable. You can still view its details below.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-brand-50">
            {primary?.secureUrl ? (
              <img
                src={primary.secureUrl}
                alt={primary.altText || property.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-400">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {gallery.map((img) => (
                <div key={img._id} className="aspect-square overflow-hidden rounded-lg bg-brand-50">
                  <img
                    src={img.secureUrl}
                    alt={img.altText || property.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-400">
            {titleCase(property.propertyType)}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-brand-950">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-slate-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {property.address}, {property.area}, {property.city}, {property.province}
          </p>

          <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-700">{property.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
            <Stat label="Price" value={formatPrice(property.price, property.currency, property.pricePeriod)} />
            {property.capacity ? <Stat label="Capacity" value={`${property.capacity} people`} /> : null}
            <Stat label="Availability" value={property.isActive ? "Available" : "Currently unavailable"} />
          </dl>

          {property.amenities.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-brand-950">Amenities & Features</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand-800">
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <InquiryForm propertyId={property._id} propertyTitle={property.title} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-semibold text-brand-950">{value}</dd>
    </div>
  );
}
