import { Database, GitBranch, ShieldCheck } from "lucide-react";
import type { RcaResult } from "@/types";
import { ConfidenceProgressBar } from "./ConfidenceProgressBar";
import { splitRootCausePath } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RcaResultCardProps {
  rca: RcaResult;
  className?: string;
}

function RootCausePathBlock({ path }: { path: string }) {
  const { segments, lineRange, isStructured } = splitRootCausePath(path);

  if (!isStructured || segments.length === 0) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-slate-700/60 bg-[#060a12] px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-300 shadow-inner [tab-size:2]">
        <code className="break-all">{path}</code>
      </pre>
    );
  }

  const dir = segments.slice(0, -1);
  const file = segments[segments.length - 1]!;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/70 bg-[#060a12] shadow-inner">
      <div className="border-b border-slate-700/50 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Repository path
      </div>
      <div className="px-4 py-3 font-mono text-[13px] leading-relaxed">
        <code className="text-slate-500">
          {dir.length > 0 ? (
            <>
              {dir.map((seg, i) => (
                <span key={i}>
                  {i > 0 ? <span className="text-slate-600">/</span> : null}
                  <span>{seg}</span>
                </span>
              ))}
              <span className="text-slate-600">/</span>
            </>
          ) : null}
          <span className="font-semibold text-emerald-300/95">{file}</span>
          {lineRange ? (
            <span className="text-sky-400">{lineRange}</span>
          ) : null}
        </code>
      </div>
    </div>
  );
}

export function RcaResultCard({ rca, className }: RcaResultCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border-2 border-violet-500/35 bg-gradient-to-br from-violet-500/[0.14] via-surface-900/98 to-surface-975 p-6 shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_16px_56px_-20px_rgba(0,0,0,0.6),0_0_80px_-24px_rgba(139,92,246,0.25)]",
        "ring-1 ring-inset ring-white/[0.06]",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/25 ring-1 ring-violet-400/40">
              <ShieldCheck className="h-5 w-5 text-violet-300" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                Deterministic Root Cause{" "}
                <span className="text-slate-400">(Source of Truth)</span>
              </h3>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
                Ranked from traces, metrics, and code correlation — auditable and
                replayable.
              </p>
            </div>
          </div>
          {rca.rank > 0 ? (
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90">
                Rank
              </p>
              <p className="font-mono text-xl font-bold tabular-nums text-emerald-300">
                #{rca.rank}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Root cause location
          </p>
          <RootCausePathBlock path={rca.rootCausePath} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-blue-500/15 bg-surface-950/80 px-3 py-2 font-mono text-[11px] text-slate-400 shadow-inner">
            <Database className="h-3.5 w-3.5 shrink-0 text-sky-500" />
            <span className="shrink-0 font-semibold uppercase tracking-wide text-slate-500">
              evidence_ref
            </span>
            <span className="min-w-0 truncate text-sky-200/90" title={rca.evidenceRef}>
              {rca.evidenceRef}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-600/40 bg-surface-950/80 px-3 py-2 font-mono text-[11px] text-slate-400 shadow-inner">
            <GitBranch className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="font-semibold uppercase tracking-wide text-slate-500">
              job
            </span>
            <span className="text-slate-300">{rca.jobId}</span>
          </div>
        </div>

        {rca.confidence > 0 ? (
          <div className="mt-6">
            <ConfidenceProgressBar value={rca.confidence} variant="hero" />
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
            Confidence Score pending — complete the RCA step to produce a ranked
            deterministic result.
          </p>
        )}
      </div>
    </div>
  );
}
