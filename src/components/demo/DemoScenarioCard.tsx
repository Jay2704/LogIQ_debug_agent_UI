import { Play } from "lucide-react";
import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/ui/StatusBadge";
import type { DemoScenario } from "@/types";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

interface DemoScenarioCardProps {
  scenario: DemoScenario;
  launching?: boolean;
  onLaunch: (scenario: DemoScenario) => void;
}

export function DemoScenarioCard({
  scenario,
  launching = false,
  onLaunch,
}: DemoScenarioCardProps) {
  const confidenceTier = interpretConfidence(scenario.confidence);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card transition hover:border-sky-500/25">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-white">{scenario.title}</p>
          <p className="mt-1 font-mono text-[11px] text-slate-500">{scenario.service}</p>
        </div>
        <SeverityBadge severity={scenario.severity} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">{scenario.description}</p>

      <dl className="mt-5 grid flex-1 gap-4">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Root cause preview
          </dt>
          <dd className="mt-1 font-mono text-xs leading-relaxed text-sky-300/95">
            {scenario.rootCausePreview}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Confidence
          </dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-slate-200">
              {formatConfidence(scenario.confidence)}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                confidenceTierBadgeClassName[confidenceTier.tier]
              )}
            >
              {confidenceTier.label}
            </span>
          </dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={launching}
        onClick={() => onLaunch(scenario)}
        className={cn(
          "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        <Play className="h-4 w-4" aria-hidden />
        Launch Investigation
      </button>
    </article>
  );
}
