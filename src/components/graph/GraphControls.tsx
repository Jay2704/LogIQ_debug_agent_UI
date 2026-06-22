import { Maximize2, Minus, Plus } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function GraphControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/[0.1] bg-black/[0.88] p-1 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={() => zoomIn({ duration: 200 })}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => zoomOut({ duration: 200 })}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => void fitView({ padding: 0.2, duration: 250 })}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        title="Fit view"
        aria-label="Fit view"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
