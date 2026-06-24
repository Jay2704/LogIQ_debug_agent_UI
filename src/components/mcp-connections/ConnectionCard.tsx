import { Loader2, RefreshCw } from "lucide-react";
import type { McpConnection } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";

interface ConnectionCardProps {
  connection: McpConnection;
  validating?: boolean;
  onValidate: (connectionId: string) => void;
}

export function ConnectionCard({
  connection,
  validating = false,
  onValidate,
}: ConnectionCardProps) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{connection.label}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {connection.provider} · {connection.id}
          </p>
        </div>
        <ConnectionStatusBadge status={connection.status} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Configured
          </dt>
          <dd className="mt-1 text-slate-200">{connection.configured ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Healthy
          </dt>
          <dd className="mt-1 text-slate-200">{connection.healthy ? "Yes" : "No"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Last checked
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-400">
            {connection.lastCheckedAt
              ? formatDateTime(connection.lastCheckedAt)
              : "Never"}
          </dd>
        </div>
        {connection.errorMessage ? (
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Error message
            </dt>
            <dd className="mt-1 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-xs text-red-100/90">
              {connection.errorMessage}
            </dd>
          </div>
        ) : null}
      </dl>

      <button
        type="button"
        disabled={validating || !connection.configured}
        onClick={() => onValidate(connection.id)}
        className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {validating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        )}
        Validate
      </button>
    </article>
  );
}
