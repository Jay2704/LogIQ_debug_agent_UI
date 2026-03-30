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
  { key: "explanation", label: "Explain" },
  { key: "reporting", label: "Report" },
];

interface StepProgressBarProps {
  stepState: RcaResult["steps"];
  className?: string;
  title?: string;
  subtitle?: string;
}

export function StepProgressBar({
  stepState,
  className,
  title = "Investigation progress",
  subtitle = "Deterministic pipeline from triage through investigation report.",
}: StepProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>
        ) : null}
      </div>
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
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition",
                    done &&
                      "bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/50 shadow-[0_0_20px_-6px_rgba(16,185,129,0.45)]",
                    active &&
                      !done &&
                      "bg-amber-500/25 text-amber-300 shadow-[0_0_24px_-4px_rgba(245,158,11,0.55)] ring-1 ring-amber-400/55",
                    !done &&
                      !active &&
                      "bg-surface-900 text-slate-600 ring-1 ring-white/[0.08]"
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
                    "mt-2 max-w-[76px] text-center text-[10px] font-semibold uppercase leading-tight tracking-wide",
                    active && "text-amber-400",
                    done && "text-emerald-400/95",
                    !active && !done && "text-slate-600"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <div
                  className="mx-1 mt-[18px] h-px min-w-[4px] flex-1"
                  style={{
                    background: lineActive
                      ? "linear-gradient(90deg, rgba(16,185,129,0.55), rgba(59,130,246,0.35))"
                      : "rgba(51, 65, 85, 0.55)",
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
