import { useMemo, useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { MOCK_SOURCE_LOG } from "@/data/mock/utilityWorkspaceMocks";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";

function findFirstMatch(line: string, q: string, caseSensitive: boolean) {
  if (!q) return null;
  const hay = caseSensitive ? line : line.toLowerCase();
  const needle = caseSensitive ? q : q.toLowerCase();
  const idx = hay.indexOf(needle);
  if (idx === -1) return null;
  return { start: idx, len: needle.length };
}

function HighlightedLine({
  line,
  matchStart,
  matchLen,
}: {
  line: string;
  matchStart: number;
  matchLen: number;
}) {
  const before = line.slice(0, matchStart);
  const mid = line.slice(matchStart, matchStart + matchLen);
  const after = line.slice(matchStart + matchLen);
  return (
    <span className="font-mono text-[11px] leading-relaxed text-slate-300">
      {before}
      <mark className="rounded bg-sky-500/40 px-0.5 text-sky-50">{mid}</mark>
      {after}
    </span>
  );
}

export function KeywordSearchWorkspace() {
  const [keyword, setKeyword] = useState("ERROR");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { running, run } = useSimulatedUtilityRun();

  const lineIndex = useMemo(
    () =>
      MOCK_SOURCE_LOG.split("\n").map((line, i) => ({
        lineNum: i + 1,
        line,
      })),
    []
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
          <UtilityRunButton onClick={handleRun} loading={running}>
            Search logs
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Results" className={cn(!showResults && "opacity-80")}>
        {!showResults ? (
          <p className="text-sm text-slate-500">
            Run a search to see matching lines with highlighted tokens (mock data).
          </p>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-500">No mock matches for this query.</p>
        ) : (
          <ul className="space-y-3">
            {results.map((row) => (
              <li
                key={`${row.lineNum}-${row.matchStart}`}
                className="rounded-lg border border-white/[0.06] bg-surface-960/60 px-3 py-2"
              >
                <span className="font-mono text-[10px] text-slate-500">L{row.lineNum}</span>
                <div className="mt-1">
                  <HighlightedLine
                    line={row.line}
                    matchStart={row.matchStart}
                    matchLen={row.matchLen}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </UtilityPanel>
    </>
  );
}
