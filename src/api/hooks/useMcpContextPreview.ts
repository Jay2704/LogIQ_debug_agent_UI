import { useCallback, useState } from "react";
import { getApi } from "@/api/client";
import type { McpPreviewContextInput, UnifiedInvestigationContext } from "@/types";

export function useMcpContextPreview() {
  const [data, setData] = useState<UnifiedInvestigationContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const preview = useCallback(async (input: McpPreviewContextInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getApi().mcp.previewContext(input);
      setData(result);
      return result;
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, preview, reset };
}
