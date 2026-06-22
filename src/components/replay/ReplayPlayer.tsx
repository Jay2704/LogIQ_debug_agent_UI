import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { ReplayControls } from "./ReplayControls";
import { ReplayEventCard } from "./ReplayEventCard";
import { ReplayTimeline } from "./ReplayTimeline";
import type {
  InvestigationGraph,
  InvestigationReplay,
  InvestigationReplayEvent,
  ReplaySpeed,
} from "@/types";
import { REPLAY_STEP_MS } from "@/types";

interface ReplayPlayerProps {
  replay: InvestigationReplay;
  graph?: InvestigationGraph | null;
}

function filterGraphForReplay(
  graph: InvestigationGraph,
  revealedNodeIds: Set<string>,
  activeNodeId: string | null
): InvestigationGraph {
  const nodes = graph.nodes.filter((node) => revealedNodeIds.has(node.id));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = graph.edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );

  return {
    ...graph,
    nodes: nodes.map((node) => ({
      ...node,
      metadata: {
        ...node.metadata,
        replayActive: node.id === activeNodeId,
      },
    })),
    edges,
  };
}

export function ReplayPlayer({ replay, graph = null }: ReplayPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<ReplaySpeed>(1);
  const timerRef = useRef<number | null>(null);

  const totalSteps = replay.events.length;
  const currentEvent: InvestigationReplayEvent | null =
    currentIndex > 0 ? replay.events[currentIndex - 1] ?? null : null;

  const progress =
    totalSteps === 0 ? 0 : (currentIndex / totalSteps) * 100;

  const revealedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    for (let i = 0; i < currentIndex; i += 1) {
      const nodeId = replay.events[i]?.graphNodeId;
      if (nodeId) ids.add(nodeId);
    }
    return ids;
  }, [currentIndex, replay.events]);

  const activeGraphNodeId = currentEvent?.graphNodeId ?? null;

  const replayGraph = useMemo(() => {
    if (!graph || revealedNodeIds.size === 0) return null;
    return filterGraphForReplay(graph, revealedNodeIds, activeGraphNodeId);
  }, [graph, revealedNodeIds, activeGraphNodeId]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleRestart = useCallback(() => {
    clearTimer();
    setPlaying(false);
    setCurrentIndex(0);
  }, [clearTimer]);

  const handlePlay = useCallback(() => {
    if (totalSteps === 0) return;
    if (currentIndex >= totalSteps) {
      setCurrentIndex(0);
    }
    setPlaying(true);
  }, [currentIndex, totalSteps]);

  const handlePause = useCallback(() => {
    setPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const handleSelectStep = useCallback(
    (step: number) => {
      clearTimer();
      setPlaying(false);
      setCurrentIndex(Math.max(0, Math.min(step, totalSteps)));
    },
    [clearTimer, totalSteps]
  );

  useEffect(() => {
    if (!playing || totalSteps === 0) {
      clearTimer();
      return;
    }

    const intervalMs = REPLAY_STEP_MS / speed;
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalSteps) {
          setPlaying(false);
          return prev;
        }
        const next = prev + 1;
        if (next >= totalSteps) {
          setPlaying(false);
        }
        return next;
      });
    }, intervalMs);

    return clearTimer;
  }, [playing, speed, totalSteps, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <div className="space-y-6">
      <ReplayControls
        playing={playing}
        speed={speed}
        disabled={totalSteps === 0}
        onPlay={handlePlay}
        onPause={handlePause}
        onRestart={handleRestart}
        onSpeedChange={setSpeed}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ReplayEventCard event={currentEvent} step={currentIndex} totalSteps={totalSteps} />
        <ReplayTimeline
          events={replay.events}
          currentIndex={currentIndex}
          progress={progress}
          onSelectStep={handleSelectStep}
        />
      </div>

      {graph ? (
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Graph sync
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Nodes appear on the investigation graph as replay steps reveal correlated events.
            </p>
          </div>
          {replayGraph && replayGraph.nodes.length > 0 ? (
            <GraphCanvas
              graph={replayGraph}
              selectedNodeId={activeGraphNodeId}
              onSelectNode={() => undefined}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.1] bg-black/[0.55] px-4 py-10 text-center text-sm text-slate-500">
              Graph nodes will appear as the replay progresses.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
