import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/** Returns { profile, isLoading, isAdmin } for the signed-in Clerk user. */
export function useCurrentUser() {
  const profile = useQuery(api.auth.users.getMyProfile);
  return {
    profile: profile ?? null,
    isLoading: profile === undefined,
    isAdmin: profile?.role === "admin",
  };
}
