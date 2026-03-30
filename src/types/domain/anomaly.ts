import type { AnomalySeverity, AnomalyStatus } from "./common";

export interface Anomaly {
  id: string;
  service: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  detectedAt: string;
  summary: string;
  signalType: string;
}
