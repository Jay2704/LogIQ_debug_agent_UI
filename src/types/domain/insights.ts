/** Repeatable anomaly fingerprints surfaced for platform review */
export interface RecurringIncidentSignal {
  id: string;
  /** Human-readable pattern label */
  label: string;
  service: string;
  /** Occurrences in the rolling window */
  occurrences: number;
  lastSeen: string;
  /** vs prior window */
  trendPct: number;
}

export interface InsightMetrics {
  anomalyTrend: { date: string; count: number }[];
  anomaliesBySeverity: { name: string; value: number; fill: string }[];
  confidenceDistribution: { range: string; count: number }[];
  topServices: { service: string; count: number }[];
  recurringSignals: RecurringIncidentSignal[];
  avgResolutionMinutes: number;
  totalAnomalies: number;
  monitoredServices: number;
}
