/**
 * Convex functions in this backend throw Error("CATEGORY: human message")
 * (see convex/lib/validators.ts, lib/auth.ts). The Convex client wraps that
 * message with extra call-stack noise, so this pulls out just the
 * human-readable part for display in the UI.
 */
export function getErrorMessage(error) {
  if (!error) return "Something went wrong. Please try again.";
  const raw = typeof error === "string" ? error : error.message || String(error);

  const match = raw.match(
    /(UNAUTHENTICATED|ACCOUNT_NOT_SYNCED|FORBIDDEN|NOT_FOUND|VALIDATION):\s*([^\n]+)/
  );
  if (match) return match[2].trim();

  // Fall back to the first line so we don't dump a stack trace in the UI.
  return raw.split("\n")[0].slice(0, 200);
}
