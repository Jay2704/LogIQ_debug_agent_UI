/**
 * Auth form models and submit shapes for the LogIQ Debug Agent UI.
 * Sign up uses `POST /api/v1/users`. Login uses prototype email lookup only — see `@/auth`.
 */

import type { User, UserRole } from "./domain/user";

/** Email-only form for prototype login (`GET /api/v1/users/by-email/...`). */
export interface LoginFormValues {
  email: string;
}

/** Result of `submitLoginLookup` — not a credential-based auth response. */
export interface LoginLookupResult {
  status: "success" | "error";
  message?: string;
  user?: User;
}

/** Onboarding profile — no passwords; persisted via `POST /api/v1/users`. */
export interface SignupFormValues {
  fullName: string;
  email: string;
  role: UserRole | "";
  team: string;
}

/** Placeholder result shape for future `login()` / `signup()` API calls */
export type AuthSubmitStatus = "idle" | "loading" | "success" | "error";

export interface AuthSubmitResult {
  status: AuthSubmitStatus;
  message?: string;
}
