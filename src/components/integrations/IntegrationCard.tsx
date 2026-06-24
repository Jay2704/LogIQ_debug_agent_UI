import { Pencil, Trash2 } from "lucide-react";
import type { IntegrationConnection, ValidateIntegrationConnectionResult } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";
import { ValidateConnectionButton } from "./ValidateConnectionButton";
import { ValidationStatusBadge } from "./ValidationStatusBadge";

interface IntegrationCardProps {
  connection: IntegrationConnection;
  validating?: boolean;
  saving?: boolean;
  onValidate: (id: string) => Promise<ValidateIntegrationConnectionResult>;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onEdit: (connection: IntegrationConnection) => void;
  onDelete: (id: string) => void;
}

export function IntegrationCard({
  connection,
  validating = false,
  saving = false,
  onValidate,
  onToggleEnabled,
  onEdit,
  onDelete,
}: IntegrationCardProps) {
  const providerLabel = connection.provider === "jira" ? "Jira" : "GitHub";

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{connection.displayName}</p>
          <p className="mt-1 text-xs text-slate-500">
            {providerLabel}
            <span className="mx-1.5 text-slate-600">·</span>
            <span className="font-mono">{connection.workspaceId}</span>
          </p>
        </div>
        <ValidationStatusBadge status={connection.validationStatus} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {connection.provider === "jira" ? (
          <>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Base URL
              </dt>
              <dd className="mt-1 truncate font-mono text-xs text-slate-300">
                {connection.baseUrl}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Project key
              </dt>
              <dd className="mt-1 font-mono text-slate-200">{connection.projectKey}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Email
              </dt>
              <dd className="mt-1 text-slate-200">{connection.email}</dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Organization
              </dt>
              <dd className="mt-1 font-mono text-slate-200">{connection.orgName}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Repository
              </dt>
              <dd className="mt-1 font-mono text-slate-200">{connection.repoName}</dd>
            </div>
          </>
        )}
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Secret
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-400">
            {connection.hasSecret ? connection.secretMasked ?? "••••••••" : "Not configured"}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Last validated
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-400">
            {connection.lastValidatedAt
              ? formatDateTime(connection.lastValidatedAt)
              : "Never"}
          </dd>
        </div>
        {connection.validationError ? (
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Validation error
            </dt>
            <dd className="mt-1 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-xs text-red-100/90">
              {connection.validationError}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={connection.enabled}
            disabled={saving}
            onChange={(e) => onToggleEnabled(connection.id, e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/40 text-sky-500 focus:ring-sky-500/40"
          />
          Enabled
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <ValidateConnectionButton
            connectionId={connection.id}
            validating={validating}
            disabled={saving}
            onValidate={onValidate}
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => onEdit(connection)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onDelete(connection.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border border-red-500/25 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/40 hover:bg-red-500/10 disabled:opacity-50"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
