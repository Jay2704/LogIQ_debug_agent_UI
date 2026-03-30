import { cn } from "@/lib/utils";

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = "Loading…",
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center",
        className
      )}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-sky-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-500/40" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
