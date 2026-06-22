import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, PlugZap, RefreshCw } from "lucide-react";
import { useMcpConnections } from "@/api/hooks";
import { ConnectionGrid } from "@/components/mcp-connections/ConnectionGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

export function McpConnections() {
  const {
    connections,
    loading,
    error,
    validatingProvider,
    validatingAll,
    refetch,
    validateConnection,
    validateAllConnections,
  } = useMcpConnections();

  if (loading) {
    return <PageLoading message="Loading MCP connections…" />;
  }

  if (error && !connections) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <FeedbackNotice tone="error" title="Could not load MCP connections">
          <p className="text-red-100/85">{error.message}</p>
        </FeedbackNotice>
        <button
          type="button"
          onClick={() => refetch()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
            ctaButtonGradient,
            ctaGlowBlueOnly
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="space-y-4">
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Link>
        <div className="relative overflow-hidden rounded-2xl border border-cyber/[0.15] bg-black/[0.96] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
                Integrations
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                MCP Connection Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                Monitor Jira, GitHub, and GitLab MCP providers — validate credentials and
                connectivity before investigations use external context.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 ring-1 ring-sky-500/30">
              <PlugZap className="h-6 w-6 text-sky-300" aria-hidden />
            </div>
          </div>
        </div>
      </header>

      {error ? (
        <FeedbackNotice tone="warning" title="Validation issue">
          <p className="text-amber-100/90">{error.message}</p>
        </FeedbackNotice>
      ) : null}

      {!connections?.length ? (
        <EmptyState
          icon={PlugZap}
          title="No MCP connections configured"
          description="Connect Jira, GitHub, or GitLab on the backend to see provider status here."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                ctaButtonGradient,
                ctaGlowBlueOnly
              )}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          }
        />
      ) : (
        <ConnectionGrid
          connections={connections}
          validatingProvider={validatingProvider}
          validatingAll={validatingAll}
          onValidate={(provider) => void validateConnection(provider)}
          onValidateAll={() => void validateAllConnections()}
        />
      )}

      {validatingAll ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Validating all connections…
        </p>
      ) : null}
    </div>
  );
}
