import { useEffect, useRef } from "react";
import { useUser } from "@clerk/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Calls the existing `auth/users:ensureUser` mutation once per sign-in so
 * the Convex `users` row exists/stays in sync before any inquiry or
 * property-management mutation that relies on `requireUser`/`requireAdmin`
 * runs. This does not create a new auth system - it just wires the React
 * app up to the sync step the backend already expects (see README.md
 * "Frontend function contract").
 */
export function useEnsureUser() {
  const { isSignedIn, user, isLoaded } = useUser();
  const ensureUser = useMutation(api.auth.users.ensureUser);
  const syncedFor = useRef(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (syncedFor.current === user.id) return;

    syncedFor.current = user.id;
    ensureUser({
      name: user.fullName || user.username || "SpaceFlex User",
      phone: user.primaryPhoneNumber?.phoneNumber,
    }).catch(() => {
      // Non-fatal: the next mutation that requires a synced user will
      // surface an UNAUTHENTICATED error via requireUser, which the calling
      // page already handles.
      syncedFor.current = null;
    });
  }, [isLoaded, isSignedIn, user, ensureUser]);
}
