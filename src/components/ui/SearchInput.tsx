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
          "w-full rounded-xl border border-blue-500/[0.12] bg-surface-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500",
          "shadow-inner outline-none transition duration-200",
          "focus:border-sky-500/40 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)] focus:ring-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
