import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Badge from "../../components/ui/Badge.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatPrice } from "../../lib/format.js";
import { HOUSING_TYPE_SHORT_LABEL } from "./housingMeta.js";

const TYPE_TONE = {
  it_hostel: "blue",
  studio_apartment: "violet",
  corporate_guest_house: "amber",
};

const HousingCard = ({ property }) => {
  const primaryImage = useQuery(api.properties.images.getPrimaryPropertyImage, {
    propertyId: property._id,
  });

  return (
    <Link
      to={`/housing/property/${property.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {primaryImage?.secureUrl ? (
          <img
            src={primaryImage.secureUrl}
            alt={primaryImage.altText || property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Icon name="building" className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge tone={TYPE_TONE[property.propertyType] ?? "slate"}>
            {HOUSING_TYPE_SHORT_LABEL[property.propertyType] ?? property.propertyType}
          </Badge>
        </div>
        {!property.isBookable && (
          <div className="absolute top-3 right-3">
            <Badge tone="dark">By inquiry</Badge>
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
          <span className="text-sm font-medium text-slate-900 group-hover:underline">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HousingCard;
