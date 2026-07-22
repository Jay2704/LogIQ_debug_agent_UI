import type { TimelineFilters } from "@/types";
import { cn } from "@/lib/utils";

interface TimelineFilterBarProps {
  filters: TimelineFilters;
  eventTypeOptions: string[];
  sourceOptions: string[];
  onChange: (next: TimelineFilters) => void;
  onReset: () => void;
}

export function TimelineFilterBar({
  filters,
  eventTypeOptions,
  sourceOptions,
  onChange,
  onReset,
}: TimelineFilterBarProps) {
  const toggleValue = (
    key: "eventTypes" | "sources",
    value: string
  ) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/[0.94] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">Filters</p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-sky-300 transition hover:text-sky-200"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Start date
          </span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className="w-full rounded-xl border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            End date
          </span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="w-full rounded-xl border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Event type
        </p>
        <div className="flex flex-wrap gap-2">
          {eventTypeOptions.map((type) => {
            const active = filters.eventTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleValue("eventTypes", type)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                  active
                    ? "border-sky-500/40 bg-sky-500/15 text-sky-200"
                    : "border-white/[0.1] bg-black/[0.55] text-slate-400 hover:text-slate-200"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Source
        </p>
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map((source) => {
            const active = filters.sources.includes(source);
            return (
              <button
                key={source}
                type="button"
                onClick={() => toggleValue("sources", source)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                  active
                    ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                    : "border-white/[0.1] bg-black/[0.55] text-slate-400 hover:text-slate-200"
                )}
              >
                {source}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
