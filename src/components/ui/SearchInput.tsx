import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
}

export function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        strokeWidth={2}
      />
      <input
        type="search"
        className={cn(
          "w-full rounded-xl border border-white/[0.08] bg-surface-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500",
          "outline-none ring-0 transition focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
