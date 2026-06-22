import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { RcaFeedbackAction, RcaFeedbackSummary } from "@/types";

export function useRcaFeedback(jobId: string | undefined) {
  const [summary, setSummary] = useState<RcaFeedbackSummary | null>(null);
  const [loading, setLoading] = useState(Boolean(jobId?.trim()));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = jobId?.trim();
    if (!id) {
      setSummary(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getApi()
      .rcaFeedback.getFeedback(id)
      .then((result) => {
        if (!cancelled) {
          setSummary(result);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setSummary(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [jobId, refreshKey]);

  const submit = useCallback(
    async (action: RcaFeedbackAction, comment?: string) => {
      const id = jobId?.trim();
      if (!id) {
        throw new Error("Job id is required to submit RCA feedback");
      }

      setSubmitting(true);
      setError(null);
      try {
        const result = await getApi().rcaFeedback.submitFeedback(id, {
          action,
          comment,
        });
        setSummary(result);
        return result;
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [jobId]
  );

  return { summary, loading, submitting, error, submit, refetch };
}
