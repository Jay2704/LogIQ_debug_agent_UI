import { ShieldCheck } from "lucide-react";
import type { RcaResult } from "@/types";
import { EvidenceMetadataRow } from "@/components/job/EvidenceMetadataRow";
import { ConfidenceProgressBar } from "./ConfidenceProgressBar";
import { splitRootCausePath } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RcaResultCardProps {
  rca: RcaResult;
  className?: string;
  /** When false, omit the in-card title — use with a page-level “Deterministic Root Cause” heading */
  showHeading?: boolean;
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

export function RcaResultCard({
  rca,
  className,
  showHeading = true,
}: RcaResultCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-500/[0.18] via-[#0a0f1c] to-surface-975 p-6 sm:p-8",
        "shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_20px_64px_-24px_rgba(0,0,0,0.65),0_0_100px_-30px_rgba(139,92,246,0.35)]",
        "ring-1 ring-inset ring-white/[0.07]",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/30 ring-1 ring-violet-400/45 shadow-[0_0_32px_-8px_rgba(139,92,246,0.5)]">
              <ShieldCheck className="h-7 w-7 text-violet-200" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              {showHeading ? (
                <>
                  <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Deterministic Root Cause{" "}
                    <span className="font-medium text-slate-500">
                      (Source of Truth)
                    </span>
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                    Ranked from traces, metrics, and code correlation — auditable and
                    replayable.
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-slate-400">
                  Ranked anchor · reproducible from evidence store
                </p>
              )}
            </div>
          </div>
          {rca.rank > 0 ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.12] px-4 py-2 text-center shadow-inner">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/95">
                Rank
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums leading-tight text-emerald-300">
                #{rca.rank}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Root cause location
          </p>
          <RootCausePathBlock path={rca.rootCausePath} />
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Evidence metadata
          </p>
          <EvidenceMetadataRow
            fileId={rca.fileId}
            evidenceRef={rca.evidenceRef}
            runId={rca.runId}
          />
        </div>

        {rca.confidence > 0 ? (
          <div className="mt-8">
            <ConfidenceProgressBar value={rca.confidence} variant="hero" />
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3.5 text-sm leading-relaxed text-amber-200/95">
            Confidence score pending — complete the RCA step to produce a ranked
            deterministic result.
          </p>
        )}
      </div>
    </div>
  );
}
