import { useMemo, useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { LogViewer } from "@/components/utilities/LogViewer";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";
import type { UtilityWorkspaceInputProps } from "@/components/utilities/UtilityWorkspaceView";

function findFirstMatch(line: string, q: string, caseSensitive: boolean) {
  if (!q) return null;
  const hay = caseSensitive ? line : line.toLowerCase();
  const needle = caseSensitive ? q : q.toLowerCase();
  const idx = hay.indexOf(needle);
  if (idx === -1) return null;
  return { start: idx, len: needle.length };
}

export function KeywordSearchWorkspace({ logLines, hasUploadedLog }: UtilityWorkspaceInputProps) {
  const [keyword, setKeyword] = useState("ERROR");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { running, run } = useSimulatedUtilityRun();

  const lineIndex = useMemo(
    () =>
      logLines.map((line, i) => ({
        lineNum: i + 1,
        line,
      })),
    [logLines]
  );

  const results = useMemo(() => {
    if (!showResults) return [];
    const q = keyword.trim();
    if (!q) return [];
    return lineIndex.flatMap((row) => {
      const m = findFirstMatch(row.line, q, caseSensitive);
      if (!m) return [];
      return [{ ...row, matchStart: m.start, matchLen: m.len }];
    });
  }, [showResults, keyword, caseSensitive, lineIndex]);

  const handleRun = () => {
    run(() => setShowResults(true));
  };

  return (
    <>
      <UtilityPanel title="Input">
        <label className="block text-xs font-medium text-slate-400">Keyword or phrase</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. ERROR, PSP_TIMEOUT, req id…"
          className="mt-2 w-full rounded-lg border border-white/[0.1] bg-surface-960/90 px-3 py-2.5 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
        />
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-white/20 bg-surface-960 text-sky-500 focus:ring-sky-500/40"
          />
          Case-sensitive match
        </label>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!hasUploadedLog}>
            Search logs
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Results" className={cn(!showResults && "opacity-80")}>
        {!showResults ? (
          <p className="text-sm text-slate-500">
            Run search after uploading logs to see matching lines with highlighted tokens.
          </p>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-500">No matches for this query in the uploaded log.</p>
        ) : (
          <LogViewer
            entries={results.map((row) => ({
              lineNumber: row.lineNum,
              line: row.line,
            }))}
          />
        )}
      </UtilityPanel>
    </>
  );
}
