import { Link } from "react-router-dom";

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
        className="mt-6 rounded-xl bg-cta-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cta ring-1 ring-sky-400/25 transition hover:bg-cta-primary-hover"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
