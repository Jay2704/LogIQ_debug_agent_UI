/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

const LOG_LEVEL_REGEX = /\b(ERROR|WARN|INFO|DEBUG)\b/g;

function levelClass(level: string) {
  switch (level) {
    case "ERROR":
      return "log-error";
    case "WARN":
      return "log-warn";
    case "INFO":
      return "log-info";
    case "DEBUG":
      return "log-debug";
    default:
      return "";
  }
}

export function renderHighlightedLogLine(line: string) {
  const matches = [...line.matchAll(LOG_LEVEL_REGEX)];
  if (matches.length === 0) return <span>{line || " "}</span>;

  const chunks: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > cursor) {
      chunks.push(
        <span key={`plain-${index}-${start}`}>{line.slice(cursor, start)}</span>
      );
    }
    chunks.push(
      <span key={`level-${index}-${start}`} className={levelClass(token)}>
        {token}
      </span>
    );
    cursor = start + token.length;
  });
  if (cursor < line.length) {
    chunks.push(<span key={`tail-${cursor}`}>{line.slice(cursor)}</span>);
  }
  return chunks;
}

interface LogViewerProps {
  entries: Array<{ lineNumber: number; line: string }>;
}

export function LogViewer({ entries }: LogViewerProps) {
  return (
    <ol className="h-96 w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-black/35 p-4 font-mono text-[11px] leading-relaxed text-slate-300 shadow-inner">
      {entries.map((entry) => (
        <li key={`${entry.lineNumber}-${entry.line}`} className="flex gap-3">
          <span className="w-8 shrink-0 text-right text-slate-500">{entry.lineNumber}</span>
          <span className="whitespace-pre-wrap break-words">
            {renderHighlightedLogLine(entry.line)}
          </span>
        </li>
      ))}
    </ol>
  );
}
