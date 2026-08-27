// Metadata for the three housing propertyType values already defined in
// convex/schema.ts (PROPERTY_TYPES / category "housing"). This module only
// adds display info - the source of truth for which types are valid stays
// in the backend. Mirrors src/features/coworking/coworkingMeta.js since
// housing (like coworking) is an instantly-bookable category, not an
// inquiry-based one.
export const HOUSING_PROPERTY_TYPES = [
  {
    value: "it_hostel",
    label: "IT Hostel for Professionals",
    shortLabel: "IT Hostel",
    description:
      "Shared hostel accommodation for IT professionals, close to major tech office clusters - a budget-friendly stay for relocating engineers.",
  },
  {
    value: "studio_apartment",
    label: "Studio Apartment for Professionals",
    shortLabel: "Studio Apartment",
    description:
      "A furnished, self-contained studio apartment for working professionals who want privacy and a proper kitchenette on a monthly lease.",
  },
  {
    value: "corporate_guest_house",
    label: "Corporate Guest House",
    shortLabel: "Guest House",
    description:
      "A managed guest house for visiting company staff and short business stays, with housekeeping and daily-rate billing.",
  },
];

export const HOUSING_TYPE_LABEL = Object.fromEntries(
  HOUSING_PROPERTY_TYPES.map((t) => [t.value, t.label])
);

export const HOUSING_TYPE_SHORT_LABEL = Object.fromEntries(
  HOUSING_PROPERTY_TYPES.map((t) => [t.value, t.shortLabel])
);

/** Common housing amenities, used to render a small icon next to each amenity string. */
const AMENITY_ICON_KEYWORDS = [
  { keywords: ["wi-fi", "wifi", "internet", "fiber"], icon: "wifi" },
  { keywords: ["power", "ups", "backup", "generator"], icon: "bolt" },
  { keywords: ["breakfast", "kitchen", "mess", "kitchenette"], icon: "coffee" },
  { keywords: ["security", "guard", "24/7", "access"], icon: "shield" },
  { keywords: ["laundry"], icon: "lock" },
  { keywords: ["housekeeping"], icon: "check" },
  { keywords: ["furnished", "furnishing"], icon: "building" },
  { keywords: ["parking"], icon: "car" },
];

export function housingAmenityIcon(amenity) {
  const lower = amenity.toLowerCase();
  const match = AMENITY_ICON_KEYWORDS.find((entry) =>
    entry.keywords.some((k) => lower.includes(k))
  );
  return match?.icon ?? "check";
}

// Config for the pillar hub + three named sub-pages (per the capstone
// brief: "IT Hostels G-11 Islamabad", "Studio Apartments for Pros",
// "Corporate Guest House Rentals"). Keeps HousingCategoryPage.jsx a thin,
// data-driven wrapper instead of three near-duplicate page files.
export const HOUSING_CATEGORIES = {
  "it-hostels-g11-islamabad": {
    slug: "it-hostels-g11-islamabad",
    propertyType: "it_hostel",
    navLabel: "IT Hostels (G-11 Islamabad)",
    heroEyebrow: "Executive Hostels & Corporate Housing",
    heroTitle: "IT Hostels — G-11 Islamabad",
    heroSubtitle:
      "Shared hostel rooms for IT professionals close to Islamabad's tech office clusters, booked instantly on a monthly basis.",
    intro:
      "Browse shared IT-hostel accommodation built for engineers and IT staff relocating for work. Every listing shows live seat availability, so you can book a bed instantly instead of waiting on a callback.",
    highlightAmenities: ["Wi-Fi", "Laundry", "Mess/kitchen", "Security", "Backup power"],
  },
  "studio-apartments-for-pros": {
    slug: "studio-apartments-for-pros",
    propertyType: "studio_apartment",
    navLabel: "Studio Apartments for Pros",
    heroEyebrow: "Executive Hostels & Corporate Housing",
    heroTitle: "Studio Apartments for Professionals",
    heroSubtitle:
      "Furnished, self-contained studio apartments for working professionals who want their own space on a monthly lease.",
    intro:
      "These are private, furnished studio apartments - a step up from shared hostel accommodation, with a kitchenette and full privacy. Check live availability and book your move-in date directly.",
    highlightAmenities: ["Furnished", "Kitchenette", "Wi-Fi", "Backup power", "Security"],
  },
  "corporate-guest-house-rentals": {
    slug: "corporate-guest-house-rentals",
    propertyType: "corporate_guest_house",
    navLabel: "Corporate Guest House Rentals",
    heroEyebrow: "Executive Hostels & Corporate Housing",
    heroTitle: "Corporate Guest House Rentals",
    heroSubtitle:
      "Managed guest houses for visiting company staff and short business stays, billed by the day with housekeeping included.",
    intro:
      "Book a managed guest house room for employees visiting on short business trips. Rooms are billed per day and come with housekeeping, so there's nothing to arrange beyond your dates.",
    highlightAmenities: ["Housekeeping", "Wi-Fi", "Breakfast included", "Security"],
  },
};

export const HOUSING_CATEGORY_LIST = Object.values(HOUSING_CATEGORIES);
