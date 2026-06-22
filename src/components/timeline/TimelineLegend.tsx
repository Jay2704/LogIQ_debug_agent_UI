import {
  TIMELINE_GROUP_COLORS,
  TIMELINE_GROUP_LABELS,
  TIMELINE_GROUP_ORDER,
} from "@/lib/timelineGroups";

export function TimelineLegend() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/[0.88] p-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        Event groups
      </p>
      <ul className="flex flex-wrap gap-2">
        {TIMELINE_GROUP_ORDER.map((group) => {
          const colors = TIMELINE_GROUP_COLORS[group];
          return (
            <li
              key={group}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-slate-300"
              style={{
                borderColor: `${colors.border}66`,
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.border }}
                aria-hidden
              />
              {TIMELINE_GROUP_LABELS[group]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
