import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../lib/auth";
import { assertNonEmptyString } from "../lib/validators";

/**
 * Adds a Cloudinary image record to a property. The actual file upload to
 * Cloudinary happens directly from the browser (unsigned upload preset);
 * this mutation only stores the metadata Cloudinary returns. No Cloudinary
 * secret ever passes through this function or the client.
 */
export const addPropertyImage = mutation({
  args: {
    propertyId: v.id("properties"),
    cloudinaryPublicId: v.string(),
    secureUrl: v.string(),
    altText: v.optional(v.string()),
    isPrimary: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    assertNonEmptyString(args.cloudinaryPublicId, "cloudinaryPublicId");
    assertNonEmptyString(args.secureUrl, "secureUrl");

    const property = await ctx.db.get(args.propertyId);
    if (!property) throw new Error("NOT_FOUND: Property does not exist.");

    const existingImages = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    const makePrimary = args.isPrimary ?? existingImages.length === 0;

    if (makePrimary) {
      for (const img of existingImages) {
        if (img.isPrimary) {
          await ctx.db.patch(img._id, { isPrimary: false });
        }
      }
    }

    return await ctx.db.insert("propertyImages", {
      propertyId: args.propertyId,
      cloudinaryPublicId: args.cloudinaryPublicId,
      secureUrl: args.secureUrl,
      altText: args.altText,
      displayOrder: existingImages.length,
      isPrimary: makePrimary,
      createdAt: Date.now(),
    });
  },
});

/**
 * Removes an image's Convex record. Returns the Cloudinary public ID so a
 * server-side action (using CLOUDINARY_API_SECRET) can optionally also
 * delete the underlying asset from Cloudinary storage - that destroy call
 * should never be issued from React directly.
 */
export const removePropertyImage = mutation({
  args: { imageId: v.id("propertyImages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const image = await ctx.db.get(args.imageId);
    if (!image) throw new Error("NOT_FOUND: Image does not exist.");

    await ctx.db.delete(args.imageId);

    if (image.isPrimary) {
      const remaining = await ctx.db
        .query("propertyImages")
        .withIndex("by_property", (q) => q.eq("propertyId", image.propertyId))
        .collect();
      remaining.sort((a, b) => a.displayOrder - b.displayOrder);
      if (remaining.length > 0) {
        await ctx.db.patch(remaining[0]._id, { isPrimary: true });
      }
    }

    return { cloudinaryPublicId: image.cloudinaryPublicId };
  },
});

export const reorderPropertyImages = mutation({
  args: {
    propertyId: v.id("properties"),
    orderedImageIds: v.array(v.id("propertyImages")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const images = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    const validIds = new Set(images.map((i) => i._id));
    if (
      args.orderedImageIds.length !== images.length ||
      !args.orderedImageIds.every((id) => validIds.has(id))
    ) {
      throw new Error(
        "VALIDATION: orderedImageIds must contain exactly the current images for this property."
      );
    }

    await Promise.all(
      args.orderedImageIds.map((imageId, index) =>
        ctx.db.patch(imageId, { displayOrder: index })
      )
    );
  },
});

export const setPrimaryImage = mutation({
  args: { propertyId: v.id("properties"), imageId: v.id("propertyImages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const images = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    const target = images.find((i) => i._id === args.imageId);
    if (!target) {
      throw new Error("NOT_FOUND: Image does not belong to this property.");
    }

    await Promise.all(
      images.map((img) => ctx.db.patch(img._id, { isPrimary: img._id === args.imageId }))
    );
  },
});

export const getPropertyImages = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();
    return images.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const getPrimaryPropertyImage = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();
    return images.find((i) => i.isPrimary) ?? images[0] ?? null;
  },
});

/**
 * Batched version of getPrimaryPropertyImage for grid/list views (e.g. the
 * enterprise office category pages). A property grid of N cards calling
 * getPrimaryPropertyImage individually fires N separate queries on every
 * render; this does the same by_property lookups server-side in one round
 * trip and returns a propertyId -> image map, so a page of listings costs
 * one query instead of one-per-card.
 */
export const getPrimaryImagesForProperties = query({
  args: { propertyIds: v.array(v.id("properties")) },
  handler: async (ctx, args) => {
    const uniqueIds = [...new Set(args.propertyIds)];
    const entries = await Promise.all(
      uniqueIds.map(async (propertyId) => {
        const images = await ctx.db
          .query("propertyImages")
          .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
          .collect();
        const primary = images.find((i) => i.isPrimary) ?? images[0] ?? null;
        return [propertyId, primary] as const;
      })
    );
    return Object.fromEntries(entries);
  },
});
