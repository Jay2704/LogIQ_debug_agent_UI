import { FileText } from "lucide-react";
import type { ReportArtifact } from "@/types";
import { ReportStatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface JobReportSummaryCardProps {
  report: ReportArtifact | undefined;
  anomalyId: string;
  className?: string;
}

export function JobReportSummaryCard({
  report,
  anomalyId,
  className,
}: JobReportSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-indigo-500/25 bg-gradient-to-br from-indigo-500/[0.08] via-black/[0.92] to-black/[0.96] p-5 shadow-card-premium",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
          <FileText className="h-4 w-4 text-indigo-300" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-300/80">
            Investigation report
          </p>
          <h3 className="mt-0.5 text-sm font-bold text-white">Report summary</h3>
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            anomaly_id · {anomalyId}
          </p>
        </div>
      </div>

      {!report ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-700/60 bg-black/[0.82] px-3 py-4 text-sm text-slate-500">
          No report artifact linked to this anomaly in the mock workspace yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ReportStatusBadge status={report.status} />
            <span className="font-mono text-[10px] text-slate-500 tabular-nums">
              generated_at {formatDateTime(report.generatedAt)}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug text-slate-200">
            {report.title}
          </p>
          <p className="text-sm leading-relaxed text-slate-500">{report.summary}</p>
          <p className="text-[11px] text-slate-500">
            Exports: {report.formats.join(", ").toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
}
