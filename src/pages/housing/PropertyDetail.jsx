import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Gallery from "../../features/housing/Gallery.jsx";
import AmenitiesList from "../../features/housing/AmenitiesList.jsx";
import BookingForm from "../../features/housing/BookingForm.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Icon from "../../components/ui/Icon.jsx";
import LoadingState from "../../components/ui/Spinner.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatPrice } from "../../utils/format.js";
import { HOUSING_TYPE_LABEL } from "../../features/housing/housingMeta.js";

const PropertyDetail = () => {
  const { slug } = useParams();
  const property = useQuery(api.properties.queries.getPropertyBySlug, { slug });
  const images = useQuery(
    api.properties.images.getPropertyImages,
    property ? { propertyId: property._id } : "skip"
  );

  if (property === undefined) {
    return <LoadingState label="Loading property details…" />;
  }

  if (property === null || property.category !== "housing") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon="building"
          title="Housing listing not found"
          message="This listing may have been removed or is no longer active."
          action={
            <Button as={Link} to="/housing" variant="secondary">
              Back to Housing
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/housing"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-5"
      >
        <Icon name="chevronLeft" className="w-4 h-4" />
        Back to Housing
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Gallery images={images} title={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge tone="blue">{HOUSING_TYPE_LABEL[property.propertyType]}</Badge>
              {!property.isActive && <Badge tone="red">Currently unavailable</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-slate-500 mt-2">
              <Icon name="location" className="w-4 h-4" />
              {property.address}, {property.area}, {property.city}, {property.province}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 py-4 border-y border-slate-200">
            <div>
              <p className="text-xs text-slate-400">Price</p>
              <p className="font-semibold text-slate-900">
                {formatPrice(property.price, property.currency, property.pricePeriod)}
              </p>
            </div>
            {property.capacity !== undefined && (
              <div>
                <p className="text-xs text-slate-400">Capacity</p>
                <p className="font-semibold text-slate-900 flex items-center gap-1">
                  <Icon name="users2" className="w-4 h-4" />
                  {property.capacity} occupants
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400">Booking</p>
              <p className="font-semibold text-slate-900">
                {property.isBookable ? "Instant booking" : "By inquiry"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">About this property</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Amenities</h2>
            <AmenitiesList amenities={property.amenities} />
          </div>

          {property.features?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <Badge key={f} tone="slate">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            {property.isBookable ? (
              <BookingForm property={property} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-500">
                  This property isn't available for instant booking. Please contact SpaceFlex to
                  inquire.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
