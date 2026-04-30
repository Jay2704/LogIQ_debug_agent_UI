import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Terminal } from "lucide-react";
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
  index?: number;
}

export function InvestigationCard({
  job,
  anomalySummary,
  confidence,
  className,
  index = 0,
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        to={`/jobs/${encodeURIComponent(getJobRouteId(job))}`}
        className={cn(
          "nexus-card-scanline group relative block overflow-hidden rounded-card border border-cyber/[0.1] bg-black/[0.88] p-4 transition-all duration-200",
          "hover:border-cyber/[0.25] hover:bg-black/[0.96] hover:shadow-glow-cyber",
          className
        )}
      >
        {/* Top accent line */}
        <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-cyber/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-cyber/80 transition group-hover:text-cyan-300">
                <Terminal className="h-3 w-3" />
                {getJobRouteId(job)}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
              <Cpu className="h-3 w-3 shrink-0 text-slate-700" />
              <span className="truncate font-medium text-slate-500">
                {job.service ?? "—"}
              </span>
              <span className="text-slate-700">·</span>
              <span className="font-mono text-violet-400/70">{job.anomalyId}</span>
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-700 transition group-hover:text-cyber" />
        </div>

        <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {summary}
        </p>

        <div className="relative mt-4 flex items-center justify-between border-t border-cyber/[0.06] pt-3 text-[11px]">
          <span className="font-mono tabular-nums text-slate-600">
            {formatRelativeShort(job.createdAt)}
          </span>
          {conf && confidence != null ? (
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                  confidenceTierBadgeClassName[conf.tier]
                )}
              >
                {conf.label}
              </span>
              <span className="font-mono tabular-nums text-slate-500">
                {(confidence * 100).toFixed(0)}%
              </span>
            </span>
          ) : (
            <span className="text-slate-700">—</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
