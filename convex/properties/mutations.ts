import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { CATEGORIES, PROPERTY_TYPES, PRICE_PERIODS } from "../schema";
import { requireAdmin } from "../lib/auth";
import { generateUniqueSlug } from "../lib/slug";
import {
  assertNonEmptyString,
  assertMaxLength,
  assertPositiveNumber,
  assertNonNegativeNumber,
} from "../lib/validators";

function buildSearchText(fields: {
  title: string;
  description: string;
  city: string;
  area: string;
  address: string;
  category: string;
  propertyType: string;
  subCategory?: string;
}): string {
  return [
    fields.title,
    fields.description,
    fields.city,
    fields.area,
    fields.address,
    fields.category,
    fields.propertyType,
    fields.subCategory ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

const propertyInputFields = {
  title: v.string(),
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
  currency: v.string(),
  pricePeriod: PRICE_PERIODS,
  capacity: v.optional(v.number()),
  amenities: v.array(v.string()),
  features: v.array(v.string()),
  isBookable: v.boolean(),
};

function validatePropertyInput(args: {
  title: string;
  description: string;
  country: string;
  province: string;
  city: string;
  area: string;
  address: string;
  price: number;
  capacity?: number;
}) {
  assertNonEmptyString(args.title, "title");
  assertMaxLength(args.title, "title", 150);
  assertNonEmptyString(args.description, "description");
  assertMaxLength(args.description, "description", 5000);
  assertNonEmptyString(args.country, "country");
  assertNonEmptyString(args.province, "province");
  assertNonEmptyString(args.city, "city");
  assertNonEmptyString(args.area, "area");
  assertNonEmptyString(args.address, "address");
  assertPositiveNumber(args.price, "price");
  if (args.capacity !== undefined) {
    assertNonNegativeNumber(args.capacity, "capacity");
  }
}

export const createProperty = mutation({
  args: propertyInputFields,
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    validatePropertyInput(args);

    const slug = await generateUniqueSlug(ctx, args.title);
    const now = Date.now();

    const propertyId = await ctx.db.insert("properties", {
      ...args,
      slug,
      isActive: true,
      isFeatured: false,
      searchText: buildSearchText(args),
      createdBy: admin._id,
      createdAt: now,
      updatedAt: now,
    });

    return propertyId;
  },
});

export const updateProperty = mutation({
  args: {
    propertyId: v.id("properties"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(CATEGORIES),
    propertyType: v.optional(PROPERTY_TYPES),
    subCategory: v.optional(v.string()),
    country: v.optional(v.string()),
    province: v.optional(v.string()),
    city: v.optional(v.string()),
    area: v.optional(v.string()),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    pricePeriod: v.optional(PRICE_PERIODS),
    capacity: v.optional(v.number()),
    amenities: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),
    isBookable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { propertyId, ...updates } = args;

    const existing = await ctx.db.get(propertyId);
    if (!existing) {
      throw new Error("NOT_FOUND: Property does not exist.");
    }

    const merged = { ...existing, ...updates };
    validatePropertyInput(merged);

    const patch: Record<string, unknown> = { ...updates, updatedAt: Date.now() };

    // Regenerate the slug only if the title actually changed.
    if (updates.title && updates.title !== existing.title) {
      patch.slug = await generateUniqueSlug(ctx, updates.title, propertyId);
    }

    patch.searchText = buildSearchText(merged);

    await ctx.db.patch(propertyId, patch);
    return propertyId;
  },
});

export const deactivateProperty = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.propertyId);
    if (!existing) throw new Error("NOT_FOUND: Property does not exist.");
    await ctx.db.patch(args.propertyId, { isActive: false, updatedAt: Date.now() });
  },
});

export const reactivateProperty = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.propertyId);
    if (!existing) throw new Error("NOT_FOUND: Property does not exist.");
    await ctx.db.patch(args.propertyId, { isActive: true, updatedAt: Date.now() });
  },
});

/**
 * Hard delete. Only allowed when the property has no bookings or inquiries
 * attached, to protect referential integrity/history - use
 * deactivateProperty for the normal "remove from listings" path.
 */
export const deleteProperty = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.propertyId);
    if (!existing) throw new Error("NOT_FOUND: Property does not exist.");

    const hasBookings = await ctx.db
      .query("bookings")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .first();
    const hasInquiries = await ctx.db
      .query("inquiries")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .first();
    if (hasBookings || hasInquiries) {
      throw new Error(
        "VALIDATION: This property has booking or inquiry history and cannot be deleted. Deactivate it instead."
      );
    }

    const images = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();
    for (const image of images) {
      await ctx.db.delete(image._id);
    }

    await ctx.db.delete(args.propertyId);
  },
});

export const setFeaturedProperty = mutation({
  args: { propertyId: v.id("properties"), isFeatured: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.propertyId);
    if (!existing) throw new Error("NOT_FOUND: Property does not exist.");
    await ctx.db.patch(args.propertyId, {
      isFeatured: args.isFeatured,
      updatedAt: Date.now(),
    });
  },
});
