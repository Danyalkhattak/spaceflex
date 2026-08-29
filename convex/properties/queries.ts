import { query } from "../_generated/server";
import { v } from "convex/values";
import { CATEGORIES, PROPERTY_TYPES } from "../schema";
import { requireAdmin } from "../lib/auth";

/** Public: featured, active properties for the homepage. */
export const getFeaturedProperties = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 8, 24);
    const featured = await ctx.db
      .query("properties")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
    return featured
      .filter((p) => p.isActive)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
});

/**
 * Public: paginated property listing with structural filters. This is the
 * "browse" endpoint (category page, location filter API) - full-text
 * keyword search lives in search/queries.ts:searchProperties.
 *
 * Like searchProperties, filters and sorting are applied to the FULL
 * matching set before pagination (offset cursor), so pages can't come up
 * short or sorted per-page.
 */
export const getProperties = query({
  args: {
    category: v.optional(CATEGORIES),
    propertyType: v.optional(PROPERTY_TYPES),
    city: v.optional(v.string()),
    area: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minCapacity: v.optional(v.number()),
    cursor: v.optional(v.string()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = Math.min(Math.max(args.pageSize ?? 20, 1), 50);

    // Pick the most selective index available for the given filters.
    let baseQuery;
    if (args.propertyType) {
      baseQuery = ctx.db
        .query("properties")
        .withIndex("by_propertyType", (q) => q.eq("propertyType", args.propertyType!));
    } else if (args.category) {
      baseQuery = ctx.db
        .query("properties")
        .withIndex("by_category", (q) => q.eq("category", args.category!));
    } else if (args.city) {
      baseQuery = ctx.db.query("properties").withIndex("by_city", (q) => q.eq("city", args.city!));
    } else {
      baseQuery = ctx.db.query("properties").withIndex("by_active", (q) => q.eq("isActive", true));
    }

    const candidates = await baseQuery.collect();

    const filtered = candidates.filter((p) => {
      if (!p.isActive) return false;
      if (args.category && p.category !== args.category) return false;
      if (args.city && p.city !== args.city) return false;
      if (args.area && p.area !== args.area) return false;
      if (args.minPrice !== undefined && p.price < args.minPrice) return false;
      if (args.maxPrice !== undefined && p.price > args.maxPrice) return false;
      if (args.minCapacity !== undefined && (p.capacity ?? 0) < args.minCapacity) return false;
      return true;
    });

    filtered.sort((a, b) => b.createdAt - a.createdAt);

    const offset = parseOffsetCursor(args.cursor);
    const items = filtered.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < filtered.length;

    return {
      items,
      continueCursor: hasMore ? String(offset + pageSize) : undefined,
      isDone: !hasMore,
    };
  },
});

function parseOffsetCursor(cursor: string | undefined): number {
  if (!cursor) return 0;
  const parsed = Number.parseInt(cursor, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export const getPropertyById = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) return null;
    return property;
  },
});

export const getPropertyBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

/** Public: static category / property-type metadata for building filter UIs. */
export const getCategories = query({
  args: {},
  handler: async () => {
    return [
      { value: "coworking", label: "Coworking Spaces & Desk Rentals" },
      { value: "office", label: "Enterprise Office Space Leasing" },
      { value: "virtual_office", label: "Virtual Office & Business Addresses" },
      { value: "event_venue", label: "Event Venues & Conference Rooms" },
      { value: "housing", label: "Executive Hostels & Corporate Housing" },
    ];
  },
});

export const getPropertyTypes = query({
  args: {},
  handler: async () => {
    return [
      { value: "shared_desk", category: "coworking", label: "Shared Desk Subscription" },
      { value: "private_cabin", category: "coworking", label: "Private Cabin for Startups" },
      { value: "night_shift_coworking", category: "coworking", label: "24/7 Night-Shift Coworking" },
      { value: "commercial_office", category: "office", label: "Commercial Office Floor" },
      { value: "it_park_space", category: "office", label: "IT Park & Tech Space" },
      { value: "corporate_hq", category: "office", label: "Corporate HQ Leasing" },
      { value: "virtual_company_address", category: "virtual_office", label: "Virtual Company Address" },
      { value: "mail_handling", category: "virtual_office", label: "Mail Handling Service" },
      { value: "offshore_business_address", category: "virtual_office", label: "Offshore Business Address" },
      { value: "meeting_room", category: "event_venue", label: "Hourly Meeting Room" },
      { value: "event_hall", category: "event_venue", label: "Tech Event Hall" },
      { value: "boardroom", category: "event_venue", label: "Executive Boardroom" },
      { value: "it_hostel", category: "housing", label: "IT Hostel" },
      { value: "studio_apartment", category: "housing", label: "Studio Apartment" },
      { value: "corporate_guest_house", category: "housing", label: "Corporate Guest House" },
    ];
  },
});

/** Admin: list all properties, including inactive ones, for the dashboard. */
export const adminGetAllProperties = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("properties").order("desc").collect();
    return args.includeInactive === false ? all.filter((p) => p.isActive) : all;
  },
});
