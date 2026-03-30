/** Dashboard mini-chart: anomaly events over recent windows */
export interface AnomalyActivityPoint {
  label: string;
  count: number;
}

/** Aggregated deterministic RCA file anchors for dashboard widgets */
export interface TopRootCauseFileRow {
  path: string;
  hits: number;
  trend: "up" | "down" | "flat";
}
