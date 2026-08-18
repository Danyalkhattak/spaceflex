import { query } from "../_generated/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { INQUIRY_STATUSES } from "../schema";
import { requireUser, requireAdmin } from "../lib/auth";

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
        return { ...inquiry, propertyTitle: null, propertySlug: null };
      }
      const property = await ctx.db.get(inquiry.propertyId);
      return {
        ...inquiry,
        propertyTitle: property?.title ?? null,
        propertySlug: property?.slug ?? null,
      };
    })
  );
}

/** Customer: their own inquiries only. */
export const getMyInquiries = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const inquiries = await ctx.db
      .query("inquiries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    return await withPropertySummary(ctx, inquiries);
  },
});

/**
 * Customer: a single inquiry, only if it belongs to them. Returns the same
 * NOT_FOUND error whether the id doesn't exist or belongs to someone else,
 * so a customer can never confirm another customer's inquiry ID exists
 * (SECTION 18 security requirement).
 */
export const getMyInquiryById = query({
  args: { inquiryId: v.id("inquiries") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const inquiry = await ctx.db.get(args.inquiryId);
    if (!inquiry || inquiry.userId !== user._id) {
      throw new Error("NOT_FOUND: Inquiry does not exist.");
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
