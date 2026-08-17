import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireUser, requireAdmin } from "../lib/auth";

/**
 * DEMO / CAPSTONE PAYMENT FLOW ONLY - this is not a real payment gateway
 * integration. It never accepts or stores card numbers, CVVs, or any real
 * payment credential. It only moves a booking through a fake state
 * machine so the frontend can demonstrate a checkout flow:
 *
 *   pending -> demo_paid -> (booking becomes "confirmed")
 *   pending -> failed
 *   demo_paid -> refunded
 *
 * The React "Demo Payment" screen must clearly label this as a simulated
 * payment and must never claim real money was processed.
 */
export const simulateDemoPayment = mutation({
  args: {
    bookingId: v.id("bookings"),
    outcome: v.union(v.literal("success"), v.literal("failure")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("NOT_FOUND: Booking does not exist.");
    if (booking.userId !== user._id) {
      throw new Error("FORBIDDEN: You can only pay for your own bookings.");
    }
    if (booking.paymentStatus !== "pending") {
      throw new Error(
        `VALIDATION: This booking's payment is already "${booking.paymentStatus}" and cannot be re-paid.`
      );
    }
    if (booking.status === "cancelled") {
      throw new Error("VALIDATION: This booking has been cancelled.");
    }

    const now = Date.now();
    if (args.outcome === "success") {
      await ctx.db.patch(args.bookingId, {
        paymentStatus: "demo_paid",
        status: "confirmed",
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(args.bookingId, {
        paymentStatus: "failed",
        updatedAt: now,
      });
    }
  },
});

/** Admin: mark a demo_paid booking as refunded (e.g. after cancellation). */
export const adminRefundDemoPayment = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("NOT_FOUND: Booking does not exist.");
    if (booking.paymentStatus !== "demo_paid") {
      throw new Error('VALIDATION: Only a "demo_paid" booking can be refunded.');
    }
    await ctx.db.patch(args.bookingId, {
      paymentStatus: "refunded",
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});
