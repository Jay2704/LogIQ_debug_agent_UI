import { CheckCircle2, Loader2, ShieldAlert, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { RcaFeedbackAction, RcaFeedbackSummary } from "@/types";
import { cn } from "@/lib/utils";

function formatRate(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

interface FeedbackPanelProps {
  summary: RcaFeedbackSummary | null;
  loading?: boolean;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (action: RcaFeedbackAction, comment?: string) => Promise<unknown>;
}

const actionConfig: Record<
  RcaFeedbackAction,
  { label: string; icon: typeof ThumbsUp; className: string }
> = {
  confirm: {
    label: "Confirm RCA",
    icon: ThumbsUp,
    className:
      "border-emerald-500/35 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400/50 hover:bg-emerald-500/20",
  },
  reject: {
    label: "Reject RCA",
    icon: ThumbsDown,
    className:
      "border-red-500/35 bg-red-500/10 text-red-200 hover:border-red-400/50 hover:bg-red-500/20",
  },
  override: {
    label: "Override RCA",
    icon: ShieldAlert,
    className:
      "border-amber-500/35 bg-amber-500/10 text-amber-200 hover:border-amber-400/50 hover:bg-amber-500/20",
  },
};

export function FeedbackPanel({
  summary,
  loading = false,
  submitting = false,
  error = null,
  onSubmit,
}: FeedbackPanelProps) {
  const [comment, setComment] = useState("");
  const [pendingAction, setPendingAction] = useState<RcaFeedbackAction | null>(null);

  async function handleSubmit(action: RcaFeedbackAction) {
    setPendingAction(action);
    try {
      await onSubmit(action, comment.trim() || undefined);
      setComment("");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/[0.94] p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/30">
          <CheckCircle2 className="h-5 w-5 text-sky-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">RCA feedback</h3>
          <p className="mt-1 text-sm text-slate-500">
            Confirm, reject, or override the deterministic RCA outcome for this job.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading feedback summary…
        </p>
      ) : summary ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">
              Confirmation rate
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-200">
              {formatRate(summary.confirmationRate)}
            </p>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-300/80">
              Rejection rate
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-red-200">
              {formatRate(summary.rejectionRate)}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-black/[0.82] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Total feedback
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-200">
              {summary.totalCount}
            </p>
          </div>
        </div>
      ) : null}

      <label className="mt-5 block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Comment (optional)
        </span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Add context for reviewers or on-call handoff…"
          disabled={submitting}
          className="w-full resize-y rounded-xl border border-white/[0.12] bg-black/[0.82] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25 disabled:opacity-60"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["confirm", "reject", "override"] as const).map((action) => {
          const config = actionConfig[action];
          const Icon = config.icon;
          const busy = submitting && pendingAction === action;
          return (
            <button
              key={action}
              type="button"
              disabled={submitting || loading}
              onClick={() => void handleSubmit(action)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                config.className
              )}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Icon className="h-4 w-4" aria-hidden />
              )}
              {config.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
