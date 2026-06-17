import { useCallback, useEffect, useRef, useState } from "react";
import { getApi } from "@/api/client";
import { USE_HTTP_API } from "@/api/config";
import {
  getDemoJobDetailBundle,
  shouldUseDemoData,
} from "@/api/demo/demoDataProvider";
import { logApiDebug } from "@/api/http/debugLog";
import type { JobDetailBundle, ReportArtifact } from "@/types";

/** Why the detail page has no bundle (when not loading and no transport error). */
export type JobDetailNotFoundReason = "missing_job_id" | "unknown_job";

export interface JobDetailState {
  bundle: JobDetailBundle | undefined;
  report: ReportArtifact | undefined;
  /** Mirrors {@link JobDetailBundle.jobRowSource} when bundle is present; otherwise inferred. */
  jobRowSource: "api" | "mock" | undefined;
  loading: boolean;
  error: Error | null;
  /** Set when `bundle` is absent after a completed fetch (or invalid route). */
  notFoundReason: JobDetailNotFoundReason | null;
}

/** Extra attempts help right after create when GET /jobs/:id can briefly lag the list. */
const SOFT_RETRY_ATTEMPTS = 6;
const softRetryDelayMs = (attemptIndex: number) => 350 * attemptIndex;

function demoDetailState(jobId: string): JobDetailState {
  const bundle = getDemoJobDetailBundle(jobId);
  return {
    bundle,
    report: undefined,
    jobRowSource: "mock",
    loading: false,
    error: null,
    notFoundReason: bundle ? null : "unknown_job",
  };
}

export function useJobDetailData(jobId: string | undefined) {
  const id = jobId?.trim() ?? "";
  const [state, setState] = useState<JobDetailState>(() => {
    if (shouldUseDemoData() && id) return demoDetailState(id);
    return {
      bundle: undefined,
      report: undefined,
      jobRowSource: undefined,
      loading: Boolean(id),
      error: null,
      notFoundReason: null,
    };
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const silentRefetchRef = useRef(false);

  const refetch = useCallback((opts?: { silent?: boolean }) => {
    silentRefetchRef.current = opts?.silent ?? false;
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const routeId = jobId?.trim();
    if (!routeId) {
      setState({
        bundle: undefined,
        report: undefined,
        jobRowSource: undefined,
        loading: false,
        error: null,
        notFoundReason: "missing_job_id",
      });
      return;
    }

    if (shouldUseDemoData()) {
      setState(demoDetailState(routeId));
      return;
    }

    let cancelled = false;
    const silent = silentRefetchRef.current;
    silentRefetchRef.current = false;

    if (!silent) {
      setState({
        bundle: undefined,
        report: undefined,
        jobRowSource: undefined,
        loading: true,
        error: null,
        notFoundReason: null,
      });
    } else {
      setState((s) => ({ ...s, error: null }));
    }

    logApiDebug("useJobDetailData route param jobId", routeId);

    const maxAttempts = USE_HTTP_API && !silent ? SOFT_RETRY_ATTEMPTS : 1;

    (async () => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (cancelled) return;
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, softRetryDelayMs(attempt)));
          if (cancelled) return;
        }

        try {
          const bundle = await getApi().jobs.getDetailBundle(routeId);
          if (bundle) {
            const jobRowSource =
              bundle.jobRowSource ?? (USE_HTTP_API ? "api" : "mock");

            let report: ReportArtifact | undefined;
            try {
              report = await getApi().reports.getByAnomalyId(bundle.job.anomalyId);
            } catch {
              report = undefined;
            }

            if (!cancelled) {
              setState({
                bundle,
                report,
                jobRowSource,
                loading: false,
                error: null,
                notFoundReason: null,
              });
            }
            return;
          }

          if (silent) {
            if (!cancelled) {
              setState((s) => ({ ...s, loading: false }));
            }
            return;
          }

          if (attempt < maxAttempts - 1) {
            continue;
          }

          if (!cancelled) {
            setState({
              bundle: undefined,
              report: undefined,
              jobRowSource: undefined,
              loading: false,
              error: null,
              notFoundReason: "unknown_job",
            });
          }
          return;
        } catch (e: unknown) {
          if (cancelled) return;
          const err = e instanceof Error ? e : new Error(String(e));
          if (silent) {
            if (import.meta.env.DEV) {
              console.warn("[LogIQ] Silent job refetch failed after investigation", err);
            }
            setState((s) => ({ ...s, loading: false }));
          } else {
            setState({
              bundle: undefined,
              report: undefined,
              jobRowSource: undefined,
              loading: false,
              error: err,
              notFoundReason: null,
            });
          }
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [jobId, refreshKey]);

  return { ...state, refetch };
}
