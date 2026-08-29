import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice, titleCase } from "../lib/format.js";

/**
 * `primaryImage` is optional: pass it down from a batched
 * getPrimaryImagesForProperties lookup when rendering a grid of cards (see
 * EnterpriseCategoryPage.jsx) to avoid firing one image query per card.
 * When omitted, this falls back to fetching its own image so the card
 * still works standalone (e.g. a single featured-property card).
 */
export default function PropertyCard({ property, primaryImage: primaryImageProp }) {
  const shouldFetchOwnImage = primaryImageProp === undefined;
  const fetchedImage = useQuery(
    api.properties.images.getPrimaryPropertyImage,
    shouldFetchOwnImage ? { propertyId: property._id } : "skip"
  );
  const primaryImage = shouldFetchOwnImage ? fetchedImage : primaryImageProp;

  return (
    <Link
      to={`/enterprise-office/property/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-brand-200"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-50">
        {primaryImage?.secureUrl ? (
          <img
            src={primaryImage.secureUrl}
            alt={primaryImage.altText || property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />
        {property.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            ★ Featured
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
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-800">
            View details
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
