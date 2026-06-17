import { Gauge } from "lucide-react";
import { getConferenceJobDetailBundle } from "@/data/demo/conferenceDemoData";
import { DEMO_MODE } from "@/lib/demoMode";
import { cn } from "@/lib/utils";

/** Stylized product / RCA workspace preview — glass card, dashboard-like rows. */
export function ProductPreviewCard({ className }: { className?: string }) {
  const demoBundle = DEMO_MODE ? getConferenceJobDetailBundle("INV-1001") : undefined;
  const demoId = demoBundle?.job.jobId ?? "dbg_inv_7f2a";
  const demoStatus = demoBundle ? "RCA Complete" : "Complete";
  const demoConfidence = demoBundle
    ? `${Math.round((demoBundle.rca.confidence ?? 0) * 100)}%`
    : "94%";
  const demoRootCause =
    demoBundle?.rca.rootCausePath ??
    "Deploy checkout-svc@v2.4.1 introduced a regression in cart validation under load.";
  const demoSignals = demoBundle
    ? ["timeout", "otp_validation", "auth_service"]
    : ["trace", "deploy", "code"];
  const demoExplanation =
    demoBundle?.explanation ??
    "Hypothesis ranks deploy change first; trace evidence supports rollback while metrics stabilize.";

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/20 via-violet-600/10 to-transparent opacity-60 blur-2xl"
        aria-hidden
      />
      <div
        className={cn(
          "hero-glow-card relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-black/[0.85] to-black/[0.96] shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_24px_64px_-24px_rgba(0,0,0,0.65)]",
          "ring-1 ring-white/[0.04] animate-investigation-reveal"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/[0.94] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-400">{demoId}</span>
            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/95">
              {demoStatus}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-2 py-1 ring-1 ring-sky-500/25">
            <Gauge className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-[11px] font-semibold tabular-nums text-sky-200">
              {demoConfidence} confidence
            </span>
          </div>
        </div>
        <div className="grid gap-0 sm:grid-cols-5">
          <div className="border-b border-white/[0.06] p-4 sm:col-span-2 sm:border-b-0 sm:border-r">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Root cause
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-slate-100">
              <span className="font-mono text-sky-300/95">{demoRootCause}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {demoSignals.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300/90 ring-1 ring-violet-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 sm:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Evidence graph
            </p>
            <div className="mt-3 flex h-24 items-end justify-between gap-1 px-1">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-full max-w-[2rem] rounded-t bg-gradient-to-t from-sky-600/40 to-cyan-400/25 ring-1 ring-white/[0.06]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Correlated latency spike → failed rollout window → anchor file match.
            </p>
          </div>
        </div>
        <div className="border-t border-white/[0.06] bg-slate-950/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            AI explanation
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{demoExplanation}</p>
        </div>
      </div>
    </div>
  );
}
