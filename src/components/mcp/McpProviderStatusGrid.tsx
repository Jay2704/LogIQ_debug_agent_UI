import { CheckCircle2, Loader2, PlugZap, XCircle } from "lucide-react";
import type { McpProviderStatus } from "@/types";
import { cn } from "@/lib/utils";

interface McpProviderStatusGridProps {
  providers: McpProviderStatus[] | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const providerAccent: Record<McpProviderStatus["provider"], string> = {
  jira: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  github: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  gitlab: "border-orange-500/30 bg-orange-500/10 text-orange-200",
};

export function McpProviderStatusGrid({
  providers,
  loading = false,
  error = null,
  onRetry,
}: McpProviderStatusGridProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-black/[0.82] p-4">
        <p className="inline-flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Checking MCP providers…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4 text-xs text-red-200">
        <p>{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-lg border border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-100 transition hover:bg-red-500/15"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (!providers?.length) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 text-xs text-slate-500">
        No MCP providers reported.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {providers.map((provider) => {
        const healthy = provider.connected && provider.configured;
        return (
          <div
            key={provider.provider}
            className={cn(
              "rounded-xl border p-3 ring-1 ring-white/[0.04]",
              providerAccent[provider.provider]
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <PlugZap className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                <p className="text-sm font-semibold">{provider.label}</p>
              </div>
              {healthy ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
              )}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300/90">
              {provider.message ??
                (healthy ? "Connected" : "Not ready — check server configuration")}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-slate-500">
              {provider.connected ? "Connected" : "Disconnected"}
              {" · "}
              {provider.configured ? "Configured" : "Not configured"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
