import type { User } from "@/types";

/** Resolve workspace id for integrations and RCA runs from the current user session. */
export function resolveWorkspaceId(user: User | null | undefined): string {
  const team = user?.team?.trim();
  if (team) return team;
  const userId = user?.userId?.trim();
  if (userId) return userId;
  return "default";
}
