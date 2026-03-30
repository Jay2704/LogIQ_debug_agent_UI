import { Link } from "react-router-dom";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-slate-500">404</p>
      <h1 className="mt-2 text-xl font-bold text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        That route does not exist in this UI build.
      </p>
      <Link
        to="/"
        className={cn(
          "mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/30 transition",
          ctaButtonGradient,
          ctaGlowBlueOnly
        )}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
