import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-slate-500">404</p>
      <h1 className="mt-2 text-xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        That route does not exist in this UI build.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
