import { ShieldCheck } from "lucide-react";
import {
  EVIDENCE_COVERAGE_LEVEL_LABELS,
  type EvidenceCoverage,
} from "@/types";
import { cn } from "@/lib/utils";

const levelStyles: Record<
  EvidenceCoverage["level"],
  { badge: string; ring: string; meter: string }
> = {
  high: {
    badge: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
    ring: "border-emerald-500/25",
    meter: "from-emerald-500 to-emerald-400",
  },
  good: {
    badge: "border-sky-500/40 bg-sky-500/15 text-sky-200",
    ring: "border-sky-500/25",
    meter: "from-sky-500 to-cyan-400",
  },
  partial: {
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-200",
    ring: "border-amber-500/25",
    meter: "from-amber-500 to-yellow-400",
  },
  low: {
    badge: "border-red-500/40 bg-red-500/15 text-red-200",
    ring: "border-red-500/25",
    meter: "from-red-500 to-rose-400",
  },
};

interface EvidenceCoverageCardProps {
  coverage: EvidenceCoverage;
  className?: string;
}

export function EvidenceCoverageCard({ coverage, className }: EvidenceCoverageCardProps) {
  const styles = levelStyles[coverage.level];

  return (
    <article
      className={cn(
        "rounded-2xl border bg-black/[0.88] p-5 shadow-card sm:p-6",
        styles.ring,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]">
          <ShieldCheck className="h-5 w-5 text-slate-300" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Evidence coverage
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <p className="text-3xl font-bold tabular-nums text-white">
              {coverage.coveragePercent}%
            </p>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
                styles.badge
              )}
            >
              {EVIDENCE_COVERAGE_LEVEL_LABELS[coverage.level]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-[width]", styles.meter)}
          style={{ width: `${coverage.coveragePercent}%` }}
          role="progressbar"
          aria-valuenow={coverage.coveragePercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Available sources
          </dt>
          <dd className="mt-2">
            {coverage.availableSources.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {coverage.availableSources.map((source) => (
                  <li
                    key={source}
                    className="rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-1 text-[11px] font-medium text-emerald-200/95"
                  >
                    {source}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No evidence sources attached yet.</p>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Missing sources
          </dt>
          <dd className="mt-2">
            {coverage.missingSources.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {coverage.missingSources.map((source) => (
                  <li
                    key={source}
                    className="rounded-full border border-red-500/25 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-medium text-red-200/95"
                  >
                    {source}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-emerald-300/90">All expected sources are covered.</p>
            )}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Confidence limitations
          </dt>
          <dd className="mt-2 rounded-xl border border-white/[0.06] bg-black/[0.55] px-3 py-3 text-sm leading-relaxed text-slate-400">
            {coverage.confidenceLimitations}
          </dd>
        </div>
      </dl>
    </article>
  );
}
