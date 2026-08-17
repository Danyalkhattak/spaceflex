import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { BOOKING_TYPES, BOOKING_STATUSES } from "../schema";
import { requireUser, requireAdmin } from "../lib/auth";
import {
  assertValidDateRange,
  assertPositiveInteger,
  assertValidEmail,
  assertNonEmptyString,
} from "../lib/validators";

/**
 * Creates a booking. Every trust-sensitive value (price, totalAmount,
 * userId, property state) is computed/derived by the backend - the client
 * only supplies the property, dates, and quantity it wants. This directly
 * satisfies SECTION 14/16/31: a client cannot manipulate price or claim
 * another user's identity.
 */
export const createBooking = mutation({
  args: {
    propertyId: v.id("properties"),
    bookingType: BOOKING_TYPES,
    startDate: v.number(),
    endDate: v.number(),
    quantity: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    assertValidDateRange(args.startDate, args.endDate);
    assertPositiveInteger(args.quantity, "quantity");

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("NOT_FOUND: Property does not exist.");
    }
    if (!property.isActive) {
      throw new Error("VALIDATION: This property is not currently available.");
    }
    if (!property.isBookable) {
      throw new Error(
        "VALIDATION: This property is not directly bookable. Please submit an inquiry instead."
      );
    }
    if (property.capacity !== undefined && args.quantity > property.capacity) {
      throw new Error(
        `VALIDATION: Requested quantity (${args.quantity}) exceeds available capacity (${property.capacity}).`
      );
    }

    // Basic double-booking guard for capacity-limited, date-ranged
    // resources (e.g. a meeting room can't be double-booked for the same
    // slot). We sum quantities of overlapping, non-cancelled bookings.
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
    const capacity = property.capacity ?? Number.POSITIVE_INFINITY;
    if (bookedQuantity + args.quantity > capacity) {
      throw new Error(
        "VALIDATION: This property does not have enough availability for the selected dates and quantity."
      );
    }

    // Price is computed server-side from the property's current price -
    // never accepted from the client.
    const unitsForPeriod = computeUnits(property.pricePeriod, args.startDate, args.endDate);
    const unitPrice = property.price;
    const totalAmount = Math.round(unitPrice * unitsForPeriod * args.quantity * 100) / 100;

    const now = Date.now();
    const bookingId = await ctx.db.insert("bookings", {
      userId: user._id,
      propertyId: args.propertyId,
      bookingType: args.bookingType,
      startDate: args.startDate,
      endDate: args.endDate,
      quantity: args.quantity,
      unitPrice,
      totalAmount,
      currency: property.currency,
      status: "pending",
      paymentStatus: "pending",
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return { bookingId, totalAmount, currency: property.currency };
  },
});

/** Converts a date range into billable units for the property's price period. */
function computeUnits(
  pricePeriod: "hour" | "day" | "month" | "year" | "one_time",
  startDate: number,
  endDate: number
): number {
  if (pricePeriod === "one_time") return 1;
  const ms = endDate - startDate;
  const hour = 60 * 60 * 1000;
  switch (pricePeriod) {
    case "hour":
      return Math.max(1, Math.ceil(ms / hour));
    case "day":
      return Math.max(1, Math.ceil(ms / (hour * 24)));
    case "month":
      return Math.max(1, Math.ceil(ms / (hour * 24 * 30)));
    case "year":
      return Math.max(1, Math.ceil(ms / (hour * 24 * 365)));
    default:
      return 1;
  }
}

/** Customer: cancel their own pending/confirmed booking. */
export const cancelMyBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("NOT_FOUND: Booking does not exist.");
    if (booking.userId !== user._id) {
      throw new Error("FORBIDDEN: You can only cancel your own bookings.");
    }
    if (booking.status === "completed") {
      throw new Error("VALIDATION: A completed booking cannot be cancelled.");
    }
    await ctx.db.patch(args.bookingId, { status: "cancelled", updatedAt: Date.now() });
  },
});

/** Admin: update booking status (e.g. confirm, complete, cancel). */
export const adminUpdateBookingStatus = mutation({
  args: { bookingId: v.id("bookings"), status: BOOKING_STATUSES },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("NOT_FOUND: Booking does not exist.");
    await ctx.db.patch(args.bookingId, { status: args.status, updatedAt: Date.now() });
  },
});
