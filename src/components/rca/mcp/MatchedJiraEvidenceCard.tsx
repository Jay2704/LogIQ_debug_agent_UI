import { Ticket } from "lucide-react";
import type { McpJiraArtifactRef } from "@/types";
import { cn } from "@/lib/utils";

interface MatchedJiraEvidenceCardProps {
  jira: McpJiraArtifactRef;
  className?: string;
}

export function MatchedJiraEvidenceCard({ jira, className }: MatchedJiraEvidenceCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-sky-500/25 bg-sky-500/[0.04] p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/30">
          <Ticket className="h-5 w-5 text-sky-300" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300/85">
            Matched Jira evidence
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-sky-100">{jira.ticketKey}</p>
          {jira.summary ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{jira.summary}</p>
          ) : null}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {jira.status ? (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Status
            </dt>
            <dd className="mt-1 text-slate-200">{jira.status}</dd>
          </div>
        ) : null}
        {jira.labels?.length ? (
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Labels
            </dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {jira.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-100/90"
                >
                  {label}
                </span>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
