import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { cn } from "@/lib/utils";
import type { AgentFinding } from "@/types";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

interface AgentFindingCardProps {
  finding: AgentFinding;
}

export function AgentFindingCard({ finding }: AgentFindingCardProps) {
  const confidenceTier = interpretConfidence(finding.confidence);

  return (
    <article className="rounded-xl border border-white/[0.08] bg-black/[0.72] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm leading-relaxed text-slate-200">{finding.summary}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tabular-nums text-slate-300">
            {formatConfidence(finding.confidence)}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              confidenceTierBadgeClassName[confidenceTier.tier]
            )}
          >
            {confidenceTier.label}
          </span>
        </div>
      </div>

      {finding.evidence.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Evidence
          </p>
          <ul className="mt-2 space-y-1.5">
            {finding.evidence.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-white/[0.06] bg-black/[0.55] px-3 py-2 font-mono text-[11px] leading-relaxed text-slate-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
