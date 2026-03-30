import type { InsightMetrics } from "@/types";

export const mockInsightMetrics: InsightMetrics = {
  anomalyTrend: [
    { date: "Mar 22", count: 12 },
    { date: "Mar 23", count: 9 },
    { date: "Mar 24", count: 14 },
    { date: "Mar 25", count: 11 },
    { date: "Mar 26", count: 8 },
    { date: "Mar 27", count: 15 },
    { date: "Mar 28", count: 13 },
    { date: "Mar 29", count: 10 },
  ],
  anomaliesBySeverity: [
    { name: "Critical", value: 4, fill: "#ef4444" },
    { name: "High", value: 11, fill: "#f97316" },
    { name: "Medium", value: 18, fill: "#f59e0b" },
    { name: "Low", value: 9, fill: "#64748b" },
  ],
  confidenceDistribution: [
    { range: "0.0–0.5", count: 3 },
    { range: "0.5–0.7", count: 7 },
    { range: "0.7–0.85", count: 14 },
    { range: "0.85–1.0", count: 18 },
  ],
  topServices: [
    { service: "checkout-service", count: 11 },
    { service: "auth-service", count: 8 },
    { service: "payment-gateway", count: 7 },
    { service: "user-profile-api", count: 5 },
    { service: "notification-service", count: 4 },
  ],
  avgResolutionMinutes: 47,
  totalAnomalies: 42,
  monitoredServices: 128,
};
