import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { cn, formatDateTime } from "@/lib/utils";
import type { InvestigationReport } from "@/types";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

interface ReportSummaryProps {
  report: InvestigationReport;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  const confidenceTier = interpretConfidence(report.confidence);

  return (
    <header className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] via-black/[0.94] to-black/[0.96] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300/90">
            Investigation report
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Report Center
          </h1>
          <p className="mt-2 font-mono text-xs text-slate-500">{report.investigationId}</p>
          <p className="mt-1 text-sm text-slate-400">
            Generated · {formatDateTime(report.generatedAt)}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-black/[0.55] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Executive summary
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {report.executiveSummary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">Overall confidence</span>
          <span className="text-lg font-bold tabular-nums text-slate-100">
            {formatConfidence(report.confidence)}
          </span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
              confidenceTierBadgeClassName[confidenceTier.tier]
            )}
          >
            {confidenceTier.label}
          </span>
        </div>
      </div>
    </header>
  );
}
