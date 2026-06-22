import { Pause, Play, RotateCcw } from "lucide-react";
import { REPLAY_SPEED_OPTIONS, type ReplaySpeed } from "@/types";
import { cn } from "@/lib/utils";

interface ReplayControlsProps {
  playing: boolean;
  speed: ReplaySpeed;
  disabled?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: ReplaySpeed) => void;
}

export function ReplayControls({
  playing,
  speed,
  disabled = false,
  onPlay,
  onPause,
  onRestart,
  onSpeedChange,
}: ReplayControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {playing ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onPause}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-400/45 hover:bg-amber-500/15 hover:text-white disabled:opacity-50"
        >
          <Pause className="h-4 w-4" aria-hidden />
          Pause
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={onPlay}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:border-emerald-400/45 hover:bg-emerald-500/15 hover:text-white disabled:opacity-50"
        >
          <Play className="h-4 w-4" aria-hidden />
          Play
        </button>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={onRestart}
        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-black/[0.94] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        Restart
      </button>

      <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/[0.82] p-1">
        {REPLAY_SPEED_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSpeedChange(option)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold tabular-nums transition",
              speed === option
                ? "bg-sky-500/20 text-sky-200 ring-1 ring-sky-500/35"
                : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-300",
              disabled && "opacity-50"
            )}
          >
            {option}×
          </button>
        ))}
      </div>
    </div>
  );
}
