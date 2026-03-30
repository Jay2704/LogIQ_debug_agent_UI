import { useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { MOCK_PARSED_FRAMES, MOCK_STACK_TRACE } from "@/data/mock/utilityWorkspaceMocks";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";

export function StackTraceParserWorkspace() {
  const [paste, setPaste] = useState(MOCK_STACK_TRACE);
  const [parsed, setParsed] = useState(false);
  const { running, run } = useSimulatedUtilityRun();

  const handleRun = () => {
    run(() => setParsed(true));
  };

  return (
    <>
      <UtilityPanel title="Paste stack trace">
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={8}
          className="w-full resize-y rounded-lg border border-white/[0.1] bg-surface-960/90 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-slate-300 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
        />
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!paste.trim()}>
            Parse frames
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Extracted frames" className={cn(!parsed && "opacity-80")}>
        {!parsed ? (
          <p className="text-sm text-slate-500">
            Structured frames with in-app highlighting (mock extraction).
          </p>
        ) : (
          <ol className="space-y-3">
            {MOCK_PARSED_FRAMES.map((f, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-white/[0.06] bg-surface-960/70 px-3 py-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-slate-500">#{f.frame}</span>
                  {f.inApp !== undefined && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                        f.inApp
                          ? "bg-violet-500/20 text-violet-200"
                          : "bg-slate-600/30 text-slate-400"
                      )}
                    >
                      {f.inApp ? "In-app" : "Library"}
                    </span>
                  )}
                </div>
                {"exception" in f && f.exception && (
                  <p className="mt-2 font-mono text-xs text-red-200/90">{f.exception}</p>
                )}
                {"location" in f && f.location && (
                  <p className="mt-1 font-mono text-[11px] text-slate-300">
                    <span className="text-sky-400/90">{f.method}</span>
                    <span className="text-slate-500"> · </span>
                    {f.location}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </UtilityPanel>
    </>
  );
}
