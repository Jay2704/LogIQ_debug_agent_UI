/** Form models for auth UI — wire to API contracts when backend exists */

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
