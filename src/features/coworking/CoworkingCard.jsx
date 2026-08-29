import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Badge from "../../components/ui/Badge.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatPrice } from "../../lib/format.js";
import { COWORKING_TYPE_SHORT_LABEL } from "./coworkingMeta.js";

const TYPE_TONE = {
  shared_desk: "blue",
  private_cabin: "violet",
  night_shift_coworking: "amber",
};

const CoworkingCard = ({ property }) => {
  const primaryImage = useQuery(api.properties.images.getPrimaryPropertyImage, {
    propertyId: property._id,
  });

  return (
    <Link
      to={`/coworking/${property.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-1 hover:border-brand-200"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {primaryImage?.secureUrl ? (
          <img
            src={primaryImage.secureUrl}
            alt={primaryImage.altText || property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Icon name="building" className="w-10 h-10" />
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />
        <div className="absolute top-3 left-3">
          <Badge tone={TYPE_TONE[property.propertyType] ?? "slate"}>
            {COWORKING_TYPE_SHORT_LABEL[property.propertyType] ?? property.propertyType}
          </Badge>
        </div>
        {property.propertyType === "night_shift_coworking" && (
          <div className="absolute top-3 right-3">
            <Badge tone="dark">
              <Icon name="moon" className="w-3 h-3" /> 24/7
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-slate-900 leading-snug line-clamp-1">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-sm text-slate-500 line-clamp-1">
          <Icon name="location" className="w-4 h-4 shrink-0" />
          {property.area}, {property.city}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {property.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5"
            >
              {a}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {formatPrice(property.price, property.currency, property.pricePeriod)}
            </p>
            {property.capacity !== undefined && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Icon name="users2" className="w-3.5 h-3.5" />
                Capacity: {property.capacity}
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-900">
            View details
            <Icon
              name="arrowRight"
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CoworkingCard;
