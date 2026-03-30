import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemediationChecklistProps {
  steps: string[];
  className?: string;
}

export function RemediationChecklist({
  steps,
  className,
}: RemediationChecklistProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-surface-975 p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <ListChecks className="h-4 w-4 text-emerald-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Remediation checklist</h3>
          <p className="mt-1 text-xs text-slate-500">
            Suggested actions derived from RCA and runbooks — verify in your
            environment before apply.
          </p>
        </div>
      </div>
      {steps.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No remediation steps generated for this job yet.
        </p>
      ) : (
        <ol className="mt-5 space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 font-mono text-[11px] font-bold text-emerald-400">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-slate-300">
                {step}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
