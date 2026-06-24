import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { McpConnection } from "@/types";

/** MCP Connection Center — health from MCP provider checks on integration_connections rows. */
export function useMcpConnections(workspaceId: string) {
  const [connections, setConnections] = useState<McpConnection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [validatingAll, setValidatingAll] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = workspaceId.trim();
    if (!id) {
      setConnections([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getApi()
      .mcp.getConnections(id)
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
  }, [workspaceId, refreshKey]);

  const validateConnection = useCallback(
    async (connectionId: string) => {
      const id = workspaceId.trim();
      if (!id) throw new Error("workspaceId is required");

      setValidatingId(connectionId);
      setError(null);
      try {
        const updated = await getApi().mcp.validateConnection(id, connectionId);
        setConnections((prev) =>
          prev ? prev.map((row) => (row.id === connectionId ? updated : row)) : [updated]
        );
        return updated;
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setValidatingId(null);
      }
    },
    [workspaceId]
  );

  const validateAllConnections = useCallback(async () => {
    const id = workspaceId.trim();
    if (!id) return { connections: [] as McpConnection[] };

    setValidatingAll(true);
    setError(null);
    try {
      const result = await getApi().mcp.validateAllConnections(id);
      setConnections(result.connections);
      return result;
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setValidatingAll(false);
    }
  }, [workspaceId]);

  return {
    connections,
    loading,
    error,
    validatingId,
    validatingAll,
    refetch,
    validateConnection,
    validateAllConnections,
  };
}
