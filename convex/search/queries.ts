import { query } from "../_generated/server";
import { v } from "convex/values";
import { CATEGORIES, PROPERTY_TYPES } from "../schema";

/**
 * The Search Indexing Engine required by the assignment. Keyword search
 * runs entirely in Convex via the `search_properties` search index defined
 * in schema.ts (backed by the denormalized `searchText` field) - the
 * frontend never downloads the full property table to filter client-side.
 *
 * When `query` is omitted this behaves as a pure structured filter/sort,
 * so the same function can back both the search bar and the "browse by
 * category/location" filter UI described in the assignment.
 */
export const searchProperties = query({
  args: {
    query: v.optional(v.string()),
    category: v.optional(CATEGORIES),
    propertyType: v.optional(PROPERTY_TYPES),
    city: v.optional(v.string()),
    area: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minCapacity: v.optional(v.number()),
    sortBy: v.optional(
      v.union(v.literal("newest"), v.literal("price_asc"), v.literal("price_desc"))
    ),
    pageSize: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pageSize = Math.min(args.pageSize ?? 20, 50);

    let items;
    let continueCursor: string | undefined;
    let isDone = true;

    if (args.query && args.query.trim().length > 0) {
      let searchQuery = ctx.db
        .query("properties")
        .withSearchIndex("search_properties", (q) => {
          let sq = q.search("searchText", args.query!.trim().toLowerCase());
          sq = sq.eq("isActive", true);
          if (args.category) sq = sq.eq("category", args.category);
          if (args.propertyType) sq = sq.eq("propertyType", args.propertyType);
          if (args.city) sq = sq.eq("city", args.city);
          return sq;
        });

      const result = await searchQuery.paginate({
        cursor: args.cursor ?? null,
        numItems: pageSize,
      });
      items = result.page;
      continueCursor = result.continueCursor;
      isDone = result.isDone;
    } else {
      // No keyword - fall back to the most selective structured index.
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

      const result = await baseQuery.paginate({
        cursor: args.cursor ?? null,
        numItems: pageSize,
      });
      items = result.page;
      continueCursor = result.continueCursor;
      isDone = result.isDone;
    }

    let filtered = items.filter((p) => {
      if (!p.isActive) return false;
      if (args.category && p.category !== args.category) return false;
      if (args.propertyType && p.propertyType !== args.propertyType) return false;
      if (args.city && p.city !== args.city) return false;
      if (args.area && p.area !== args.area) return false;
      if (args.minPrice !== undefined && p.price < args.minPrice) return false;
      if (args.maxPrice !== undefined && p.price > args.maxPrice) return false;
      if (args.minCapacity !== undefined && (p.capacity ?? 0) < args.minCapacity) return false;
      return true;
    });

    switch (args.sortBy) {
      case "price_asc":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    return {
      items: filtered,
      continueCursor,
      hasMore: !isDone,
    };
  },
});
