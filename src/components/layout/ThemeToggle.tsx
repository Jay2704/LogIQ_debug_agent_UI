import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative flex h-7 w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full border",
        "transition-all duration-300 ease-in-out",
        isDark
          ? "border-cyber/[0.2] bg-black/[0.6]"
          : "border-sky-200 bg-sky-100",
        className
      )}
    >
      {/* Sliding thumb */}
      <span
        className={cn(
          "absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "left-0.5 bg-surface-825 ring-1 ring-cyber/[0.25] shadow-none"
            : "left-[calc(100%-1.625rem)] bg-white ring-1 ring-sky-200 shadow-sm shadow-sky-200/50"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-cyber" strokeWidth={1.75} />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
        )}
      </span>

      {/* Dim opposite-mode icon on the other side */}
      <span
        className={cn(
          "pointer-events-none absolute transition-opacity duration-200",
          isDark ? "right-1.5 opacity-25" : "left-1.5 opacity-30"
        )}
      >
        {isDark ? (
          <Sun className="h-2.5 w-2.5 text-slate-400" strokeWidth={2} />
        ) : (
          <Moon className="h-2.5 w-2.5 text-slate-400" strokeWidth={1.75} />
        )}
      </span>
    </button>
  );
}
