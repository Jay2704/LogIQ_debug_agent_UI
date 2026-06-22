import { Loader2, Play, X } from "lucide-react";
import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/ui/StatusBadge";
import type { DemoScenario } from "@/types";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

interface DemoLaunchDialogProps {
  scenario: DemoScenario | null;
  isOpen: boolean;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DemoLaunchDialog({
  scenario,
  isOpen,
  submitting,
  error,
  onClose,
  onConfirm,
}: DemoLaunchDialogProps) {
  if (!isOpen || !scenario) return null;

  const confidenceTier = interpretConfidence(scenario.confidence);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-launch-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm disabled:cursor-not-allowed"
        aria-label="Close"
        disabled={submitting}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.1] bg-black/[0.96] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
              Demo launch
            </p>
            <h2 id="demo-launch-title" className="mt-1 text-xl font-bold text-white">
              {scenario.title}
            </h2>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-400">{scenario.description}</p>

        <dl className="mt-5 space-y-4 rounded-xl border border-white/[0.08] bg-black/[0.55] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Severity
            </dt>
            <dd>
              <SeverityBadge severity={scenario.severity} />
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Root cause preview
            </dt>
            <dd className="mt-1 font-mono text-xs leading-relaxed text-sky-300/95">
              {scenario.rootCausePreview}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Confidence
            </dt>
            <dd className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold tabular-nums text-slate-200">
                {formatConfidence(scenario.confidence)}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  confidenceTierBadgeClassName[confidenceTier.tier]
                )}
              >
                {confidenceTier.label}
              </span>
            </dd>
          </div>
        </dl>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-100/90">
            {error}
          </p>
        ) : null}

        <p className="mt-4 text-xs text-slate-500">
          A new investigation job will be created and you will be taken to Job Detail automatically.
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-xl border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35 disabled:cursor-not-allowed disabled:opacity-60",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            Launch Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
