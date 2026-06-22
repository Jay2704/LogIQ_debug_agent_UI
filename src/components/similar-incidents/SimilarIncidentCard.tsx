import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { cn } from "@/lib/utils";
import type { SimilarHistoricalInvestigation } from "@/types";

function formatSimilarityScore(score: number): string {
  const pct = score <= 1 ? score * 100 : score;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

function formatConfidence(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return "—";
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(pct)}%`;
}

interface SimilarIncidentCardProps {
  incident: SimilarHistoricalInvestigation;
}

export function SimilarIncidentCard({ incident }: SimilarIncidentCardProps) {
  const confidenceTier =
    incident.confidence !== undefined
      ? interpretConfidence(incident.confidence)
      : null;

  return (
    <article className="rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 transition hover:border-violet-500/25">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Investigation ID
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-sky-300">
            {incident.investigationId}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Similarity score
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-violet-200">
            {formatSimilarityScore(incident.similarityScore)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Root cause
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{incident.rootCause}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Confidence
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-slate-200">
              {formatConfidence(incident.confidence)}
            </span>
            {confidenceTier ? (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  confidenceTierBadgeClassName[confidenceTier.tier]
                )}
              >
                {confidenceTier.label}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {incident.matchedFactors.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Matched factors
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {incident.matchedFactors.map((factor) => (
              <li
                key={factor}
                className="rounded-full border border-white/[0.1] bg-black/[0.55] px-2.5 py-1 text-[11px] text-slate-300"
              >
                {factor}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">
          Resolution summary
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
          {incident.resolutionSummary}
        </p>
      </div>

      <Link
        to={`/jobs/${encodeURIComponent(incident.investigationId)}`}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white"
      >
        View Investigation
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </article>
  );
}
