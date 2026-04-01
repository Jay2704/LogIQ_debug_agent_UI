/**
 * Backend user row (PostgreSQL-backed). Used for signup-style create and lookup
 * without session/token auth in the UI yet.
 */

/** Allowed `role` values from the backend — keep in sync with server constraints. */
export type UserRole =
  | "developer"
  | "support_engineer"
  | "tester"
  | "sre"
  | "viewer";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  createdAt: string;
}

/** POST /api/v1/users — camelCase in app code; serialized for HTTP in {@link import('@/api/http/parseUserApi').serializeCreateUserBody}. */
export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  team: string;
  /** Plain password for signup — never persisted in localStorage; sent only in the create request body. */
  password: string;
}

/** Sign Up form — labels aligned with backend `UserRole` values. */
export const SIGNUP_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "developer", label: "Developer" },
  { value: "support_engineer", label: "Support engineer" },
  { value: "tester", label: "Tester" },
  { value: "sre", label: "SRE" },
  { value: "viewer", label: "Viewer" },
];
