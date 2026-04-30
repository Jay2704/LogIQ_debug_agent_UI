import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PIPELINE_STEPS = [
  { id: "start", label: "Start" },
  { id: "rca", label: "Deterministic RCA" },
  { id: "explain", label: "Explanation" },
  { id: "finalize", label: "Finalize" },
] as const;

interface InvestigationProgressBannerProps {
  label: string;
  /** Current beat (0–3); omit or use -1 to hide the stepper row. */
  activeStepIndex?: number;
  className?: string;
}

/** Live status + indeterminate progress while the debug agent / RCA / explanation pipeline runs. */
export function InvestigationProgressBanner({
  label,
  activeStepIndex = -1,
  className,
}: InvestigationProgressBannerProps) {
  if (!label.trim()) return null;

  const showStepper = activeStepIndex >= 0 && activeStepIndex <= 3;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-sky-500/25 bg-gradient-to-r from-sky-500/[0.08] via-blue-500/[0.06] to-violet-500/[0.06] shadow-inner ring-1 ring-inset ring-sky-500/15",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {showStepper ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-3 py-2.5 sm:px-4">
          <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
            {PIPELINE_STEPS.map((step, i) => {
              const active = i === activeStepIndex;
              const done = i < activeStepIndex;
              return (
                <li key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                  {i > 0 ? (
                    <span
                      className={cn(
                        "h-px w-3 shrink-0 sm:w-4",
                        done ? "bg-sky-500/50" : "bg-white/[0.08]"
                      )}
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition-colors duration-300 sm:text-[10px]",
                      active &&
                        "border-sky-400/45 bg-sky-500/20 text-sky-100 shadow-[0_0_12px_-4px_rgba(56,189,248,0.45)]",
                      done && !active && "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-200/90",
                      !active && !done && "border-white/[0.08] bg-black/[0.88] text-slate-600"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                        active && "bg-sky-500/40 text-white",
                        done && !active && "bg-emerald-500/30 text-emerald-100",
                        !active && !done && "bg-slate-800 text-slate-600"
                      )}
                      aria-hidden
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="max-w-[5.5rem] truncate sm:max-w-none">{step.label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin text-sky-400"
          aria-hidden
        />
        <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-slate-200">
          {label}
        </p>
      </div>
      <div className="h-1 w-full overflow-hidden bg-black/[0.88]">
        <div className="h-full w-[40%] animate-investigation-shimmer-bar bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
      </div>
    </div>
  );
}
