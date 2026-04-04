/**
 * Auth form models and submit shapes for the LogIQ Debug Agent UI.
 * Sign up uses `POST /api/v1/users` (with password). Login uses `POST /api/v1/auth/login`.
 */

import type { User, UserRole } from "./domain/user";

/** Credential payload for `POST /api/v1/auth/login` (app layer — not stored client-side). */
export interface LoginInput {
  email: string;
  password: string;
}

/** Login form — password is never written to localStorage. */
export interface LoginFormValues {
  email: string;
  password: string;
}

/** Result of `submitLogin`. */
export interface LoginSubmitResult {
  status: "success" | "error";
  message?: string;
  user?: User;
  /** Set when the server rejects login because the email is not verified yet. */
  reason?: "unverified";
}

/** @deprecated Use {@link LoginSubmitResult}. */
export type LoginLookupResult = LoginSubmitResult;

/** Onboarding profile — password sent only on create; not persisted in the browser store. */
export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole | "";
  team: string;
}

/** Placeholder result shape for future `login()` / `signup()` API calls */
export type AuthSubmitStatus = "idle" | "loading" | "success" | "error";

export interface AuthSubmitResult {
  status: AuthSubmitStatus;
  message?: string;
}
