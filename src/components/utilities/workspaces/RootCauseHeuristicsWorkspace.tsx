import { useState } from "react";
import { Activity, Radio } from "lucide-react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { MOCK_HEURISTIC_CLUSTERS } from "@/data/mock/utilityWorkspaceMocks";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";
import type { UtilityWorkspaceInputProps } from "@/components/utilities/UtilityWorkspaceView";

export function RootCauseHeuristicsWorkspace({
  logLines,
  hasUploadedLog,
}: UtilityWorkspaceInputProps) {
  const [ran, setRan] = useState(false);
  const { running, run } = useSimulatedUtilityRun(500);
  const sampleFindings = logLines
    .filter((line) => /error|exception|timeout|retry/i.test(line))
    .slice(0, 5)
    .map((line, index) => ({ id: `f${index}`, label: line }));

  const handleRun = () => {
    run(() => setRan(true));
  };

  return (
    <>
      <UtilityPanel title="Sample findings (input context)">
        {sampleFindings.length === 0 ? (
          <p className="text-sm text-slate-500">
            Upload logs and include failure-like lines to generate finding context.
          </p>
        ) : (
          <ul className="space-y-2">
            {sampleFindings.map((f) => (
              <li
                key={f.id}
                className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-black/[0.92] px-3 py-2 text-sm text-slate-300"
              >
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-sky-400/80" />
                {f.label}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!hasUploadedLog}>
            Rank clusters
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Ranked issue clusters" className={cn(!ran && "opacity-80")}>
        {!ran ? (
          <p className="text-sm text-slate-500">
            Deterministic scoring over uploaded log signals.
          </p>
        ) : (
          <ol className="space-y-4">
            {MOCK_HEURISTIC_CLUSTERS.map((c) => (
              <li
                key={c.rank}
                className="rounded-xl border border-white/[0.08] bg-black/[0.92] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 font-mono text-xs font-bold text-violet-200">
                      {c.rank}
                    </span>
                    <span className="font-semibold text-slate-100">{c.title}</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400/90">
                    {(c.confidence * 100).toFixed(0)}% conf.
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.signals.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-black/25 px-2 py-1 font-mono text-[10px] text-slate-400"
                    >
                      <Radio className="h-3 w-3 text-sky-500/70" />
                      {s}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
      </UtilityPanel>

      <UtilityPanel title="Supporting signals">
        <p className="text-xs leading-relaxed text-slate-500">
          In production, this panel would cross-link metrics, traces, and deploy events. Here
          signals are embedded per cluster above.
        </p>
      </UtilityPanel>
    </>
  );
}
