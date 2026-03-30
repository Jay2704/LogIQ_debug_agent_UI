import { GitBranch, Layers, ShieldCheck } from "lucide-react";
import type { RcaResult } from "@/types";
import { ConfidenceProgressBar } from "./ConfidenceProgressBar";
import { cn } from "@/lib/utils";

interface RcaResultCardProps {
  rca: RcaResult;
  className?: string;
}

export function RcaResultCard({ rca, className }: RcaResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-surface-900 to-surface-950 p-5 shadow-glow-violet",
        className
      )}
    >
      <div className="flex items-center gap-2 text-violet-300">
        <ShieldCheck className="h-4 w-4" strokeWidth={2} />
        <h3 className="text-sm font-semibold tracking-tight">
          Deterministic Root Cause
        </h3>
      </div>
      <p className="mt-3 font-mono text-xs leading-relaxed text-slate-300 break-all">
        {rca.rootCausePath}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2 rounded-xl bg-surface-850/60 px-3 py-2">
          <Layers className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              Rank
            </p>
            <p className="text-sm font-medium text-slate-200">{rca.rank}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-surface-850/60 px-3 py-2">
          <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              Evidence ref
            </p>
            <p className="font-mono text-xs text-slate-400">{rca.evidenceRef}</p>
          </div>
        </div>
      </div>
      {rca.confidence > 0 ? (
        <div className="mt-4">
          <ConfidenceProgressBar value={rca.confidence} />
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-500">
          Confidence Score pending — RCA step still in progress.
        </p>
      )}
    </div>
  );
}
