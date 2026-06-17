import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/auth";
import { DEMO_MODE } from "@/lib/demoMode";
import { LandingPage } from "@/pages/LandingPage";

/**
 * Guests see a public landing page at `/` only; deep links require login and redirect home.
 * Authenticated users render the nested {@link AppLayout} route (sidebar, topbar, app pages).
 * When {@link DEMO_MODE} is enabled, all app routes are accessible without login.
 */
export function AuthenticatedAppShell() {
  const { user } = useCurrentUser();
  const location = useLocation();

  if (DEMO_MODE) {
    return <Outlet />;
  }

  const authed = Boolean(user?.userId?.trim());

  if (!authed) {
    if (location.pathname === "/") {
      return <LandingPage />;
    }
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
