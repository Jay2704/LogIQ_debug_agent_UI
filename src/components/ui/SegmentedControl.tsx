import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  className?: string;
  /** For aria-label on tablist */
  label?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  label = "Section",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex w-full max-w-2xl rounded-xl border border-white/[0.08] bg-black/[0.94] p-1 shadow-inner",
        className
      )}
      role="tablist"
      aria-label={label}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative flex-1 rounded-lg px-3 py-2.5 text-center text-xs font-semibold transition duration-200 sm:text-sm",
              selected
                ? "bg-gradient-to-b from-sky-500/25 to-blue-600/20 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_4px_16px_-6px_rgba(56,189,248,0.35)] ring-1 ring-sky-500/35"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
