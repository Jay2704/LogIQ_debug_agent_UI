/** Marker in API errors when the stored JWT is missing or rejected. */
export const AUTH_SESSION_EXPIRED_MARKER = "AUTH_SESSION_EXPIRED";

export function isAuthSessionExpiredError(message: string): boolean {
  const safe = message.trim();
  if (!safe) return false;
  if (safe.includes(AUTH_SESSION_EXPIRED_MARKER)) return true;
  const lower = safe.toLowerCase();
  return (
    /\b401\b/.test(safe) &&
    (lower.includes("not_authenticated") ||
      lower.includes("bearer token required") ||
      lower.includes("authorization bearer"))
  );
}

export const SESSION_EXPIRED_USER_MESSAGE =
  "Your session has expired. Please log in again.";
