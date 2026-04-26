import { useNavigate } from "react-router-dom";
import {
  AnomalyStatusBadge,
  SeverityBadge,
} from "@/components/ui/StatusBadge";
import { PageLoading } from "@/components/ui/PageLoading";
import { useAnomaliesData } from "@/api/hooks";
import { formatDateTime } from "@/lib/utils";

export function Anomalies() {
  const { anomalies, jobs, loading, error } = useAnomaliesData();
  const navigate = useNavigate();

  const handleRunRCA = (anomaly: { id: string; service: string }) => {
    navigate(
      `/rca?anomaly_id=${encodeURIComponent(anomaly.id)}&service=${encodeURIComponent(
        anomaly.service
      )}`
    );
  };

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
          Severity-ranked signals with investigation status. Trigger RCA directly
          from each anomaly.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.slice(0, 1).map((a) => (
          <div
            key={a.id}
            className="group rounded-card border border-cyber/[0.12] bg-black/[0.88] p-5 shadow-card-premium transition hover:border-cyber/[0.25]"
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
              <button
                type="button"
                onClick={() => handleRunRCA(a)}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-sky-300 transition hover:border-sky-400/55 hover:bg-sky-500/20 hover:text-white"
              >
                Run RCA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
