import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { INQUIRY_TYPES, INQUIRY_STATUSES } from "../schema";
import { requireUser, requireAdmin } from "../lib/auth";
import { assertNonEmptyString, assertMaxLength, assertValidEmail } from "../lib/validators";

/**
 * Shared inquiry entry point used by enterprise office leasing, virtual
 * office / mail handling / offshore address requests, and inquiry-based
 * housing (SECTIONS 17, 19, 21) - one table, one code path, instead of a
 * duplicated system per category.
 */
export const createInquiry = mutation({
  args: {
    propertyId: v.optional(v.id("properties")),
    companyName: v.optional(v.string()),
    message: v.string(),
    inquiryType: INQUIRY_TYPES,
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    assertNonEmptyString(args.message, "message");
    assertMaxLength(args.message, "message", 3000);
    assertValidEmail(user.email);

    if (args.propertyId) {
      const property = await ctx.db.get(args.propertyId);
      if (!property) {
        throw new Error("NOT_FOUND: Property does not exist.");
      }
    }

    const now = Date.now();
    return await ctx.db.insert("inquiries", {
      userId: user._id,
      propertyId: args.propertyId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: args.companyName,
      message: args.message,
      inquiryType: args.inquiryType,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Admin: move an inquiry through its lifecycle. */
export const updateInquiryStatus = mutation({
  args: { inquiryId: v.id("inquiries"), status: INQUIRY_STATUSES },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const inquiry = await ctx.db.get(args.inquiryId);
    if (!inquiry) throw new Error("NOT_FOUND: Inquiry does not exist.");
    await ctx.db.patch(args.inquiryId, { status: args.status, updatedAt: Date.now() });
  },
});

/** Admin: attach internal follow-up notes to an inquiry. */
export const updateInquiryNotes = mutation({
  args: { inquiryId: v.id("inquiries"), adminNotes: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    assertMaxLength(args.adminNotes, "adminNotes", 3000);
    const inquiry = await ctx.db.get(args.inquiryId);
    if (!inquiry) throw new Error("NOT_FOUND: Inquiry does not exist.");
    await ctx.db.patch(args.inquiryId, {
      adminNotes: args.adminNotes,
      updatedAt: Date.now(),
    });
  },
});
