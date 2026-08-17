import { query } from "../_generated/server";
import { v } from "convex/values";
import { BOOKING_STATUSES } from "../schema";
import { requireUser, requireAdmin } from "../lib/auth";

/** Customer: their own booking list. */
export const getMyBookings = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    return bookings;
  },
});

/** Customer: a single booking of their own, with a 404-style not-found for others' bookings. */
export const getMyBookingById = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking || booking.userId !== user._id) {
      // Deliberately the same error for "doesn't exist" and "not yours" so
      // customers can't use this to probe which booking IDs exist.
      throw new Error("NOT_FOUND: Booking does not exist.");
    }
    return booking;
  },
});

/** Admin: all bookings, optionally filtered by status or property. */
export const adminGetAllBookings = query({
  args: {
    status: v.optional(BOOKING_STATUSES),
    propertyId: v.optional(v.id("properties")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let bookings;
    if (args.propertyId) {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId!))
        .order("desc")
        .collect();
    } else if (args.status) {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      bookings = await ctx.db.query("bookings").order("desc").collect();
    }

    if (args.status && args.propertyId) {
      bookings = bookings.filter((b) => b.status === args.status);
    }

    return bookings;
  },
});

export const adminGetBookingById = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.bookingId);
  },
});
