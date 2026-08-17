import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../lib/auth";

/**
 * Promotes an existing user to admin. Only a current admin can call this -
 * there is deliberately no self-service "become admin" path anywhere in the
 * backend, which is what stops a customer from granting themselves access
 * (see SECTION 31 testing requirement: "Customer cannot grant themselves
 * admin access").
 *
 * Bootstrapping the very first admin account (when zero admins exist yet)
 * should be done directly from the Convex dashboard's data editor, or via
 * `npx convex run admin/permissions:bootstrapFirstAdmin` from a trusted
 * machine - not from the React app.
 */
export const promoteToAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, { role: "admin", updatedAt: Date.now() });
  },
});

export const demoteToCustomer = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === args.userId) {
      throw new Error("VALIDATION: You cannot demote your own account.");
    }
    await ctx.db.patch(args.userId, { role: "customer", updatedAt: Date.now() });
  },
});

/**
 * One-time bootstrap: promotes a user to admin ONLY if no admin currently
 * exists. Intended to be run once from the Convex CLI
 * (`npx convex run admin/permissions:bootstrapFirstAdmin '{"userId":"..."}'`)
 * by a developer with deployment access - never exposed as something the
 * React app calls.
 */
export const bootstrapFirstAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const anyAdmin = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId")
      .collect();
    const adminExists = anyAdmin.some((u) => u.role === "admin");
    if (adminExists) {
      throw new Error(
        "FORBIDDEN: An admin already exists. Use promoteToAdmin as an existing admin instead."
      );
    }
    await ctx.db.patch(args.userId, { role: "admin", updatedAt: Date.now() });
  },
});
