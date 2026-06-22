import { useMemo, useState } from "react";
import {
  TIMELINE_GROUP_LABELS,
  TIMELINE_GROUP_ORDER,
} from "@/lib/timelineGroups";
import type { InvestigationTimeline, TimelineFilters } from "@/types";
import {
  applyTimelineFilters,
  TimelineFilterBar,
} from "./TimelineFilterBar";
import { TimelineEventCard } from "./TimelineEventCard";
import { TimelineLegend } from "./TimelineLegend";

const EMPTY_FILTERS: TimelineFilters = {
  startDate: "",
  endDate: "",
  eventTypes: [],
  sources: [],
};

interface TimelineWorkspaceProps {
  timeline: InvestigationTimeline;
}

export function TimelineWorkspace({ timeline }: TimelineWorkspaceProps) {
  const [filters, setFilters] = useState<TimelineFilters>(EMPTY_FILTERS);

  const eventTypeOptions = useMemo(
    () => [...new Set(timeline.events.map((e) => e.eventType))].sort(),
    [timeline.events]
  );

  const sourceOptions = useMemo(
    () => [...new Set(timeline.events.map((e) => e.source))].sort(),
    [timeline.events]
  );

  const filteredEvents = useMemo(
    () => applyTimelineFilters(timeline.events, filters),
    [timeline.events, filters]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredEvents>();
    for (const group of TIMELINE_GROUP_ORDER) {
      map.set(group, []);
    }
    for (const event of filteredEvents) {
      const bucket = map.get(event.group) ?? [];
      bucket.push(event);
      map.set(event.group, bucket);
    }
    return TIMELINE_GROUP_ORDER.map((group) => ({
      group,
      label: TIMELINE_GROUP_LABELS[group],
      events: map.get(group) ?? [],
    })).filter((section) => section.events.length > 0);
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      <TimelineLegend />

      <TimelineFilterBar
        filters={filters}
        eventTypeOptions={eventTypeOptions}
        sourceOptions={sourceOptions}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700/50 bg-black/[0.82] px-4 py-12 text-center">
          <p className="text-sm font-semibold text-slate-300">No events match these filters</p>
          <p className="mt-2 text-xs text-slate-500">
            Adjust the date range, event type, or source filters to see timeline activity.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((section) => (
            <section key={section.group}>
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {section.label}
              </h2>
              <ol className="space-y-3">
                {section.events.map((event) => (
                  <li key={event.id}>
                    <TimelineEventCard event={event} />
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
