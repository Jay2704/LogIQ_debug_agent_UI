import { Layers } from "lucide-react";
import type { RcaMcpInvestigationContext } from "@/types";
import { cn } from "@/lib/utils";

interface EvidenceBundleSectionProps {
  evidenceSummary: string[];
  matchedEvidence?: string[];
  className?: string;
}

export function EvidenceBundleSection({
  evidenceSummary,
  matchedEvidence,
  className,
}: EvidenceBundleSectionProps) {
  const rows = evidenceSummary.length
    ? evidenceSummary
    : (matchedEvidence ?? []);

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]">
          <Layers className="h-5 w-5 text-slate-300" strokeWidth={2} aria-hidden />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Evidence bundle
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Aggregated MCP evidence supporting the ranked root cause.
          </p>
        </div>
      </div>

      {rows.length ? (
        <ul className="mt-5 space-y-2.5">
          {rows.map((line) => (
            <li
              key={line}
              className="flex gap-2.5 rounded-xl border border-white/[0.06] bg-black/[0.65] px-3 py-2.5 text-sm leading-relaxed text-slate-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No evidence bundle entries reported.</p>
      )}
    </section>
  );
}

/** Convenience wrapper using full MCP context. */
export function EvidenceBundleFromMcpContext({
  context,
  className,
}: {
  context: RcaMcpInvestigationContext;
  className?: string;
}) {
  return (
    <EvidenceBundleSection
      evidenceSummary={context.evidenceSummary}
      matchedEvidence={context.mcpContextSummary?.matchedEvidence}
      className={className}
    />
  );
}
