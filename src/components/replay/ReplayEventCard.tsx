import { TIMELINE_GROUP_COLORS } from "@/lib/timelineGroups";
import { formatDateTime } from "@/lib/utils";
import type { InvestigationReplayEvent } from "@/types";

interface ReplayEventCardProps {
  event: InvestigationReplayEvent | null;
  step: number;
  totalSteps: number;
}

export function ReplayEventCard({ event, step, totalSteps }: ReplayEventCardProps) {
  if (!event) {
    return (
      <article className="rounded-2xl border border-dashed border-white/[0.1] bg-black/[0.55] p-6 text-center">
        <p className="text-sm text-slate-500">Press Play to begin the investigation replay.</p>
        <p className="mt-2 font-mono text-xs text-slate-600">
          Step 0 / {totalSteps}
        </p>
      </article>
    );
  }

  const groupColors = TIMELINE_GROUP_COLORS[event.group];

  return (
    <article
      className="rounded-2xl border bg-black/[0.88] p-5 shadow-card"
      style={{
        borderColor: `${groupColors.border}66`,
        boxShadow: `inset 4px 0 0 0 ${groupColors.border}`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-400/90">
            Current event
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            {formatDateTime(event.timestamp)}
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">{event.title}</h2>
        </div>
        <span className="rounded-full border border-white/[0.1] bg-black/[0.55] px-2.5 py-1 font-mono text-[11px] text-slate-400">
          {step} / {totalSteps}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Event type
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-300">{event.eventType}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Source
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-300">{event.source}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Severity
          </dt>
          <dd className="mt-1 capitalize text-slate-300">{event.severity}</dd>
        </div>
        {event.graphNodeId ? (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Graph node
            </dt>
            <dd className="mt-1 font-mono text-xs text-violet-300">{event.graphNodeId}</dd>
          </div>
        ) : null}
      </dl>

      {event.description ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-400">{event.description}</p>
      ) : null}
    </article>
  );
}
