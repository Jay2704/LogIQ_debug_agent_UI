import { Check } from "lucide-react";
import type { RcaResult } from "@/types";
import { cn } from "@/lib/utils";

const steps: {
  key: keyof RcaResult["steps"];
  label: string;
}[] = [
  { key: "triage", label: "Triage" },
  { key: "rca", label: "RCA" },
  { key: "evidence", label: "Evidence" },
  { key: "explanation", label: "Explanation" },
  { key: "reporting", label: "Reporting" },
];

interface StepProgressBarProps {
  stepState: RcaResult["steps"];
  className?: string;
}

export function StepProgressBar({ stepState, className }: StepProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        Investigation pipeline
      </p>
      <div className="flex items-start">
        {steps.map((s, i) => {
          const state = stepState[s.key];
          const done = state === "done";
          const active = state === "active";
          const nextDone =
            i < steps.length - 1
              ? stepState[steps[i + 1]!.key] === "done" ||
                stepState[steps[i + 1]!.key] === "active"
              : false;
          const lineActive = done || nextDone;

          return (
            <div key={s.key} className="flex min-w-0 flex-1 items-start">
              <div className="flex w-full flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                    done &&
                      "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40",
                    active &&
                      !done &&
                      "bg-amber-500/20 text-amber-400 shadow-[0_0_20px_-4px_rgba(245,158,11,0.5)] ring-1 ring-amber-500/40",
                    !done &&
                      !active &&
                      "bg-surface-800 text-slate-600 ring-1 ring-white/[0.06]"
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 max-w-[76px] text-center text-[10px] font-medium uppercase leading-tight tracking-wide",
                    active && "text-amber-400",
                    done && "text-emerald-400/90",
                    !active && !done && "text-slate-600"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <div
                  className="mx-1 mt-4 h-px min-w-[4px] flex-1"
                  style={{
                    background: lineActive
                      ? "linear-gradient(90deg, rgba(16,185,129,0.5), rgba(59,130,246,0.25))"
                      : "rgba(51, 65, 85, 0.6)",
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
