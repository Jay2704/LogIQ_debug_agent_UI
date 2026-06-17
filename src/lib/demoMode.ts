/**
 * Temporary conference demo flag — set `VITE_DEMO_MODE=true` at build time.
 * Disable (unset or `false`) to restore full authentication behavior with no code changes.
 */
export const DEMO_MODE =
  String(import.meta.env.VITE_DEMO_MODE ?? "")
    .trim()
    .toLowerCase() === "true";

/** Primary conference demo entry — JIRA RCA workspace. */
export const DEMO_WORKSPACE_PATH = "/rca-jira";

/** CTA target for “Open Workspace” on marketing/landing surfaces. */
export function getOpenWorkspacePath(): string {
  return DEMO_MODE ? DEMO_WORKSPACE_PATH : "/login";
}

/** Secondary CTA target for “Create account” on landing surfaces. */
export function getCreateAccountPath(): string {
  return DEMO_MODE ? DEMO_WORKSPACE_PATH : "/signup";
}

/** Auth-route redirect target when demo mode bypasses login flows. */
export function getDemoAuthRedirectPath(): string {
  return DEMO_WORKSPACE_PATH;
}
