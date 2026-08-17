import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Shared literal unions - kept in one place so new values are easy to add
// without touching every function that references them.
// ---------------------------------------------------------------------------

export const ROLES = v.union(v.literal("customer"), v.literal("admin"));

export const CATEGORIES = v.union(
  v.literal("coworking"),
  v.literal("office"),
  v.literal("virtual_office"),
  v.literal("event_venue"),
  v.literal("housing")
);

export const PROPERTY_TYPES = v.union(
  // coworking
  v.literal("shared_desk"),
  v.literal("private_cabin"),
  v.literal("night_shift_coworking"),
  // office
  v.literal("commercial_office"),
  v.literal("it_park_space"),
  v.literal("corporate_hq"),
  // virtual office
  v.literal("virtual_company_address"),
  v.literal("mail_handling"),
  v.literal("offshore_business_address"),
  // event venue
  v.literal("meeting_room"),
  v.literal("event_hall"),
  v.literal("boardroom"),
  // housing
  v.literal("it_hostel"),
  v.literal("studio_apartment"),
  v.literal("corporate_guest_house")
);

export const PRICE_PERIODS = v.union(
  v.literal("hour"),
  v.literal("day"),
  v.literal("month"),
  v.literal("year"),
  v.literal("one_time")
);

export const BOOKING_TYPES = v.union(
  v.literal("shared_desk"),
  v.literal("private_cabin"),
  v.literal("night_shift_coworking"),
  v.literal("meeting_room"),
  v.literal("event_venue")
);

export const BOOKING_STATUSES = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("cancelled"),
  v.literal("completed")
);

export const PAYMENT_STATUSES = v.union(
  v.literal("pending"),
  v.literal("demo_paid"),
  v.literal("failed"),
  v.literal("refunded")
);

export const INQUIRY_TYPES = v.union(
  v.literal("enterprise_office"),
  v.literal("virtual_office"),
  v.literal("mail_handling"),
  v.literal("offshore_address"),
  v.literal("housing"),
  v.literal("general")
);

export const INQUIRY_STATUSES = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("in_progress"),
  v.literal("resolved"),
  v.literal("closed")
);

export default defineSchema({
  // -------------------------------------------------------------------------
  // USERS - application-level profile linked to a Clerk identity.
  // Never stores a password; Clerk is the single source of truth for auth.
  // -------------------------------------------------------------------------
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: ROLES,
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerkUserId", ["clerkUserId"]),

  // -------------------------------------------------------------------------
  // PROPERTIES - single shared table for every SpaceFlex category.
  // `searchText` is a denormalized concatenation of the searchable fields,
  // kept in sync by properties/mutations.ts, and backs the search index.
  // -------------------------------------------------------------------------
  properties: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),

    category: CATEGORIES,
    propertyType: PROPERTY_TYPES,
    subCategory: v.optional(v.string()),

    country: v.string(),
    province: v.string(),
    city: v.string(),
    area: v.string(),
    address: v.string(),

    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),

    price: v.number(),
    currency: v.string(), // e.g. "PKR"
    pricePeriod: PRICE_PERIODS,

    capacity: v.optional(v.number()),

    amenities: v.array(v.string()),
    features: v.array(v.string()),

    isBookable: v.boolean(), // true = uses bookings flow, false = inquiry flow
    isActive: v.boolean(),
    isFeatured: v.boolean(),

    searchText: v.string(),

    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_propertyType", ["propertyType"])
    .index("by_city", ["city"])
    .index("by_area", ["area"])
    .index("by_active", ["isActive"])
    .index("by_featured", ["isFeatured"])
    .searchIndex("search_properties", {
      searchField: "searchText",
      filterFields: ["category", "propertyType", "city", "isActive"],
    }),

  // -------------------------------------------------------------------------
  // PROPERTY IMAGES - Cloudinary metadata only, never binary data.
  // -------------------------------------------------------------------------
  propertyImages: defineTable({
    propertyId: v.id("properties"),
    cloudinaryPublicId: v.string(),
    secureUrl: v.string(),
    altText: v.optional(v.string()),
    displayOrder: v.number(),
    isPrimary: v.boolean(),
    createdAt: v.number(),
  }).index("by_property", ["propertyId"]),

  // -------------------------------------------------------------------------
  // BOOKINGS - shared by every bookable category (coworking, meeting rooms,
  // event venues, and any bookable housing).
  // -------------------------------------------------------------------------
  bookings: defineTable({
    userId: v.id("users"),
    propertyId: v.id("properties"),

    bookingType: BOOKING_TYPES,

    startDate: v.number(), // ms epoch
    endDate: v.number(), // ms epoch

    quantity: v.number(), // e.g. number of desks / cabins / hours

    unitPrice: v.number(), // server-computed, snapshot at booking time
    totalAmount: v.number(), // server-computed
    currency: v.string(),

    status: BOOKING_STATUSES,
    paymentStatus: PAYMENT_STATUSES,

    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),

    notes: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"])
    .index("by_property_dates", ["propertyId", "startDate", "endDate"]),

  // -------------------------------------------------------------------------
  // INQUIRIES - enterprise leasing, virtual office, mail handling, offshore
  // addresses, and inquiry-based housing all reuse this single table.
  // -------------------------------------------------------------------------
  inquiries: defineTable({
    userId: v.id("users"),
    propertyId: v.optional(v.id("properties")),

    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    companyName: v.optional(v.string()),

    message: v.string(),
    inquiryType: INQUIRY_TYPES,

    status: INQUIRY_STATUSES,
    adminNotes: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"]),
});
