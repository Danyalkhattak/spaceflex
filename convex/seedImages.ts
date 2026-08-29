"use node";

/**
 * DEVELOPMENT / DEMO SEED DATA ONLY.
 *
 * Run with: `npx convex run seedImages:uploadDemoPropertyImages`
 *
 * Uploads real, freely-licensed photos (see DEMO_PROPERTY_IMAGE_SOURCES in
 * seedImagesData.ts) to Cloudinary - server-side, via CLOUDINARY_API_KEY /
 * CLOUDINARY_API_SECRET / CLOUDINARY_CLOUD_NAME, which must already be set
 * as Convex deployment environment variables (Convex dashboard -> Settings
 * -> Environment Variables). This is a Node action, so it runs on Convex's
 * servers and reaches Cloudinary directly - the browser and any Cloudinary
 * secrets never meet.
 *
 * For each demo property (matched by slug, created by seed:runSeed) this:
 *   1. Deletes any existing propertyImages rows for that property (so the
 *      placeholder `demo/placeholder-<slug>` rows from seed.ts, or images
 *      from a previous run of this script, are replaced rather than
 *      duplicated).
 *   2. Uploads each source photo straight from its URL - Cloudinary fetches
 *      the bytes itself, nothing is downloaded through this process - into
 *      the `spaceflex/properties` folder, and inserts a matching
 *      propertyImages row with the real cloudinaryPublicId + secureUrl.
 *
 * Safe to re-run: it always leaves each property with exactly the images
 * currently listed for it in seedImagesData.ts.
 */

import { v2 as cloudinary } from "cloudinary";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { DEMO_PROPERTY_IMAGE_SOURCES } from "./seedImagesData";

export const uploadDemoPropertyImages = internalAction({
  args: {},
  handler: async (ctx) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "CONFIG: CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET " +
          "must be set in this Convex deployment's environment variables " +
          "(Convex dashboard -> Settings -> Environment Variables) before running this action."
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const properties = await ctx.runQuery(
      internal.seedImagesData.listDemoPropertiesForImageSeed,
      {}
    );

    const results: Array<{
      slug: string;
      status: "uploaded" | "skipped" | "error";
      imageCount?: number;
      error?: string;
    }> = [];

    for (const property of properties) {
      const sourceUrls = DEMO_PROPERTY_IMAGE_SOURCES[property.slug];
      if (!sourceUrls || sourceUrls.length === 0) {
        results.push({ slug: property.slug, status: "skipped" });
        continue;
      }

      try {
        await ctx.runMutation(internal.seedImagesData.clearPropertyImages, {
          propertyId: property._id,
        });

        for (let i = 0; i < sourceUrls.length; i++) {
          const uploadResult = await cloudinary.uploader.upload(sourceUrls[i], {
            folder: "spaceflex/properties",
            public_id: `${property.slug}-${i + 1}`,
            overwrite: true,
            resource_type: "image",
            // Light standardization so every listing image is a consistent,
            // web-friendly size regardless of the source photo's dimensions.
            transformation: [{ width: 1600, height: 1067, crop: "fill", gravity: "auto" }],
          });

          await ctx.runMutation(internal.seedImagesData.insertUploadedPropertyImage, {
            propertyId: property._id,
            cloudinaryPublicId: uploadResult.public_id,
            secureUrl: uploadResult.secure_url,
            altText: property.title,
            displayOrder: i,
            isPrimary: i === 0,
          });
        }

        results.push({ slug: property.slug, status: "uploaded", imageCount: sourceUrls.length });
      } catch (err) {
        results.push({
          slug: property.slug,
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return {
      status: "done",
      propertiesProcessed: results.length,
      uploaded: results.filter((r) => r.status === "uploaded").length,
      errors: results.filter((r) => r.status === "error"),
      results,
    };
  },
});
