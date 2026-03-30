import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

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
  /** Highlights control when a non-"all" option is selected */
  isActive?: boolean;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className,
  isActive = false,
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
        className={cn(
          "flex w-full min-w-[168px] items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm shadow-inner outline-none transition-all duration-200",
          ui.focusRing,
          "ring-offset-2 ring-offset-surface-975",
          isActive
            ? "border-sky-500/35 bg-sky-500/[0.08] ring-1 ring-sky-500/25 hover:border-sky-400/45"
            : "border-white/[0.08] bg-surface-975/70 backdrop-blur-sm hover:border-blue-500/25 hover:bg-surface-975/85"
        )}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate font-medium text-slate-100">{selected}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </span>
      </button>
      {open ? (
        <ul className="absolute right-0 z-50 mt-1.5 max-h-60 min-w-full overflow-auto rounded-xl border border-white/[0.1] bg-surface-975/98 py-1 shadow-card-premium backdrop-blur-xl">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={cn(
                  "mx-1 w-[calc(100%-0.5rem)] rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150",
                  ui.focusRing,
                  "ring-offset-2 ring-offset-surface-975",
                  opt.value === value
                    ? "bg-sky-500/15 font-semibold text-sky-300"
                    : "text-slate-300 hover:bg-white/[0.05]"
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
