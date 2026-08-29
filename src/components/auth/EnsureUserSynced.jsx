import { useEffect, useRef } from "react";
import { useUser } from "@clerk/react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Mounted once near the root of the app. Calls auth/users:ensureUser after a
 * successful Clerk sign-in. Renders nothing - it only keeps the Convex
 * `users` row in sync with Clerk.
 *
 * IMPORTANT: this waits for useConvexAuth().isAuthenticated, not just Clerk's
 * isSignedIn. Right after sign-in there is a window where Clerk has a session
 * but the Convex client has not attached the first JWT yet; calling ensureUser
 * inside that window throws UNAUTHENTICATED (the errors seen in `npx convex
 * dev` logs). Gating on isAuthenticated removes that race entirely, and the
 * effect re-fires when authentication completes.
 */
const EnsureUserSynced = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const ensureUser = useMutation(api.auth.users.ensureUser);
  const syncedForUserId = useRef(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || !isAuthenticated) return;
    if (syncedForUserId.current === user.id) return;

    syncedForUserId.current = user.id;
    const name = user.fullName || user.primaryEmailAddress?.emailAddress || "SpaceFlex User";
    const phone = user.primaryPhoneNumber?.phoneNumber;

    ensureUser({ name, phone }).catch((err) => {
      // Non-fatal: the app still works read-only if this fails, and it will
      // retry on the next sign-in / mount.
      console.error("Failed to sync user profile:", err);
      syncedForUserId.current = null;
    });
  }, [isLoaded, isSignedIn, user, isAuthenticated, ensureUser]);

  return null;
};

export default EnsureUserSynced;
