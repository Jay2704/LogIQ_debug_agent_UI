/**
 * Persists the **prototype** “current user” for development — email lookup only, no credentials.
 * Replace this module with a real auth session (tokens, refresh, server-side validation) when
 * production authentication ships. Do not treat localStorage here as proof of identity.
 */
import type { User, UserRole } from "@/types";

const USER_ROLES: readonly UserRole[] = [
  "developer",
  "support_engineer",
  "tester",
  "sre",
  "viewer",
] as const;

function parseRole(raw: unknown): UserRole {
  if (
    typeof raw === "string" &&
    (USER_ROLES as readonly string[]).includes(raw)
  ) {
    return raw as UserRole;
  }
  return "viewer";
}

export const PROTOTYPE_SESSION_STORAGE_KEY = "logiq.prototype_session.v1";

export interface PrototypeSessionPayloadV1 {
  v: 1;
  user: User;
  savedAt: string;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function loadPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem(PROTOTYPE_SESSION_STORAGE_KEY);
    if (!raw?.trim()) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.v !== 1) return null;
    const user = parsed.user;
    if (!isRecord(user)) return null;
    const userId = user.userId;
    const email = user.email;
    if (typeof userId !== "string" || typeof email !== "string") return null;
    return {
      userId,
      name: typeof user.name === "string" ? user.name : "",
      email,
      role: parseRole(user.role),
      team: typeof user.team === "string" ? user.team : "",
      createdAt:
        typeof user.createdAt === "string"
          ? user.createdAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function persistUser(user: User): void {
  const payload: PrototypeSessionPayloadV1 = {
    v: 1,
    user,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(
    PROTOTYPE_SESSION_STORAGE_KEY,
    JSON.stringify(payload)
  );
}

export function clearPersistedUser(): void {
  localStorage.removeItem(PROTOTYPE_SESSION_STORAGE_KEY);
}
