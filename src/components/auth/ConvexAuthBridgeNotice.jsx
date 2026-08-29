import { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/react";
import { useConvexAuth } from "convex/react";
import Icon from "../ui/Icon.jsx";

/**
 * Self-diagnosing banner for the single most common Clerk<->Convex integration
 * failure: Clerk reports the user as signed in, but the Convex client never
 * obtains an accepted identity (so every mutation throws UNAUTHENTICATED).
 *
 * That state is either (a) a normal multi-second delay right after sign-in
 * while the first token attaches, or (b) a deployment misconfiguration:
 *   1. missing Clerk JWT template named exactly "convex", or
 *   2. missing/incorrect CLERK_JWT_ISSUER_DOMAIN on the Convex deployment.
 *
 * After a 6s grace period we surface actionable guidance instead of leaving
 * the user stuck with cryptic "You must be signed in to do this." errors.
 * Renders nothing when auth is healthy or the user is signed out.
 *
 * Implementation: the outer component derives "bridge broken" purely from
 * reactive auth state and mounts <BridgeBanner /> only while broken, so each
 * broken episode gets a fresh component instance (fresh 6s grace + dismissal).
 * All state updates happen from timers or click handlers, keeping the
 * react-hooks rules happy (no setState in effect bodies, no refs in render).
 */
const GRACE_MS = 6000;

const ConvexAuthBridgeNotice = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { isLoading, isAuthenticated } = useConvexAuth();

  const bridgeBroken = Boolean(isLoaded && isSignedIn && !isLoading && !isAuthenticated);

  if (!bridgeBroken) return null;
  return <BridgeBanner />;
};

const BridgeBanner = () => {
  const [show, setShow] = useState(false);
  const [snoozed, setSnoozed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), GRACE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!show || snoozed) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:px-5 flex items-start gap-3 shadow-sm animate-fade-in">
        <Icon name="shield" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">
            Signed in, but your session can&apos;t reach the booking server yet
          </p>
          <p className="mt-1 text-sm text-amber-800 leading-relaxed">
            Booking and profile sync require Clerk to issue Convex tokens. This usually resolves
            within a few seconds — try signing out and back in. If it persists, the deployment is
            missing one of: a Clerk JWT template named{" "}
            <code className="px-1 py-0.5 rounded bg-amber-100 text-xs">convex</code>, or the{" "}
            <code className="px-1 py-0.5 rounded bg-amber-100 text-xs">CLERK_JWT_ISSUER_DOMAIN</code>{" "}
            environment variable on the Convex deployment (see README §1).
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <SignOutButton>
              <button
                type="button"
                className="text-xs font-semibold rounded-lg px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
              >
                Sign out &amp; back in
              </button>
            </SignOutButton>
            <button
              type="button"
              onClick={() => setSnoozed(true)}
              className="text-xs font-semibold rounded-lg px-2.5 py-1.5 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvexAuthBridgeNotice;
