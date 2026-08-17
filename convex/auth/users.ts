import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireAdmin, requireUser } from "../lib/auth";
import { assertValidEmail, assertNonEmptyString } from "../lib/validators";

/**
 * Call this once after a successful Clerk sign-in / sign-up (e.g. in a
 * top-level React effect once `useUser()` is loaded). Creates the
 * application `users` row on first sign-in, or refreshes name/email on
 * subsequent calls. The clerkUserId always comes from the verified auth
 * context - never from arguments - so a client can't impersonate another
 * account or grant itself an id.
 *
 * The role is intentionally NOT settable here: new users always start as
 * "customer". Promoting to "admin" is a deliberate manual/backend action
 * (see admin/permissions.ts:promoteToAdmin).
 */
export const ensureUser = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("UNAUTHENTICATED: Must be signed in via Clerk.");
    }

    const email = identity.email;
    if (!email) {
      throw new Error("VALIDATION: Clerk identity is missing an email address.");
    }
    assertValidEmail(email);
    assertNonEmptyString(args.name, "name");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email,
        phone: args.phone ?? existing.phone,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      email,
      name: args.name,
      phone: args.phone,
      role: "customer",
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Returns the current user's own profile, or null if signed out / not synced. */
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

/** Customer can update their own contact info. Role/active are not editable here. */
export const updateMyProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) {
      assertNonEmptyString(args.name, "name");
      patch.name = args.name;
    }
    if (args.phone !== undefined) {
      patch.phone = args.phone;
    }
    await ctx.db.patch(user._id, patch);
  },
});

/** Admin: list users, optionally filtered by role, for the admin dashboard. */
export const adminListUsers = query({
  args: {
    role: v.optional(v.union(v.literal("customer"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("users").collect();
    return args.role ? all.filter((u) => u.role === args.role) : all;
  },
});

/** Admin: activate/deactivate a user account. */
export const adminSetUserActive = mutation({
  args: {
    userId: v.id("users"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, { active: args.active, updatedAt: Date.now() });
  },
});
