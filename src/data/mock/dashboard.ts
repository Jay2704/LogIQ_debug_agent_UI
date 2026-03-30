import type { AnomalyActivityPoint, TopRootCauseFileRow } from "@/types";

/** Last 12 hours — synthetic anomaly event counts for dashboard mini-chart. */
export const mockAnomalyActivity: AnomalyActivityPoint[] = [
  { label: "00:00", count: 1 },
  { label: "02:00", count: 0 },
  { label: "04:00", count: 2 },
  { label: "06:00", count: 1 },
  { label: "08:00", count: 3 },
  { label: "10:00", count: 2 },
  { label: "12:00", count: 4 },
  { label: "14:00", count: 6 },
  { label: "16:00", count: 3 },
  { label: "18:00", count: 2 },
  { label: "20:00", count: 1 },
  { label: "22:00", count: 1 },
];

/** Ranked file paths from deterministic RCA across the workspace (rolling). */
export const mockTopRootCauseFiles: TopRootCauseFileRow[] = [
  {
    path: "src/handlers/checkout_handler.py",
    hits: 24,
    trend: "up",
  },
  {
    path: "services/payment/retry_manager.ts",
    hits: 18,
    trend: "up",
  },
  {
    path: "api/auth/session_validator.py",
    hits: 15,
    trend: "flat",
  },
  {
    path: "user-profile-api/src/repositories/profile_store.py",
    hits: 9,
    trend: "down",
  },
  {
    path: "services/payment/idempotency_store.go",
    hits: 7,
    trend: "flat",
  },
];
