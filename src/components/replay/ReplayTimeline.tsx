import { TIMELINE_GROUP_COLORS, TIMELINE_GROUP_LABELS } from "@/lib/timelineGroups";
import { cn, formatDateTime } from "@/lib/utils";
import type { InvestigationReplayEvent } from "@/types";

interface ReplayTimelineProps {
  events: InvestigationReplayEvent[];
  currentIndex: number;
  progress: number;
  onSelectStep: (index: number) => void;
}

export function ReplayTimeline({
  events,
  currentIndex,
  progress,
  onSelectStep,
}: ReplayTimelineProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Timeline progress
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {events.length} events · {Math.round(safeProgress)}% complete
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500">
          Step {Math.max(currentIndex, 0)} / {events.length}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-[width] duration-300 ease-out"
          style={{ width: `${safeProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(safeProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <ol className="mt-5 max-h-[320px] space-y-2 overflow-y-auto pr-1">
        {events.map((event, index) => {
          const stepNumber = index + 1;
          const isCurrent = currentIndex === stepNumber;
          const isPast = currentIndex > stepNumber;
          const groupColors = TIMELINE_GROUP_COLORS[event.group];

          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelectStep(stepNumber)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                  isCurrent
                    ? "border-sky-500/40 bg-sky-500/10"
                    : isPast
                      ? "border-white/[0.06] bg-black/[0.55] opacity-80"
                      : "border-white/[0.04] bg-black/[0.35] hover:border-white/[0.1]"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    isCurrent
                      ? "bg-sky-500/25 text-sky-200 ring-1 ring-sky-500/40"
                      : isPast
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-white/[0.06] text-slate-500"
                  )}
                >
                  {stepNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-200">{event.title}</p>
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                      style={{
                        borderColor: `${groupColors.border}55`,
                        backgroundColor: groupColors.bg,
                        color: groupColors.text,
                      }}
                    >
                      {TIMELINE_GROUP_LABELS[event.group]}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                    {formatDateTime(event.timestamp)}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
