import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { layoutGraphPositions } from "@/lib/graphNodeColors";
import type { InvestigationGraph, InvestigationGraphNode } from "@/types";
import { GraphControls } from "./GraphControls";
import { GraphLegend } from "./GraphLegend";
import { GraphNode, type GraphNodeData } from "./GraphNode";

const nodeTypes = { graphNode: GraphNode };

interface GraphCanvasProps {
  graph: InvestigationGraph;
  selectedNodeId: string | null;
  onSelectNode: (node: InvestigationGraphNode | null) => void;
}

function toFlowNodes(
  graph: InvestigationGraph,
  selectedNodeId: string | null
): Node<GraphNodeData>[] {
  const positions = layoutGraphPositions(graph.nodes);

  return graph.nodes.map((node) => ({
    id: node.id,
    type: "graphNode",
    position: positions.get(node.id) ?? { x: 0, y: 0 },
    data: {
      title: node.title,
      nodeType: node.type,
      selected: node.id === selectedNodeId,
    },
    selected: node.id === selectedNodeId,
  }));
}

function toFlowEdges(graph: InvestigationGraph): Edge[] {
  return graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: "smoothstep",
    animated: false,
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
    labelStyle: { fill: "#cbd5e1", fontSize: 10, fontWeight: 600 },
    labelBgStyle: { fill: "rgba(0,0,0,0.78)", fillOpacity: 0.9 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 6,
    style: { stroke: "rgba(148, 163, 184, 0.55)", strokeWidth: 1.5 },
  }));
}

function GraphCanvasInner({ graph, selectedNodeId, onSelectNode }: GraphCanvasProps) {
  const nodes = useMemo(
    () => toFlowNodes(graph, selectedNodeId),
    [graph, selectedNodeId]
  );
  const edges = useMemo(() => toFlowEdges(graph), [graph]);

  useEffect(() => {
    if (!selectedNodeId) return;
    const stillExists = graph.nodes.some((node) => node.id === selectedNodeId);
    if (!stillExists) {
      onSelectNode(null);
    }
  }, [graph.nodes, onSelectNode, selectedNodeId]);

  return (
    <div className="relative h-[min(70vh,640px)] min-h-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-black/[0.92]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={2}
        panOnScroll
        zoomOnScroll
        nodesConnectable={false}
        nodesDraggable
        elementsSelectable
        onNodeClick={(_event, node) => {
          const match = graph.nodes.find((item) => item.id === node.id) ?? null;
          onSelectNode(match);
        }}
        onPaneClick={() => onSelectNode(null)}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="rgba(148, 163, 184, 0.12)" />
        <Controls
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          className="!hidden"
        />
      </ReactFlow>

      <div className="pointer-events-none absolute left-3 top-3 z-10">
        <div className="pointer-events-auto">
          <GraphLegend />
        </div>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 z-10">
        <div className="pointer-events-auto">
          <GraphControls />
        </div>
      </div>
    </div>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
