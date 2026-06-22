import type { UnifiedInvestigationContext } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { McpCommitTimeline } from "./McpCommitTimeline";
import { McpPullRequestList } from "./McpPullRequestList";

interface McpContextPreviewPanelProps {
  context: UnifiedInvestigationContext;
}

export function McpContextPreviewPanel({ context }: McpContextPreviewPanelProps) {
  const { jira } = context;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">External investigation context</p>
        <p className="text-[11px] text-slate-500">
          Previewed {formatDateTime(context.previewedAt)}
        </p>
      </div>

      <section className="rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300/80">
          Jira context
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <p className="text-sm text-slate-200">
            <span className="font-mono text-sky-200">{jira.key}</span>
            {" — "}
            {jira.summary}
          </p>
          <p className="text-xs text-slate-400">
            {jira.status} · {jira.priority}
          </p>
        </div>
        {jira.labels.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {jira.labels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/[0.1] bg-black/[0.5] px-2 py-0.5 text-[10px] text-slate-300"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
        {jira.cleanedDescription ? (
          <p className="mt-3 text-xs leading-relaxed text-slate-400">{jira.cleanedDescription}</p>
        ) : null}
        {jira.extractedHints.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-slate-300">
            {jira.extractedHints.map((hint) => (
              <li key={hint} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300/80">
          GitHub commits
        </p>
        <div className="mt-3">
          <McpCommitTimeline commits={context.githubCommits} />
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-black/[0.78] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          GitHub PRs & GitLab MRs
        </p>
        <div className="mt-3">
          <McpPullRequestList
            pullRequests={context.githubPullRequests}
            mergeRequests={context.gitlabMergeRequests}
          />
        </div>
      </section>
    </div>
  );
}
