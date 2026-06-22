import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { cn } from "@/lib/utils";
import type { MultiAgentInvestigationSummary } from "@/types";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

interface InvestigationSummaryProps {
  summary: MultiAgentInvestigationSummary;
}

export function InvestigationSummary({ summary }: InvestigationSummaryProps) {
  const confidenceTier = interpretConfidence(summary.overallConfidence);

  return (
    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300/90">
        Final investigation summary
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
        {summary.headline}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{summary.narrative}</p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Primary root cause
          </dt>
          <dd className="mt-1 font-mono text-sm text-sky-300/95">
            {summary.primaryRootCause || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Overall confidence
          </dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold tabular-nums text-slate-100">
              {formatConfidence(summary.overallConfidence)}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                confidenceTierBadgeClassName[confidenceTier.tier]
              )}
            >
              {confidenceTier.label}
            </span>
          </dd>
        </div>
      </dl>

      {summary.recommendedActions.length > 0 ? (
        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Recommended actions
          </p>
          <ul className="mt-3 space-y-2">
            {summary.recommendedActions.map((action) => (
              <li
                key={action}
                className="flex gap-2 rounded-lg border border-white/[0.08] bg-black/[0.55] px-3 py-2.5 text-sm text-slate-300"
              >
                <span className="text-emerald-400" aria-hidden>
                  •
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
