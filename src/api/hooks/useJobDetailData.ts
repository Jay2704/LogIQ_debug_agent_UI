import { useEffect, useState } from "react";
import { api } from "@/api";
import type { JobDetailBundle, ReportArtifact } from "@/types";

export interface JobDetailState {
  bundle: JobDetailBundle | undefined;
  report: ReportArtifact | undefined;
  loading: boolean;
  error: Error | null;
}

export function useJobDetailData(jobId: string | undefined) {
  const [state, setState] = useState<JobDetailState>({
    bundle: undefined,
    report: undefined,
    loading: !!jobId,
    error: null,
  });

  useEffect(() => {
    if (!jobId) {
      setState({
        bundle: undefined,
        report: undefined,
        loading: false,
        error: null,
      });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    api.jobs
      .getDetailBundle(jobId)
      .then(async (bundle) => {
        if (cancelled) return;
        if (!bundle) {
          setState({
            bundle: undefined,
            report: undefined,
            loading: false,
            error: null,
          });
          return;
        }
        const report = await api.reports.getByAnomalyId(bundle.job.anomalyId);
        if (!cancelled) {
          setState({
            bundle,
            report,
            loading: false,
            error: null,
          });
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            bundle: undefined,
            report: undefined,
            loading: false,
            error: e instanceof Error ? e : new Error(String(e)),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return state;
}
