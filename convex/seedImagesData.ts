import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Helpers for convex/seedImages.ts (the "use node" action that talks to
 * Cloudinary). Kept in a separate, non-"use node" file because Convex does
 * not allow queries/mutations to be exported from a "use node" module.
 */

// One or more real, freely-licensed (Unsplash) source photos per demo
// property, keyed by the same `slug` used in seed.ts. The action uploads
// each of these to Cloudinary (server-side, via CLOUDINARY_API_KEY /
// CLOUDINARY_API_SECRET already configured on the Convex deployment) and
// stores the returned public_id + secure_url - never the raw Unsplash URL.
export const DEMO_PROPERTY_IMAGE_SOURCES: Record<string, string[]> = {
  "f11-premium-coworking-space": [
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2",
    "https://images.unsplash.com/photo-1604328727766-a151d1045ab4",
  ],
  "blue-area-private-startup-cabin": [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
  ],
  "g9-night-shift-coworking-floor": [
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786",
  ],
  "blue-area-commercial-office-floor": [
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
  ],
  "nastp-it-park-tech-space": [
    "https://images.unsplash.com/photo-1785623354485-b663cb9afa0b",
    "https://images.unsplash.com/photo-1610374792793-f016b77ca51a",
  ],
  "dha-rawalpindi-corporate-hq-building": [
    "https://images.unsplash.com/photo-1501324682324-0d8d7c4b9706",
    "https://images.unsplash.com/photo-1691161372406-4c65ac71ccb0",
  ],
  "serena-business-complex-office-floor": [
    "https://images.unsplash.com/photo-1606857521015-7f9fcf423740",
    "https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5",
  ],
  "gulberg-multi-floor-office-space": [
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88",
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76",
  ],
  "clifton-premium-business-office-floor": [
    "https://images.unsplash.com/photo-1624213012413-fda54df1810f",
    "https://images.unsplash.com/photo-1636142466028-8c6c7cd616b7",
  ],
  "nastp-software-house-floor": [
    "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf",
  ],
  "arfa-software-technology-park-suite": [
    "https://images.unsplash.com/photo-1571624436279-b272aff752b5",
    "https://images.unsplash.com/photo-1610123172763-1f587473048f",
  ],
  "korangi-tech-campus-office-space": [
    "https://images.unsplash.com/photo-1594007336248-95440e3fde6d",
    "https://images.unsplash.com/photo-1623051786552-e46ef84e6c07",
  ],
  "dha-phase-2-corporate-hq-building": [
    "https://images.unsplash.com/photo-1710797213431-c89129979ca5",
    "https://images.unsplash.com/photo-1704423846283-f92ff6badea3",
  ],
  "gulberg-executive-headquarters-building": [
    "https://images.unsplash.com/photo-1641155049992-8cba3e42f632",
    "https://images.unsplash.com/photo-1711720743865-10787dd6934a",
  ],
  "clifton-corporate-campus-headquarters": [
    "https://images.unsplash.com/photo-1768661770207-9aa46d5ed526",
    "https://images.unsplash.com/photo-1703745006226-98d4b948dc41",
  ],
  "islamabad-virtual-company-address": [
    "https://images.unsplash.com/photo-1602595688238-9fffe12d5af3",
    "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1",
  ],
  "blue-area-mail-handling-service": [
    "https://images.unsplash.com/photo-1552858725-a019f14f0cec",
    "https://images.unsplash.com/photo-1701708622502-41632ebe7f87",
  ],
  "islamabad-offshore-business-address": [
    "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea",
    "https://images.unsplash.com/photo-1686100510220-1296f4c5eb36",
  ],
  "f8-hourly-meeting-room": [
    "https://images.unsplash.com/photo-1431540015161-0bf868a2d407",
    "https://images.unsplash.com/photo-1628062699790-7c45262b82b4",
  ],
  "blue-area-tech-event-hall": [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
  ],
  "g10-executive-boardroom": [
    "https://images.unsplash.com/photo-1622675363311-3e1904dc1885",
    "https://images.unsplash.com/photo-1596522354195-e84ae3c98731",
  ],
  "i9-it-hostel-for-professionals": [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
    "https://images.unsplash.com/photo-1709805619372-40de3f158e83",
  ],
  "bahria-town-studio-apartment": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  ],
  "f7-corporate-guest-house": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    "https://images.unsplash.com/photo-1770232274485-b35ee5092cbe",
  ],
};

// Every demo property that has (or should have) images, with its title for
// altText and its Convex _id so the action doesn't need a second round trip.
export const listDemoPropertiesForImageSeed = internalQuery({
  args: {},
  handler: async (ctx) => {
    const slugs = Object.keys(DEMO_PROPERTY_IMAGE_SOURCES);
    const results = [];
    for (const slug of slugs) {
      const property = await ctx.db
        .query("properties")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (property) {
        results.push({ _id: property._id, slug: property.slug, title: property.title });
      }
    }
    return results;
  },
});

// Removes any existing (e.g. placeholder) image rows for a property before
// the action inserts freshly-uploaded Cloudinary images, so re-running the
// seed never produces duplicates or leaves stale placeholder rows behind.
export const clearPropertyImages = internalMutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("propertyImages")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();
    for (const img of existing) {
      await ctx.db.delete(img._id);
    }
  },
});

export const insertUploadedPropertyImage = internalMutation({
  args: {
    propertyId: v.id("properties"),
    cloudinaryPublicId: v.string(),
    secureUrl: v.string(),
    altText: v.string(),
    displayOrder: v.number(),
    isPrimary: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("propertyImages", {
      propertyId: args.propertyId,
      cloudinaryPublicId: args.cloudinaryPublicId,
      secureUrl: args.secureUrl,
      altText: args.altText,
      displayOrder: args.displayOrder,
      isPrimary: args.isPrimary,
      createdAt: Date.now(),
    });
  },
});
