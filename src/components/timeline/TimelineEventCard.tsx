import { TIMELINE_GROUP_COLORS, TIMELINE_GROUP_LABELS } from "@/lib/timelineGroups";
import { cn, formatDateTime } from "@/lib/utils";
import type { InvestigationTimelineEvent } from "@/types";

const severityTone: Record<InvestigationTimelineEvent["severity"], string> = {
  info: "border-slate-500/35 bg-slate-500/15 text-slate-300",
  low: "border-sky-500/35 bg-sky-500/15 text-sky-200",
  medium: "border-amber-500/35 bg-amber-500/15 text-amber-200",
  high: "border-orange-500/35 bg-orange-500/15 text-orange-200",
  critical: "border-red-500/35 bg-red-500/15 text-red-200",
};

interface TimelineEventCardProps {
  event: InvestigationTimelineEvent;
}

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  const groupColors = TIMELINE_GROUP_COLORS[event.group];

  return (
    <article
      className="relative rounded-xl border bg-black/[0.82] p-4 pl-5"
      style={{
        borderColor: `${groupColors.border}55`,
        boxShadow: `inset 3px 0 0 0 ${groupColors.border}`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] text-slate-500">
            {formatDateTime(event.timestamp)}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-white">{event.title}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{
              borderColor: `${groupColors.border}66`,
              backgroundColor: groupColors.bg,
              color: groupColors.text,
            }}
          >
            {TIMELINE_GROUP_LABELS[event.group]}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
              severityTone[event.severity]
            )}
          >
            {event.severity}
          </span>
        </div>
      </div>

      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Event type</dt>
          <dd className="mt-0.5 font-mono text-slate-300">{event.eventType}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Source</dt>
          <dd className="mt-0.5 font-mono text-slate-300">{event.source}</dd>
        </div>
      </dl>

      {event.description ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{event.description}</p>
      ) : null}
    </article>
  );
}
