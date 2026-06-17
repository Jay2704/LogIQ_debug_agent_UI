import type { User } from "@/types";

/** Injected session user when {@link DEMO_MODE} is enabled. */
export const DEMO_USER: User = {
  userId: "demo-user",
  firstName: "Conference",
  lastName: "Demo User",
  email: "demo@logiq.ai",
  role: "sre",
  team: "Conference Demo",
  createdAt: "2026-01-01T00:00:00.000Z",
};
