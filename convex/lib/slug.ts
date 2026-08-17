import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generates a unique slug for a property, appending -2, -3, ... if needed.
 * `excludeId` is used when updating an existing property so it doesn't
 * collide with its own current slug.
 */
export async function generateUniqueSlug(
  ctx: MutationCtx,
  title: string,
  excludeId?: Id<"properties">
): Promise<string> {
  const base = slugify(title);
  if (!base) {
    throw new Error("VALIDATION: Could not generate a slug from the given title.");
  }

  let candidate = base;
  let suffix = 2;

  // Small, predictable loop - property counts in this domain are never
  // large enough for this to be a performance concern.
  while (true) {
    const existing = await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .unique();

    if (!existing || existing._id === excludeId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
