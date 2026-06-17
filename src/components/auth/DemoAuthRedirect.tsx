import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { DEMO_MODE, getDemoAuthRedirectPath } from "@/lib/demoMode";

/**
 * When demo mode is on, auth routes redirect to the workspace instead of rendering login flows.
 * Auth pages and APIs remain in the codebase for production use.
 */
export function DemoAuthRedirect({ children }: { children: ReactNode }) {
  if (DEMO_MODE) {
    return <Navigate to={getDemoAuthRedirectPath()} replace />;
  }
  return <>{children}</>;
}
