import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/auth";
import { LandingPage } from "@/pages/LandingPage";

/** Settings surfaces work for guests (prototype session); other deep links require login. */
function isGuestAccessiblePath(pathname: string): boolean {
  return pathname === "/settings" || pathname.startsWith("/settings/");
}

/**
 * Guests see a public landing page at `/` only; `/settings/*` is reachable without login.
 * Other deep links redirect home. Authenticated users render the nested {@link AppLayout}.
 */
export function AuthenticatedAppShell() {
  const { user } = useCurrentUser();
  const location = useLocation();

  const authed = Boolean(user?.userId?.trim());

  if (!authed) {
    if (location.pathname === "/") {
      return <LandingPage />;
    }
    if (isGuestAccessiblePath(location.pathname)) {
      return <Outlet />;
    }
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
