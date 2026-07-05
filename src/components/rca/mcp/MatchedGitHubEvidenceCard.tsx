import { GitPullRequest } from "lucide-react";
import type { McpGitHubArtifactRef } from "@/types";
import { cn } from "@/lib/utils";

interface MatchedGitHubEvidenceCardProps {
  github: McpGitHubArtifactRef;
  className?: string;
}

export function MatchedGitHubEvidenceCard({
  github,
  className,
}: MatchedGitHubEvidenceCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
          <GitPullRequest className="h-5 w-5 text-violet-300" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300/85">
            Matched GitHub evidence
          </p>
          {github.pullRequestNumber !== undefined ? (
            <p className="mt-2 font-mono text-lg font-semibold text-violet-100">
              PR #{github.pullRequestNumber}
            </p>
          ) : null}
          {github.pullRequestTitle ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              {github.pullRequestTitle}
            </p>
          ) : null}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        {github.repository ? (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Repository
            </dt>
            <dd className="mt-1 font-mono text-xs text-slate-300">{github.repository}</dd>
          </div>
        ) : null}
        {github.commitSha ? (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Commit
            </dt>
            <dd className="mt-1 font-mono text-xs text-slate-300">{github.commitSha}</dd>
          </div>
        ) : null}
        {github.changedFiles?.length ? (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Changed files
            </dt>
            <dd className="mt-2 space-y-1.5">
              {github.changedFiles.map((file) => (
                <p
                  key={file}
                  className="rounded-lg border border-violet-500/20 bg-violet-500/[0.06] px-3 py-2 font-mono text-xs text-violet-100/95"
                >
                  {file}
                </p>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
