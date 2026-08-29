// Shared metadata for the admin panel. Values mirror the literal unions in
// convex/schema.ts (CATEGORIES / PROPERTY_TYPES / PRICE_PERIODS /
// BOOKING_STATUSES) - keep them in sync if the backend unions change.

export const CATEGORY_OPTIONS = [
  { value: "coworking", label: "Coworking Spaces & Desk Rentals" },
  { value: "office", label: "Enterprise Office Leasing" },
  { value: "virtual_office", label: "Virtual Office & Business Addresses" },
  { value: "event_venue", label: "Event Venues & Conference Rooms" },
  { value: "housing", label: "Executive Hostels & Corporate Housing" },
];

export const PROPERTY_TYPES_BY_CATEGORY = {
  coworking: [
    { value: "shared_desk", label: "Shared Desk Subscription" },
    { value: "private_cabin", label: "Private Cabin for Startups" },
    { value: "night_shift_coworking", label: "24/7 Night-Shift Coworking" },
  ],
  office: [
    { value: "commercial_office", label: "Commercial Office Floor" },
    { value: "it_park_space", label: "IT Park & Tech Space" },
    { value: "corporate_hq", label: "Corporate HQ Leasing" },
  ],
  virtual_office: [
    { value: "virtual_company_address", label: "Virtual Company Address" },
    { value: "mail_handling", label: "Mail Handling Service" },
    { value: "offshore_business_address", label: "Offshore Business Address" },
  ],
  event_venue: [
    { value: "meeting_room", label: "Hourly Meeting Room" },
    { value: "event_hall", label: "Tech Event Hall" },
    { value: "boardroom", label: "Executive Boardroom" },
  ],
  housing: [
    { value: "it_hostel", label: "IT Hostel" },
    { value: "studio_apartment", label: "Studio Apartment" },
    { value: "corporate_guest_house", label: "Corporate Guest House" },
  ],
};

export const PRICE_PERIOD_OPTIONS = [
  { value: "hour", label: "Per hour" },
  { value: "day", label: "Per day" },
  { value: "month", label: "Per month" },
  { value: "year", label: "Per year" },
  { value: "one_time", label: "One-time" },
];

export const BOOKING_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

/** The property types valid for a given category (safe for unknown values). */
export function propertyTypesFor(category) {
  return PROPERTY_TYPES_BY_CATEGORY[category] ?? [];
}
