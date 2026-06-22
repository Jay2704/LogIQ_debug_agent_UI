import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, FileText, MessageSquareWarning, RefreshCw } from "lucide-react";
import { useInvestigationGraph } from "@/api/hooks";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { PageLoading } from "@/components/ui/PageLoading";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  GRAPH_NODE_TYPE_LABELS,
} from "@/lib/graphNodeColors";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn, formatDateTime } from "@/lib/utils";
import type { InvestigationGraphNode } from "@/types";

function NodeDetailsPanel({ node }: { node: InvestigationGraphNode }) {
  const metadataEntries = useMemo(
    () => Object.entries(node.metadata ?? {}),
    [node.metadata]
  );

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/[0.88] p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        Selected node
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">{node.title}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Type
          </dt>
          <dd className="mt-1 text-slate-200">{GRAPH_NODE_TYPE_LABELS[node.type]}</dd>
        </div>
        {node.timestamp ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Timestamp
            </dt>
            <dd className="mt-1 font-mono text-xs text-slate-300">
              {formatDateTime(node.timestamp)}
            </dd>
          </div>
        ) : null}
        {metadataEntries.length > 0 ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Metadata
            </dt>
            <dd className="mt-2 space-y-1.5">
              {metadataEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-white/[0.06] bg-black/[0.65] px-3 py-2"
                >
                  <span className="font-mono text-[11px] text-slate-500">{key}</span>
                  <span className="font-mono text-xs text-slate-200">{String(value)}</span>
                </div>
              ))}
            </dd>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No metadata for this node.</p>
        )}
      </dl>
    </div>
  );
}

export function InvestigationGraph() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data, loading, error, refetch } = useInvestigationGraph(jobId);
  const [selectedNode, setSelectedNode] = useState<InvestigationGraphNode | null>(null);

  if (!jobId?.trim()) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="No job ID"
        description="Open a job from the jobs list to view its investigation graph."
        action={
          <Link
            to="/jobs"
            className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to jobs
          </Link>
        }
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 pb-16">
        <p className="text-center font-mono text-xs text-slate-500">
          Loading graph for <span className="text-slate-400">{jobId}</span>…
        </p>
        <PageLoading message="Loading investigation graph…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-16">
        <FeedbackNotice tone="error" title="Could not load investigation graph">
          <p className="text-red-100/85">{error.message}</p>
        </FeedbackNotice>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}`}
            className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to job detail
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="Graph unavailable"
        description="The API returned no graph data for this investigation."
        action={
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}`}
            className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to job detail
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-col gap-4 border-b border-blue-500/[0.12] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Job detail
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Investigation graph
          </h1>
          <p className="mt-2 font-mono text-sm text-slate-400">{jobId}</p>
          <p className="mt-1 text-xs text-slate-500">
            {data.nodes.length} nodes · {data.edges.length} edges
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}/report`}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.08] px-4 py-2.5 text-sm font-semibold text-indigo-200 transition hover:border-indigo-400/45 hover:bg-indigo-500/15 hover:text-white"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Report
          </Link>
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}/timeline`}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/[0.08] px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:border-violet-400/45 hover:bg-violet-500/15 hover:text-white"
          >
            <Clock className="h-4 w-4" aria-hidden />
            Timeline
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
          className={cn(
            "inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
            ctaButtonGradient,
            ctaGlowBlueOnly
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh graph
        </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <GraphCanvas
          graph={data}
          selectedNodeId={selectedNode?.id ?? null}
          onSelectNode={setSelectedNode}
        />
        {selectedNode ? (
          <NodeDetailsPanel node={selectedNode} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-black/[0.55] p-5 text-sm text-slate-500">
            Select a node to view its title, type, timestamp, and metadata. Use scroll to zoom and
            drag the canvas to pan.
          </div>
        )}
      </div>
    </div>
  );
}
