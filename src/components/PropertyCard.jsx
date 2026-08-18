import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice, titleCase } from "../lib/format.js";

export default function PropertyCard({ property }) {
  const primaryImage = useQuery(api.properties.images.getPrimaryPropertyImage, {
    propertyId: property._id,
  });

  return (
    <Link
      to={`/enterprise-office/property/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-50">
        {primaryImage?.secureUrl ? (
          <img
            src={primaryImage.secureUrl}
            alt={primaryImage.altText || property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {property.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-bronze-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">
            {titleCase(property.propertyType)}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-brand-950 line-clamp-2">
            {property.title}
          </h3>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {property.area}, {property.city}
        </p>

        {property.capacity ? (
          <p className="text-sm text-slate-500">Capacity: up to {property.capacity} people</p>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="font-mono text-sm font-semibold text-brand-900">
            {formatPrice(property.price, property.currency, property.pricePeriod)}
          </span>
          <span className="text-sm font-medium text-brand-800 group-hover:underline">View details →</span>
        </div>
      </div>
    </Link>
  );
}
