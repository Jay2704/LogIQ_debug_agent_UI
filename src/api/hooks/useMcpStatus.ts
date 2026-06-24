import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { McpProviderStatus } from "@/types";

export function useMcpStatus(workspaceId: string, enabled = true) {
  const [data, setData] = useState<McpProviderStatus[] | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !workspaceId.trim()) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getApi()
      .mcp.getStatus(workspaceId)
      .then((providers) => {
        if (!cancelled) {
          setData(providers);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, refreshKey, workspaceId]);

  return { data, loading, error, refetch };
}
