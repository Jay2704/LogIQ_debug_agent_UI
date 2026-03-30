import { useEffect, useState } from "react";
import { api } from "@/api";
import type { Anomaly, Job, RcaResult } from "@/types";

export interface DashboardDataState {
  jobs: Job[];
  anomalies: Anomaly[];
  rcaByJobId: Record<string, RcaResult>;
  loading: boolean;
  error: Error | null;
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardDataState>({
    jobs: [],
    anomalies: [],
    rcaByJobId: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.jobs.list(),
      api.anomalies.list(),
      api.rca.getByJobIdMap(),
    ])
      .then(([jobs, anomalies, rcaByJobId]) => {
        if (!cancelled) {
          setState({
            jobs,
            anomalies,
            rcaByJobId,
            loading: false,
            error: null,
          });
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: e instanceof Error ? e : new Error(String(e)),
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
