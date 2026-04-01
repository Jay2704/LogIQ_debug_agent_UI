import type { User } from "@/types";

/** Human-readable role for UI (backend uses snake_case enums). */
export function formatUserRoleLabel(role: User["role"]): string {
  return role.replace(/_/g, " ");
}

/** Single line for topbar / previews: role and team. */
export function formatUserContextLine(user: User): string {
  const role = formatUserRoleLabel(user.role);
  return user.team.trim() ? `${role} · ${user.team}` : role;
}
