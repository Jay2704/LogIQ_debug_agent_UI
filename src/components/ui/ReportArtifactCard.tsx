import { Download, FileJson, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportArtifact } from "@/types";
import { ReportStatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReportArtifactCardProps {
  report: ReportArtifact;
  className?: string;
}

const formatIcon = {
  pdf: FileText,
  json: FileJson,
  markdown: FileText,
} as const;

export function ReportArtifactCard({
  report,
  className,
}: ReportArtifactCardProps) {
  return (
    <div
      className={cn(
        "group rounded-card border border-white/[0.06] bg-gradient-to-br from-surface-850/80 to-surface-950 p-5 shadow-card transition hover:border-white/[0.1]",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ReportStatusBadge status={report.status} />
          <h3 className="mt-2 text-sm font-semibold text-slate-100 group-hover:text-white">
            {report.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-violet-400/90">
            anomaly_id · {report.anomalyId}
          </p>
        </div>
        <p className="text-xs text-slate-500 tabular-nums">
          generated_at {formatDateTime(report.generatedAt)}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {report.summary}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
        <span className="text-xs text-slate-500">Investigation Report ·</span>
        <div className="flex flex-wrap gap-2">
          {report.formats.map((fmt) => {
            const Icon = formatIcon[fmt];
            return (
              <button
                key={fmt}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-800/80 px-2.5 py-1 text-xs text-slate-300 transition hover:border-blue-500/30 hover:text-blue-300"
              >
                <Icon className="h-3.5 w-3.5" />
                {fmt.toUpperCase()}
                <Download className="h-3 w-3 opacity-60" />
              </button>
            );
          })}
        </div>
        <Link
          to={`/jobs`}
          className="ml-auto text-xs font-medium text-slate-500 hover:text-blue-400"
        >
          Open related job
        </Link>
      </div>
    </div>
  );
}
