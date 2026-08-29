import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import LoadingState from "../../components/ui/Spinner.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { getErrorMessage } from "../../utils/errors.js";
import {
  CATEGORY_OPTIONS,
  PRICE_PERIOD_OPTIONS,
  propertyTypesFor,
} from "./adminMeta.js";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryUploadConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "coworking",
  propertyType: "shared_desk",
  subCategory: "",
  country: "Pakistan",
  province: "",
  city: "",
  area: "",
  address: "",
  latitude: "",
  longitude: "",
  price: "",
  currency: "PKR",
  pricePeriod: "month",
  capacity: "",
  amenities: "",
  features: "",
  isBookable: true,
};

function hydrateFormFromProperty(property) {
  return {
    title: property.title ?? "",
    description: property.description ?? "",
    category: property.category ?? "coworking",
    propertyType: property.propertyType ?? "shared_desk",
    subCategory: property.subCategory ?? "",
    country: property.country ?? "Pakistan",
    province: property.province ?? "",
    city: property.city ?? "",
    area: property.area ?? "",
    address: property.address ?? "",
    latitude: property.latitude !== undefined ? String(property.latitude) : "",
    longitude: property.longitude !== undefined ? String(property.longitude) : "",
    price: String(property.price ?? ""),
    currency: property.currency ?? "PKR",
    pricePeriod: property.pricePeriod ?? "month",
    capacity: property.capacity !== undefined ? String(property.capacity) : "",
    amenities: (property.amenities ?? []).join(", "),
    features: (property.features ?? []).join(", "),
    isBookable: property.isBookable ?? false,
  };
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function optionalNumber(value) {
  const trimmed = String(value).trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const AdminPropertyForm = () => {
  const { propertyId } = useParams();
  const isEditMode = Boolean(propertyId);
  const navigate = useNavigate();

  const property = useQuery(
    api.properties.queries.getPropertyById,
    isEditMode ? { propertyId } : "skip"
  );
  const images = useQuery(
    api.properties.images.getPropertyImages,
    isEditMode && property ? { propertyId: property._id } : "skip"
  );

  const createProperty = useMutation(api.properties.mutations.createProperty);
  const updateProperty = useMutation(api.properties.mutations.updateProperty);
  const addImage = useMutation(api.properties.images.addPropertyImage);
  const removeImage = useMutation(api.properties.images.removePropertyImage);
  const setPrimaryImage = useMutation(api.properties.images.setPrimaryImage);

  const [form, setForm] = useState(EMPTY_FORM);
  const [hydratedFor, setHydratedFor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  // Hydrate the form once per loaded property (not on every re-render);
  // re-hydrates if the route navigates to a different property. Uses the
  // React-recommended "adjust state during render" pattern (comparing
  // against the previous render) instead of an effect.
  if (isEditMode && property && hydratedFor !== property._id) {
    setHydratedFor(property._id);
    setForm(hydrateFormFromProperty(property));
  }

  const setField = (field, value) => {
    setForm((prev) => {
      if (field === "category") {
        const validTypes = propertyTypesFor(value);
        const currentStillValid = validTypes.some((t) => t.value === prev.propertyType);
        return {
          ...prev,
          category: value,
          propertyType: currentStillValid ? prev.propertyType : validTypes[0]?.value ?? "",
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (form.title.length > 150) return "Title cannot exceed 150 characters.";
    if (!form.description.trim()) return "Description is required.";
    if (form.description.length > 5000) return "Description cannot exceed 5000 characters.";
    if (!form.propertyType) return "Property type is required.";
    if (!form.country.trim()) return "Country is required.";
    if (!form.province.trim()) return "Province is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.area.trim()) return "Area is required.";
    if (!form.address.trim()) return "Address is required.";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return "Price must be a positive number.";
    if (!form.currency.trim()) return "Currency is required.";
    const capacity = optionalNumber(form.capacity);
    if (capacity !== undefined && capacity < 0) return "Capacity cannot be negative.";
    const lat = optionalNumber(form.latitude);
    const lng = optionalNumber(form.longitude);
    if (lat !== undefined && (lat < -90 || lat > 90)) return "Latitude must be between -90 and 90.";
    if (lng !== undefined && (lng < -180 || lng > 180)) return "Longitude must be between -180 and 180.";
    return null;
  };

  const buildArgs = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    propertyType: form.propertyType,
    ...(form.subCategory.trim() ? { subCategory: form.subCategory.trim() } : {}),
    country: form.country.trim(),
    province: form.province.trim(),
    city: form.city.trim(),
    area: form.area.trim(),
    address: form.address.trim(),
    ...(optionalNumber(form.latitude) !== undefined ? { latitude: optionalNumber(form.latitude) } : {}),
    ...(optionalNumber(form.longitude) !== undefined ? { longitude: optionalNumber(form.longitude) } : {}),
    price: Number(form.price),
    currency: form.currency.trim().toUpperCase(),
    pricePeriod: form.pricePeriod,
    ...(optionalNumber(form.capacity) !== undefined ? { capacity: optionalNumber(form.capacity) } : {}),
    amenities: splitList(form.amenities),
    features: splitList(form.features),
    isBookable: form.isBookable,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateProperty({ propertyId, ...buildArgs() });
        navigate("/admin/properties");
      } else {
        const createdId = await createProperty(buildArgs());
        navigate(`/admin/properties/${createdId}/edit`);
      }
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleAddImageUrl = async () => {
    setImageError("");
    const url = imageUrl.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      setImageError("Enter a valid image URL starting with http(s)://");
      return;
    }
    setUploading(true);
    try {
      await addImage({
        propertyId,
        cloudinaryPublicId: `manual-${Date.now()}`,
        secureUrl: url,
        altText: imageAlt.trim() || undefined,
      });
      setImageUrl("");
      setImageAlt("");
    } catch (err) {
      setImageError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleCloudinaryUpload = async (file) => {
    if (!file || !cloudinaryUploadConfigured) return;
    setImageError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || `Cloudinary upload failed (${res.status}).`);
      }
      const json = await res.json();
      await addImage({
        propertyId,
        cloudinaryPublicId: json.public_id,
        secureUrl: json.secure_url,
        altText: imageAlt.trim() || undefined,
      });
      setImageUrl("");
      setImageAlt("");
    } catch (err) {
      setImageError(err instanceof Error ? err.message : getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  if (isEditMode && property === undefined) {
    return <LoadingState label="Loading property…" />;
  }

  if (isEditMode && property === null) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-medium text-slate-700">Property not found.</p>
        <Button as={Link} to="/admin/properties" variant="secondary" className="mt-4">
          Back to properties
        </Button>
      </div>
    );
  }

  const typeOptions = propertyTypesFor(form.category);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditMode ? "Edit property" : "New property"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditMode
              ? "Changes go live immediately after saving."
              : "The listing is created as active and unfeatured; you can change that from the properties list."}
          </p>
        </div>
        <Button as={Link} to="/admin/properties" variant="secondary" size="sm">
          ← Back to properties
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">Basics</h3>

          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              maxLength={150}
              required
              className={inputClass}
              placeholder="e.g. F-11 Premium Coworking Space"
            />
          </Field>

          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={5}
              maxLength={5000}
              required
              className={`${inputClass} resize-y`}
              placeholder="What makes this listing valuable? Include condition, access, and who it suits."
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Category" required>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Property type" required>
              <select
                value={form.propertyType}
                onChange={(e) => setField("propertyType", e.target.value)}
                className={inputClass}
              >
                {typeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub-category (optional)">
              <input
                type="text"
                value={form.subCategory}
                onChange={(e) => setField("subCategory", e.target.value)}
                className={inputClass}
                placeholder="e.g. dedicated floor"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Price" required>
              <input
                type="number"
                min="0"
                step="any"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                required
                className={inputClass}
                placeholder="12000"
              />
            </Field>

            <Field label="Currency" required>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => setField("currency", e.target.value)}
                maxLength={5}
                required
                className={inputClass}
                placeholder="PKR"
              />
            </Field>

            <Field label="Price period" required>
              <select
                value={form.pricePeriod}
                onChange={(e) => setField("pricePeriod", e.target.value)}
                className={inputClass}
              >
                {PRICE_PERIOD_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Capacity (optional)">
              <input
                type="number"
                min="0"
                value={form.capacity}
                onChange={(e) => setField("capacity", e.target.value)}
                className={inputClass}
                placeholder="e.g. 40"
              />
            </Field>

            <Field label="Booking flow" required>
              <select
                value={form.isBookable ? "bookable" : "inquiry"}
                onChange={(e) => setField("isBookable", e.target.value === "bookable")}
                className={inputClass}
              >
                <option value="bookable">Instant booking</option>
                <option value="inquiry">Inquiry only</option>
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">Location</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Country" required>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Province" required>
              <input
                type="text"
                value={form.province}
                onChange={(e) => setField("province", e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Punjab"
              />
            </Field>
            <Field label="City" required>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Islamabad"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Area" required>
              <input
                type="text"
                value={form.area}
                onChange={(e) => setField("area", e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. F-11"
              />
            </Field>
            <Field label="Address" required>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                required
                className={inputClass}
                placeholder="Plot 12, F-11 Markaz"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Latitude (optional)">
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                className={inputClass}
                placeholder="33.6844"
              />
            </Field>
            <Field label="Longitude (optional)">
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                className={inputClass}
                placeholder="72.9881"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">Amenities & features</h3>
          <p className="text-sm text-slate-500">Separate items with commas.</p>

          <Field label="Amenities (comma-separated)">
            <input
              type="text"
              value={form.amenities}
              onChange={(e) => setField("amenities", e.target.value)}
              className={inputClass}
              placeholder="High-speed Wi-Fi, Power backup, Free coffee"
            />
          </Field>

          <Field label="Features (comma-separated)">
            <input
              type="text"
              value={form.features}
              onChange={(e) => setField("features", e.target.value)}
              className={inputClass}
              placeholder="24/7 access, Reception, Parking"
            />
          </Field>
        </section>

        {formError && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{formError}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={submitting} disabled={submitting}>
            {isEditMode ? "Save changes" : "Create property"}
          </Button>
          <Button as={Link} to="/admin/properties" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>

      {isEditMode && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900">Images</h3>
            <p className="text-sm text-slate-500">
              Add images by URL, or upload files directly
              {cloudinaryUploadConfigured
                ? " to the configured Cloudinary preset."
                : " (direct Cloudinary upload also works once VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set)." }
            </p>
          </div>

          {images === undefined ? (
            <LoadingState label="Loading images…" />
          ) : images.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
              No images yet — the listing will show a placeholder.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <li key={img._id} className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="aspect-square bg-slate-100">
                    <img
                      src={img.secureUrl}
                      alt={img.altText || "Property image"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1.5 px-2 py-1.5">
                    {img.isPrimary ? (
                      <Badge tone="green">Primary</Badge>
                    ) : (
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={async () => {
                          setImageError("");
                          try {
                            await setPrimaryImage({ propertyId, imageId: img._id });
                          } catch (err) {
                            setImageError(getErrorMessage(err));
                          }
                        }}
                        className="text-xs font-medium text-brand-800 hover:underline disabled:opacity-50"
                      >
                        Set primary
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={async () => {
                        setImageError("");
                        try {
                          await removeImage({ imageId: img._id });
                        } catch (err) {
                          setImageError(getErrorMessage(err));
                        }
                      }}
                      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Alt text (optional, applied to the next added image)">
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className={inputClass}
                placeholder="e.g. Open-plan desk floor"
              />
            </Field>
            <Field label="Add image by URL">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://res.cloudinary.com/…"
                />
                <Button
                  type="button"
                  size="sm"
                  loading={uploading}
                  disabled={uploading || !imageUrl.trim()}
                  onClick={handleAddImageUrl}
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
            </Field>
          </div>

          {cloudinaryUploadConfigured && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Or upload a file to Cloudinary
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => handleCloudinaryUpload(e.target.files?.[0])}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:opacity-60"
              />
            </div>
          )}

          {imageError && (
            <p className="flex items-center gap-1.5 text-sm text-red-600">
              <Icon name="close" className="w-4 h-4" />
              {imageError}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

export default AdminPropertyForm;
