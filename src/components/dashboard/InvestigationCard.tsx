import { Link } from "react-router-dom";
import { ArrowUpRight, Cpu } from "lucide-react";
import type { Job } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getJobRouteId } from "@/lib/jobRoute";
import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { cn, formatRelativeShort } from "@/lib/utils";

interface InvestigationCardProps {
  job: Job;
  anomalySummary: string;
  confidence?: number;
  className?: string;
}

export function InvestigationCard({
  job,
  anomalySummary,
  confidence,
  className,
}: InvestigationCardProps) {
  const summary =
    anomalySummary.length > 120
      ? `${anomalySummary.slice(0, 118)}…`
      : anomalySummary;

  const conf =
    confidence != null && confidence > 0
      ? interpretConfidence(confidence)
      : null;

  return (
    <Link
      to={`/jobs/${encodeURIComponent(getJobRouteId(job))}`}
      className={cn(
        "group relative block overflow-hidden rounded-card border border-blue-500/[0.12] bg-gradient-to-b from-surface-850/90 to-surface-975 p-4 shadow-card transition",
        "hover:border-sky-500/35 hover:shadow-[0_12px_48px_-24px_rgba(14,165,233,0.2)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/[0.03] via-transparent to-violet-500/[0.04] opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-sky-400 transition group-hover:text-sky-300">
              {getJobRouteId(job)}
            </span>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <Cpu className="h-3 w-3 shrink-0 text-slate-600" />
            <span className="truncate font-medium text-slate-400">
              {job.service ?? "—"}
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-violet-400/90">{job.anomalyId}</span>
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-sky-400" />
      </div>
      <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
        {summary}
      </p>
      <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
        <span className="tabular-nums">{formatRelativeShort(job.createdAt)}</span>
        {conf && confidence != null ? (
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                confidenceTierBadgeClassName[conf.tier]
              )}
            >
              {conf.label}
            </span>
            <span className="font-mono tabular-nums text-slate-400">
              {(confidence * 100).toFixed(0)}%
            </span>
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </div>
    </Link>
  );
}
