import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

/**
 * All authorization in this backend flows through these helpers. Nothing
 * ever trusts a userId, role, or "isAdmin" flag supplied by the client -
 * the Clerk identity on the request is the only source of truth, and the
 * application `users` row (looked up by clerkUserId) is the only source of
 * role information.
 */

type Ctx = QueryCtx | MutationCtx;

/**
 * Returns the application user row for the currently authenticated Clerk
 * identity, or null if the request is unauthenticated or the identity has
 * no matching users row yet (e.g. sign-up hasn't synced yet).
 */
export async function getCurrentUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  return user;
}

/** Throws if there is no authenticated + synced user. Returns the user row. */
export async function requireUser(ctx: Ctx): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("UNAUTHENTICATED: You must be signed in to do this.");
  }
  if (!user.active) {
    throw new Error("FORBIDDEN: This account has been deactivated.");
  }
  return user;
}

/** Throws unless the authenticated user has the admin role. Returns the user row. */
export async function requireAdmin(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role !== "admin") {
    throw new Error("FORBIDDEN: This action requires administrator access.");
  }
  return user;
}
