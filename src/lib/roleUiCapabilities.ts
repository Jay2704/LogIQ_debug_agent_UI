import { useMemo } from "react";
import { useCurrentUser } from "@/auth";
import type { User, UserRole } from "@/types";

/**
 * Frontend-only UX hints derived from `User.role` — **not** authorization.
 * The API must still enforce access; this only adjusts buttons and copy.
 */
export interface RoleUiCapabilities {
  /** POST /api/v1/jobs — create flow on Jobs + modals */
  canCreateJob: boolean;
  /** Job detail: run debug-agent / RCA pipeline */
  canRunInvestigationPipeline: boolean;
  /** Dashboard + Jobs hero “Run Debug Agent” shortcut */
  canUseRunDebugShortcut: boolean;
}

export function getRoleUiCapabilities(
  role: UserRole | undefined | null
): RoleUiCapabilities {
  if (!role) {
    return {
      canCreateJob: false,
      canRunInvestigationPipeline: false,
      canUseRunDebugShortcut: false,
    };
  }
  switch (role) {
    case "viewer":
      return {
        canCreateJob: false,
        canRunInvestigationPipeline: false,
        canUseRunDebugShortcut: false,
      };
    case "tester":
    case "support_engineer":
    case "developer":
    case "sre":
      return {
        canCreateJob: true,
        canRunInvestigationPipeline: true,
        canUseRunDebugShortcut: true,
      };
    default: {
      return {
        canCreateJob: false,
        canRunInvestigationPipeline: false,
        canUseRunDebugShortcut: false,
      };
    }
  }
}

export function useRoleUiCapabilities(): RoleUiCapabilities {
  const { user } = useCurrentUser();
  return useMemo(
    () => getRoleUiCapabilities(user?.role ?? null),
    [user?.role]
  );
}

/** Tooltip when the Run Debug Agent shortcut is disabled (guest vs viewer). */
export function getRunDebugShortcutDisabledTitle(
  user: User | null | undefined
): string {
  if (!user?.userId?.trim()) {
    return "Login to use this shortcut (UI only — not a security guarantee).";
  }
  return "Viewer role: shortcut disabled here (prototype UX only).";
}

/** Tooltip when Run investigation is disabled on job detail. */
export function getRunInvestigationDisabledTitle(
  user: User | null | undefined
): string {
  if (!user?.userId?.trim()) {
    return "Login with a non-viewer account to run the pipeline (UI only).";
  }
  return "Viewer role cannot run the pipeline (UI only — API may still allow requests).";
}
