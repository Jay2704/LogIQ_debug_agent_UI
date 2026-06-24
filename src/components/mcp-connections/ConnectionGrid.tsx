import { Loader2, RefreshCw } from "lucide-react";
import type { McpConnection } from "@/types";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import { ConnectionCard } from "./ConnectionCard";

interface ConnectionGridProps {
  connections: McpConnection[];
  validatingId: string | null;
  validatingAll: boolean;
  onValidate: (connectionId: string) => void;
  onValidateAll: () => void;
}

export function ConnectionGrid({
  connections,
  validatingId,
  validatingAll,
  onValidate,
  onValidateAll,
}: ConnectionGridProps) {
  const enabledCount = connections.filter((row) => row.configured).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {connections.length} integration connection{connections.length === 1 ? "" : "s"}
          {enabledCount !== connections.length
            ? ` · ${enabledCount} enabled with credentials`
            : ""}
        </p>
        <button
          type="button"
          disabled={validatingAll || Boolean(validatingId) || enabledCount === 0}
          onClick={() => void onValidateAll()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35 disabled:cursor-not-allowed disabled:opacity-60",
            ctaButtonGradient,
            ctaGlowBlueOnly
          )}
        >
          {validatingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden />
          )}
          Validate all enabled
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            validating={validatingId === connection.id}
            onValidate={onValidate}
          />
        ))}
      </div>
    </div>
  );
}
