import type { User, UserRole } from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  developer: "Developer",
  support_engineer: "Support engineer",
  tester: "Tester",
  sre: "SRE",
  viewer: "Viewer",
};

export function formatUserRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}

/** Secondary line in header / profile (role and team). */
export function formatUserContextLine(user: User): string {
  const role = formatUserRoleLabel(user.role);
  const team = user.team?.trim();
  return team ? `${role} · ${team}` : role;
}

/** Single string for menus and labels from first + last name. */
export function userDisplayName(user: Pick<User, "firstName" | "lastName">): string {
  const a = user.firstName.trim();
  const b = user.lastName.trim();
  return [a, b].filter(Boolean).join(" ");
}
