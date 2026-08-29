import { query } from "../_generated/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { INQUIRY_STATUSES } from "../schema";
import { getCurrentUser, requireAdmin } from "../lib/auth";

/**
 * Enriches inquiries with the property title/slug they refer to, so the
 * customer "My Inquiries" list and the admin inquiry dashboard can show
 * which listing an inquiry is about (and link to it) instead of just the
 * generic inquiryType/message - previously a customer or admin with more
 * than one inquiry on file had no way to tell them apart. `propertyId` is
 * optional on inquiries (general leasing questions have none), so this is
 * a single best-effort lookup per inquiry, not a join that can fail the
 * whole list if one property was since deleted.
 */
async function withPropertySummary(
  ctx: { db: { get: (id: any) => Promise<Doc<"properties"> | null> } },
  inquiries: Doc<"inquiries">[]
) {
  return await Promise.all(
    inquiries.map(async (inquiry) => {
      if (!inquiry.propertyId) {
        return { ...inquiry, propertyTitle: null, propertySlug: null, propertyCategory: null };
      }
      const property = await ctx.db.get(inquiry.propertyId);
      return {
        ...inquiry,
        propertyTitle: property?.title ?? null,
        propertySlug: property?.slug ?? null,
        // Included so the frontend can link to the right pillar's detail
        // page (enterprise/coworking/housing) instead of assuming one.
        propertyCategory: property?.category ?? null,
      };
    })
  );
}

/**
 * Customer: their own inquiries only.
 *
 * Uses getCurrentUser (not requireUser) and returns [] when the Clerk
 * identity has no synced users row yet - right after sign-up this query
 * races auth/users:ensureUser, and a thrown UNAUTHENTICATED here would
 * crash the page instead of showing the empty state.
 */
export const getMyInquiries = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const inquiries = await ctx.db
      .query("inquiries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    return await withPropertySummary(ctx, inquiries);
  },
});

/**
 * Customer: a single inquiry, only if it belongs to them. Returns null for
 * "doesn't exist", "not yours", and "not yet synced", so a customer can
 * never confirm another customer's inquiry ID exists (SECTION 18 security
 * requirement) and a freshly-signed-in user sees the empty state instead of
 * a thrown error.
 */
export const getMyInquiryById = query({
  args: { inquiryId: v.id("inquiries") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const inquiry = await ctx.db.get(args.inquiryId);
    if (!inquiry || inquiry.userId !== user._id) {
      return null;
    }
    return inquiry;
  },
});

/** Admin: all inquiries, optionally filtered by status. */
export const getAllInquiries = query({
  args: { status: v.optional(INQUIRY_STATUSES) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const inquiries = args.status
      ? await ctx.db
          .query("inquiries")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("inquiries").order("desc").collect();
    return await withPropertySummary(ctx, inquiries);
  },
});

export const getInquiryById = query({
  args: { inquiryId: v.id("inquiries") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.inquiryId);
  },
});
