import { Loader2, RefreshCw } from "lucide-react";
import type { McpConnection, McpProviderId } from "@/types";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import { ConnectionCard } from "./ConnectionCard";

interface ConnectionGridProps {
  connections: McpConnection[];
  validatingProvider: McpProviderId | null;
  validatingAll: boolean;
  onValidate: (provider: McpProviderId) => void;
  onValidateAll: () => void;
}

export function ConnectionGrid({
  connections,
  validatingProvider,
  validatingAll,
  onValidate,
  onValidateAll,
}: ConnectionGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {connections.length} MCP provider{connections.length === 1 ? "" : "s"} registered
        </p>
        <button
          type="button"
          disabled={validatingAll || Boolean(validatingProvider)}
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
          Validate all
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.provider}
            connection={connection}
            validating={validatingProvider === connection.provider}
            onValidate={onValidate}
          />
        ))}
      </div>
    </div>
  );
}
