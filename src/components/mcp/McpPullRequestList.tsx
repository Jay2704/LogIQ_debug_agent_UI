import { GitPullRequest } from "lucide-react";
import type { MergeRequestEvent, PullRequestEvent } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface McpPullRequestListProps {
  pullRequests: PullRequestEvent[];
  mergeRequests?: MergeRequestEvent[];
}

function stateTone(state: string): string {
  const lower = state.toLowerCase();
  if (lower === "merged") return "border-emerald-500/35 bg-emerald-500/15 text-emerald-200";
  if (lower === "open" || lower === "opened") {
    return "border-sky-500/35 bg-sky-500/15 text-sky-200";
  }
  return "border-slate-500/35 bg-slate-500/15 text-slate-300";
}

export function McpPullRequestList({
  pullRequests,
  mergeRequests = [],
}: McpPullRequestListProps) {
  if (pullRequests.length === 0 && mergeRequests.length === 0) {
    return (
      <p className="text-xs text-slate-500">No related pull or merge requests found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {pullRequests.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            GitHub pull requests
          </p>
          <ul className="space-y-2">
            {pullRequests.map((pr) => (
              <li
                key={`pr-${pr.repository}-${pr.number}`}
                className="rounded-lg border border-white/[0.06] bg-black/[0.75] p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <GitPullRequest className="h-3.5 w-3.5 text-violet-300" aria-hidden />
                  <span className="font-mono text-xs text-violet-200/90">#{pr.number}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                      stateTone(pr.state)
                    )}
                  >
                    {pr.state}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-200">{pr.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {pr.author} · opened {formatDateTime(pr.createdAt)}
                  {pr.mergedAt ? ` · merged ${formatDateTime(pr.mergedAt)}` : ""}
                </p>
                {pr.url ? (
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[11px] font-semibold text-sky-300 hover:text-sky-200"
                  >
                    View pull request
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {mergeRequests.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            GitLab merge requests
          </p>
          <ul className="space-y-2">
            {mergeRequests.map((mr) => (
              <li
                key={`mr-${mr.project}-${mr.iid}`}
                className="rounded-lg border border-white/[0.06] bg-black/[0.75] p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <GitPullRequest className="h-3.5 w-3.5 text-orange-300" aria-hidden />
                  <span className="font-mono text-xs text-orange-200/90">!{mr.iid}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                      stateTone(mr.state)
                    )}
                  >
                    {mr.state}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-200">{mr.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {mr.author} · opened {formatDateTime(mr.createdAt)}
                  {mr.mergedAt ? ` · merged ${formatDateTime(mr.mergedAt)}` : ""}
                </p>
                {mr.url ? (
                  <a
                    href={mr.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[11px] font-semibold text-sky-300 hover:text-sky-200"
                  >
                    View merge request
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
