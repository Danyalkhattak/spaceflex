import { useEffect, useRef } from "react";
import { useUser } from "@clerk/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Mounted once near the root of the app. Calls auth/users:ensureUser after
 * a successful Clerk sign-in, exactly as documented in the backend README
 * ("Call this once after a successful Clerk sign-in / sign-up"). Renders
 * nothing - it only keeps the Convex `users` row in sync with Clerk.
 */
const EnsureUserSynced = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const ensureUser = useMutation(api.auth.users.ensureUser);
  const syncedForUserId = useRef(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
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
  }, [isLoaded, isSignedIn, user, ensureUser]);

  return null;
};

export default EnsureUserSynced;
