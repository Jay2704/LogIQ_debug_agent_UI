import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full min-w-[160px] items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-surface-900/90 px-3 py-2.5 text-left text-sm transition hover:border-white/[0.12]"
      >
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate font-medium text-slate-200">{selected}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-500 transition",
              open && "rotate-180"
            )}
          />
        </span>
      </button>
      {open ? (
        <ul className="absolute right-0 z-50 mt-1 max-h-60 min-w-full overflow-auto rounded-xl border border-white/[0.08] bg-surface-850 py-1 shadow-card">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition hover:bg-white/[0.06]",
                  opt.value === value
                    ? "text-blue-400"
                    : "text-slate-300"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
