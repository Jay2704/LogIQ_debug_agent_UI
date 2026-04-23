import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  /** Stronger panel styling for primary filters (e.g. jobs ops view) */
  variant?: "default" | "panel";
}

export function SearchInput({
  className,
  containerClassName,
  variant = "default",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("group relative", containerClassName)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-200",
          variant === "panel"
            ? "text-slate-500 group-focus-within:text-sky-400/90"
            : "text-slate-500 group-focus-within:text-sky-400/80"
        )}
        strokeWidth={2}
      />
      <input
        type="search"
        className={cn(
          "w-full rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500",
          ui.focusRing,
          "outline-none",
          variant === "panel"
            ? `${ui.surfaceInput} hover:border-blue-500/25 hover:bg-black/[0.94] focus:border-sky-500/50 focus:bg-black/[0.94] focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_0_0_3px_rgba(56,189,248,0.12)]`
            : `${ui.surfaceInput} hover:border-blue-500/20 hover:bg-black/[0.94] focus:border-sky-500/45 focus:bg-black/[0.94] focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]`,
          className
        )}
        {...props}
      />
    </div>
  );
}
