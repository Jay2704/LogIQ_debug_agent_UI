import { GitCommit } from "lucide-react";
import type { CommitEvent } from "@/types";
import { formatDateTime } from "@/lib/utils";

interface McpCommitTimelineProps {
  commits: CommitEvent[];
}

export function McpCommitTimeline({ commits }: McpCommitTimelineProps) {
  if (commits.length === 0) {
    return (
      <p className="text-xs text-slate-500">No recent GitHub commits matched this ticket.</p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-white/[0.08] pl-4">
      {commits.map((commit) => (
        <li key={commit.sha} className="relative">
          <span className="absolute -left-[1.35rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-violet-500/35 bg-violet-500/15">
            <GitCommit className="h-3 w-3 text-violet-200" aria-hidden />
          </span>
          <div className="rounded-lg border border-white/[0.06] bg-black/[0.75] p-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
              <span className="font-mono text-violet-200/90">{commit.shortSha}</span>
              <span>·</span>
              <span>{commit.authorName}</span>
              <span>·</span>
              <span>{formatDateTime(commit.committedAt)}</span>
              {commit.repository ? (
                <>
                  <span>·</span>
                  <span className="font-mono">{commit.repository}</span>
                </>
              ) : null}
            </div>
            <p className="mt-1.5 text-sm text-slate-200">{commit.message}</p>
            {commit.url ? (
              <a
                href={commit.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-[11px] font-semibold text-sky-300 hover:text-sky-200"
              >
                View commit
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
