import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { InvestigationReport } from "@/types";

export function useInvestigationReport(investigationId: string | undefined) {
  const [data, setData] = useState<InvestigationReport | null>(null);
  const [loading, setLoading] = useState(Boolean(investigationId?.trim()));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = investigationId?.trim();
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getApi()
      .investigations.getInvestigationReport(id)
      .then((report) => {
        if (!cancelled) {
          setData(report);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [investigationId, refreshKey]);

  const refreshReport = useCallback(async () => {
    const id = investigationId?.trim();
    if (!id) return;

    setRefreshing(true);
    setError(null);
    try {
      const report = await getApi().investigations.refreshInvestigationReport(id);
      setData(report);
      return report;
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setRefreshing(false);
    }
  }, [investigationId]);

  return { data, loading, refreshing, error, refetch, refreshReport };
}
