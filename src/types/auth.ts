/**
 * Auth form models and submit shapes for the LogIQ Debug Agent UI.
 * Replace placeholder handlers in `@/lib/authHandlers` with real API calls
 * (e.g. `POST /auth/login`, session cookies or bearer tokens) when backend exists.
 */

export type AuthTeamRole =
  | "sre"
  | "platform"
  | "developer"
  | "security"
  | "other";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormValues {
  fullName: string;
  workEmail: string;
  password: string;
  confirmPassword: string;
  teamRole: AuthTeamRole | "";
}

export const TEAM_ROLE_OPTIONS: { value: AuthTeamRole; label: string }[] = [
  { value: "sre", label: "SRE / Reliability" },
  { value: "platform", label: "Platform Engineering" },
  { value: "developer", label: "Application Developer" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

/** Placeholder result shape for future `login()` / `signup()` API calls */
export type AuthSubmitStatus = "idle" | "loading" | "success" | "error";

export interface AuthSubmitResult {
  status: AuthSubmitStatus;
  message?: string;
}
