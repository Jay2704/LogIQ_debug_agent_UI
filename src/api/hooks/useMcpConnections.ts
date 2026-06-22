import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { McpConnection, McpProviderId } from "@/types";

export function useMcpConnections() {
  const [connections, setConnections] = useState<McpConnection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [validatingProvider, setValidatingProvider] = useState<McpProviderId | null>(null);
  const [validatingAll, setValidatingAll] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getApi()
      .mcp.getConnections()
      .then((result) => {
        if (!cancelled) {
          setConnections(result.connections);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setConnections(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const validateConnection = useCallback(async (provider: McpProviderId) => {
    setValidatingProvider(provider);
    setError(null);
    try {
      const updated = await getApi().mcp.validateConnection(provider);
      setConnections((prev) =>
        prev ? prev.map((row) => (row.provider === provider ? updated : row)) : [updated]
      );
      return updated;
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setValidatingProvider(null);
    }
  }, []);

  const validateAllConnections = useCallback(async () => {
    setValidatingAll(true);
    setError(null);
    try {
      const result = await getApi().mcp.validateAllConnections();
      setConnections(result.connections);
      return result;
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setValidatingAll(false);
    }
  }, []);

  return {
    connections,
    loading,
    error,
    validatingProvider,
    validatingAll,
    refetch,
    validateConnection,
    validateAllConnections,
  };
}
