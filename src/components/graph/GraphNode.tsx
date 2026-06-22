import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  GRAPH_NODE_COLORS,
  GRAPH_NODE_TYPE_LABELS,
} from "@/lib/graphNodeColors";
import type { InvestigationGraphNodeType } from "@/types";

export interface GraphNodeData {
  title: string;
  nodeType: InvestigationGraphNodeType;
  selected?: boolean;
  [key: string]: unknown;
}

function GraphNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as GraphNodeData;
  const colors = GRAPH_NODE_COLORS[nodeData.nodeType];
  const isSelected = selected || nodeData.selected;

  return (
    <div
      className="min-w-[10.5rem] max-w-[14rem] rounded-xl px-3 py-2.5 shadow-lg transition"
      style={{
        background: colors.background,
        border: `2px solid ${isSelected ? "#ffffff" : colors.border}`,
        color: colors.color,
        boxShadow: isSelected ? "0 0 0 2px rgba(255,255,255,0.25)" : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-80">
        {GRAPH_NODE_TYPE_LABELS[nodeData.nodeType]}
      </p>
      <p className="mt-1 text-xs font-semibold leading-snug text-white">{nodeData.title}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
    </div>
  );
}

export const GraphNode = memo(GraphNodeComponent);
