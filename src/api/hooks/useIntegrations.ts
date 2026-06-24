import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type {
  CreateIntegrationConnectionInput,
  IntegrationConnection,
  UpdateIntegrationConnectionInput,
  ValidateIntegrationConnectionResult,
} from "@/types";

export function useIntegrations(workspaceId: string) {
  const [connections, setConnections] = useState<IntegrationConnection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
      .integrations.listConnections(id)
      .then((rows) => {
        if (!cancelled) {
          setConnections(rows);
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

  const createConnection = useCallback(
    async (payload: CreateIntegrationConnectionInput) => {
      setSaving(true);
      setError(null);
      try {
        const created = await getApi().integrations.createConnection(payload);
        setConnections((prev) => (prev ? [...prev, created] : [created]));
        return created;
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const updateConnection = useCallback(
    async (id: string, payload: UpdateIntegrationConnectionInput) => {
      setSaving(true);
      setError(null);
      try {
        const updated = await getApi().integrations.updateConnection(id, payload);
        setConnections((prev) =>
          prev ? prev.map((row) => (row.id === id ? updated : row)) : [updated]
        );
        return updated;
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const deleteConnection = useCallback(async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await getApi().integrations.deleteConnection(id);
      setConnections((prev) => (prev ? prev.filter((row) => row.id !== id) : []));
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const validateConnection = useCallback(
    async (id: string): Promise<ValidateIntegrationConnectionResult> => {
      setValidatingId(id);
      setError(null);
      try {
        const result = await getApi().integrations.validateConnection(id);
        setConnections((prev) =>
          prev
            ? prev.map((row) =>
                row.id === id
                  ? {
                      ...row,
                      validationStatus: result.validationStatus,
                      validationError: result.validationError,
                      lastValidatedAt: result.lastValidatedAt,
                    }
                  : row
              )
            : prev
        );
        return result;
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setValidatingId(null);
      }
    },
    []
  );

  return {
    connections,
    loading,
    error,
    saving,
    validatingId,
    refetch,
    createConnection,
    updateConnection,
    deleteConnection,
    validateConnection,
  };
}
