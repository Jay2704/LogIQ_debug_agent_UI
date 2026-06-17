/**
 * Prototype current-user API — **not** production session management.
 * Replace with server-backed auth; keep call sites on these helpers so swapping is localized.
 */
import type { User, UserRole } from "@/types";
import { DEMO_MODE } from "@/lib/demoMode";
import { DEMO_USER } from "@/lib/demoUser";
import {
  clearPersistedUser,
  loadPersistedUser,
  persistUser,
  PROTOTYPE_SESSION_STORAGE_KEY,
} from "./prototypeSessionStorage";

/** Plain fields (snake_case) for interchange with backends or non-React code. */
export interface CurrentUserSnapshot {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  team: string;
}

export const CURRENT_USER_CHANGED_EVENT = "logiq:current-user-changed";

function isUser(x: User | CurrentUserSnapshot): x is User {
  return "userId" in x && typeof (x as User).userId === "string";
}

/** Normalizes snapshot or full `User` into the domain `User` (fills `createdAt` if missing). */
export function normalizeToUser(input: User | CurrentUserSnapshot): User {
  if (isUser(input)) {
    return input;
  }
  return {
    userId: input.user_id,
    firstName: input.first_name,
    lastName: input.last_name,
    email: input.email,
    role: input.role,
    team: input.team,
    createdAt: new Date().toISOString(),
  };
}

/** Maps domain user to a snapshot (e.g. logging, non-TS consumers). */
export function toCurrentUserSnapshot(user: User): CurrentUserSnapshot {
  return {
    user_id: user.userId,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    role: user.role,
    team: user.team,
  };
}

/** Synchronous read from localStorage — same source as React context after hydration. */
export function getCurrentUser(): User | null {
  if (DEMO_MODE) return DEMO_USER;
  return loadPersistedUser();
}

/** Persists and notifies listeners (same tab + optional cross-tab via `storage`). */
export function setCurrentUser(user: User | CurrentUserSnapshot): void {
  if (DEMO_MODE) return;
  persistUser(normalizeToUser(user));
  dispatchCurrentUserChanged();
}

export function clearCurrentUser(): void {
  if (DEMO_MODE) return;
  clearPersistedUser();
  dispatchCurrentUserChanged();
}

function dispatchCurrentUserChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CURRENT_USER_CHANGED_EVENT));
  }
}

/** Subscribe to changes from `setCurrentUser` / `clearCurrentUser` (same window). */
export function subscribeCurrentUserChanged(handler: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onCustom = () => handler();
  const onStorage = (e: StorageEvent) => {
    if (e.key === PROTOTYPE_SESSION_STORAGE_KEY) handler();
  };
  window.addEventListener(CURRENT_USER_CHANGED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CURRENT_USER_CHANGED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
