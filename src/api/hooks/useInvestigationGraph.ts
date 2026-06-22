import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { InvestigationGraph } from "@/types";

export function useInvestigationGraph(investigationId: string | undefined) {
  const [data, setData] = useState<InvestigationGraph | null>(null);
  const [loading, setLoading] = useState(Boolean(investigationId?.trim()));
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
      .investigations.getGraph(id)
      .then((graph) => {
        if (!cancelled) {
          setData(graph);
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

  return { data, loading, error, refetch };
}
