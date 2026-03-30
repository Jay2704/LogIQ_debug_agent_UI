import { useState } from "react";
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
  const [done, setDone] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => {
    setDone((d) => ({ ...d, [i]: !d[i] }));
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/[0.08] to-surface-975 p-6 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/35">
          <ListChecks className="h-5 w-5 text-emerald-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Remediation checklist</h3>
          <p className="mt-1 text-sm text-slate-500">
            Track verification steps — derived from RCA and runbooks; confirm in
            your environment before change.
          </p>
        </div>
      </div>
      {steps.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">
          No remediation steps generated for this job yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-0 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-surface-975/60">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 p-4">
              <label className="flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={!!done[i]}
                  onChange={() => toggle(i)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-emerald-500/40 bg-surface-950 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-0"
                />
                <span
                  className={cn(
                    "text-sm leading-relaxed text-slate-300",
                    done[i] && "text-slate-500 line-through"
                  )}
                >
                  {step}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
