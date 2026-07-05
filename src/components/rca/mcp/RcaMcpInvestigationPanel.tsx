import type { RcaMcpInvestigationContext } from "@/types";
import { hasRcaMcpInvestigationContext } from "@/api/http/parseRcaMcpApi";
import { McpSignalContributionsCard } from "./McpSignalContributionsCard";
import { MatchedJiraEvidenceCard } from "./MatchedJiraEvidenceCard";
import { MatchedGitHubEvidenceCard } from "./MatchedGitHubEvidenceCard";
import { EvidenceBundleFromMcpContext } from "./EvidenceBundleSection";
import { GraphRagExplanationSection } from "./GraphRagExplanationSection";
import { cn } from "@/lib/utils";

interface RcaMcpInvestigationPanelProps {
  context: RcaMcpInvestigationContext | undefined;
  className?: string;
}

export function RcaMcpInvestigationPanel({
  context,
  className,
}: RcaMcpInvestigationPanelProps) {
  if (!hasRcaMcpInvestigationContext(context)) {
    return null;
  }

  const { jira } = context.mcpArtifactRefs;
  const { github } = context.mcpArtifactRefs;

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400/90">
          MCP-powered investigation
        </p>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          External context from Jira and GitHub that influenced candidate ranking — surfaced
          from <span className="font-mono text-xs text-slate-400">signal_scores</span>,{" "}
          <span className="font-mono text-xs text-slate-400">mcp_artifact_refs</span>, and
          GraphRAG citations.
        </p>
        {context.mcpContextSummary?.text ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {context.mcpContextSummary.text}
          </p>
        ) : null}
      </div>

      <McpSignalContributionsCard context={context} />

      <div className="grid gap-4 lg:grid-cols-2">
        {jira ? <MatchedJiraEvidenceCard jira={jira} /> : null}
        {github ? <MatchedGitHubEvidenceCard github={github} /> : null}
      </div>

      <EvidenceBundleFromMcpContext context={context} />

      {context.graphRagExplanation ? (
        <GraphRagExplanationSection explanation={context.graphRagExplanation} />
      ) : null}
    </div>
  );
}
