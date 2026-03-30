import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  AnomalyStatusBadge,
  SeverityBadge,
} from "@/components/ui/StatusBadge";
import { PageLoading } from "@/components/ui/PageLoading";
import { useAnomaliesData } from "@/api/hooks";
import { formatDateTime } from "@/lib/utils";

function anomalyJobLink(anomalyId: string, jobs: { id: string; anomalyId: string }[]) {
  const job = jobs.find((j) => j.anomalyId === anomalyId);
  return job ? `/jobs/${job.id}` : "/jobs";
}

export function Anomalies() {
  const { anomalies, jobs, loading, error } = useAnomaliesData();

  if (loading || !anomalies || !jobs) {
    return <PageLoading message="Loading anomalies…" />;
  }

  if (error) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  const sorted = [...anomalies].sort(
    (a, b) =>
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ui-page-title">Anomalies</h1>
        <p className="ui-page-desc">
          Severity-ranked signals with investigation status. Open RCA details
          from the linked debug job.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((a) => (
          <div
            key={a.id}
            className="group rounded-card border border-blue-500/[0.12] bg-gradient-to-br from-surface-850/85 via-surface-960 to-surface-975 p-5 shadow-card-premium transition hover:border-blue-500/25"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={a.severity} />
                <AnomalyStatusBadge status={a.status} />
              </div>
              <span className="text-xs text-slate-500 tabular-nums">
                {formatDateTime(a.detectedAt)}
              </span>
            </div>
            <p className="mt-3 font-mono text-xs text-violet-300/90">{a.id}</p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {a.service}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {a.summary}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
              <span className="text-xs text-slate-500">{a.signalType}</span>
              <Link
                to={anomalyJobLink(a.id, jobs)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 transition hover:text-sky-300"
              >
                Open RCA details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
