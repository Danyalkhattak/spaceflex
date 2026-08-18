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

/**
 * Public: check remaining availability for a property over a date range,
 * without creating a booking. Mirrors the exact overlap + capacity math
 * `createBooking` uses (see mutations.ts) so the number shown to a customer
 * before they submit the form always matches what the server will actually
 * enforce. No auth required - this powers the booking form's live
 * availability check for signed-out browsers too.
 */
export const checkAvailability = query({
  args: {
    propertyId: v.id("properties"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("NOT_FOUND: Property does not exist.");
    }

    const capacity = property.capacity ?? Number.POSITIVE_INFINITY;

    if (
      !Number.isFinite(args.startDate) ||
      !Number.isFinite(args.endDate) ||
      args.endDate <= args.startDate
    ) {
      return {
        isAvailable: false,
        capacity: property.capacity ?? null,
        bookedQuantity: 0,
        availableQuantity: property.capacity ?? null,
        reason: "VALIDATION: endDate must be after startDate.",
      };
    }

    const existingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_property_dates", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    const overlapping = existingBookings.filter(
      (b) =>
        b.status !== "cancelled" &&
        args.startDate < b.endDate &&
        args.endDate > b.startDate
    );
    const bookedQuantity = overlapping.reduce((sum, b) => sum + b.quantity, 0);
    const availableQuantity = Number.isFinite(capacity)
      ? Math.max(0, capacity - bookedQuantity)
      : null;

    return {
      isAvailable:
        !property.isActive || !property.isBookable
          ? false
          : availableQuantity === null || availableQuantity > 0,
      capacity: property.capacity ?? null,
      bookedQuantity,
      availableQuantity,
      isActive: property.isActive,
      isBookable: property.isBookable,
    };
  },
});
