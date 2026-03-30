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
        "flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center",
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
