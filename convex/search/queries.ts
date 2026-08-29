import { query } from "../_generated/server";
import { v } from "convex/values";
import { CATEGORIES, PROPERTY_TYPES } from "../schema";
import type { Doc } from "../_generated/dataModel";

/**
 * The Search Indexing Engine required by the assignment. Keyword search
 * runs entirely in Convex via the `search_properties` search index defined
 * in schema.ts (backed by the denormalized `searchText` field) - the
 * frontend never downloads the full property table to filter client-side.
 *
 * When `query` is omitted this behaves as a pure structured filter/sort,
 * so the same function can back both the search bar and the "browse by
 * category/location" filter UI described in the assignment.
 *
 * Correctness note: filters and sorting are applied to the FULL matching
 * result set BEFORE pagination. The previous implementation filtered and
 * sorted each fetched page in isolation, which produced short pages, a
 * wrong `hasMore`, and per-page (not global) price sorting.
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
    const pageSize = Math.min(Math.max(args.pageSize ?? 20, 1), 50);
    const MAX_CANDIDATES = 2000; // hard scan bound; keeps the query bounded

    let candidates: Doc<"properties">[];

    if (args.query && args.query.trim().length > 0) {
      // Keyword path: drain the search index (which already applies the
      // indexed equality filters + isActive) into a candidate list. The
      // client-facing cursor is an offset into the final sorted list, so
      // the index scan always restarts from the beginning here.
      candidates = [];
      let cursor: string | null = null;
      do {
        const result = await ctx.db
          .query("properties")
          .withSearchIndex("search_properties", (q) => {
            let sq = q.search("searchText", args.query!.trim().toLowerCase());
            sq = sq.eq("isActive", true);
            if (args.category) sq = sq.eq("category", args.category);
            if (args.propertyType) sq = sq.eq("propertyType", args.propertyType);
            if (args.city) sq = sq.eq("city", args.city);
            return sq;
          })
          .paginate({ cursor, numItems: 100 });
        candidates = candidates.concat(result.page);
        cursor = result.continueCursor;
        if (result.isDone || result.page.length === 0) break;
      } while (candidates.length < MAX_CANDIDATES);
    } else {
      // No keyword - read via the most selective structured index.
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
      candidates = await baseQuery.collect();
    }

    // 1) Filter the FULL candidate set.
    const filtered = candidates.filter((p) => {
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

    // 2) Sort globally across the whole filtered set.
    switch (args.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price || b.createdAt - a.createdAt);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price || b.createdAt - a.createdAt);
        break;
      default:
        filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    // 3) Paginate the sorted result. The cursor is a plain numeric offset
    // into this deterministic (filter + sort) ordering, which is stable
    // between page fetches of the same filter combination.
    const offset = parseOffsetCursor(args.cursor);
    const items = filtered.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < filtered.length;

    return {
      items,
      continueCursor: hasMore ? String(offset + pageSize) : undefined,
      hasMore,
    };
  },
});

function parseOffsetCursor(cursor: string | undefined): number {
  if (!cursor) return 0;
  const parsed = Number.parseInt(cursor, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}
