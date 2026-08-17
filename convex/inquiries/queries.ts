import { query } from "../_generated/server";
import { v } from "convex/values";
import { INQUIRY_STATUSES } from "../schema";
import { requireUser, requireAdmin } from "../lib/auth";

/** Customer: their own inquiries only. */
export const getMyInquiries = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return await ctx.db
      .query("inquiries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
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
    if (args.status) {
      return await ctx.db
        .query("inquiries")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("inquiries").order("desc").collect();
  },
});

export const getInquiryById = query({
  args: { inquiryId: v.id("inquiries") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.inquiryId);
  },
});
