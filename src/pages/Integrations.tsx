import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plug, RefreshCw } from "lucide-react";
import { useIntegrations } from "@/api/hooks";
import { useCurrentUser } from "@/auth";
import { AddIntegrationDialog } from "@/components/integrations/AddIntegrationDialog";
import { IntegrationList } from "@/components/integrations/IntegrationList";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { resolveWorkspaceId } from "@/lib/workspaceId";
import { cn } from "@/lib/utils";
import type { IntegrationConnection } from "@/types";

export function Integrations() {
  const { user } = useCurrentUser();
  const workspaceId = resolveWorkspaceId(user);
  const {
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
  } = useIntegrations(workspaceId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IntegrationConnection | null>(null);

  if (loading) {
    return <PageLoading message="Loading integrations…" />;
  }

  if (error && !connections) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <FeedbackNotice tone="error" title="Could not load integrations">
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

  const rows = connections ?? [];

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
                Settings
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Integrations
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                Connect Jira and GitHub for investigation context. Secrets are stored securely and
                never shown in full after save.
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">
                Workspace: {workspaceId}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 ring-1 ring-sky-500/30">
              <Plug className="h-6 w-6 text-sky-300" aria-hidden />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          to="/settings/mcp-connections"
          className="font-semibold text-sky-400 transition hover:text-sky-300"
        >
          MCP Connection Center →
        </Link>
        <span className="text-slate-600">|</span>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-slate-200"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {error ? (
        <FeedbackNotice tone="warning" title="Action issue">
          <p className="text-amber-100/90">{error.message}</p>
        </FeedbackNotice>
      ) : null}

      {saving ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Saving changes…
        </p>
      ) : null}

      {!rows.length ? (
        <EmptyState
          icon={Plug}
          title="No integrations yet"
          description="Add a Jira or GitHub connection to supply workspace context for RCA runs."
          action={
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                ctaButtonGradient,
                ctaGlowBlueOnly
              )}
            >
              Add integration
            </button>
          }
        />
      ) : (
        <IntegrationList
          connections={rows}
          validatingId={validatingId}
          saving={saving}
          onAdd={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          onValidate={(id) => validateConnection(id)}
          onToggleEnabled={(id, enabled) => void updateConnection(id, { enabled })}
          onEdit={(connection) => {
            setEditing(connection);
            setDialogOpen(true);
          }}
          onDelete={(id) => {
            if (window.confirm("Delete this integration connection?")) {
              void deleteConnection(id);
            }
          }}
        />
      )}

      <AddIntegrationDialog
        isOpen={dialogOpen}
        workspaceId={workspaceId}
        editing={editing}
        saving={saving}
        validatingId={validatingId}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onCreate={createConnection}
        onUpdate={updateConnection}
        onValidate={validateConnection}
      />
    </div>
  );
}
