import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { submitVerifyEmail } from "@/lib/authHandlers";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

type VerifyState = "loading" | "success" | "error" | "missing";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, setState] = useState<VerifyState>(token ? "loading" : "missing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("missing");
      setMessage(
        "Open the verification link from your email. If the link is incomplete, check your inbox or use Resend verification from signup."
      );
      return;
    }

    let cancelled = false;
    (async () => {
      const result = await submitVerifyEmail(token);
      if (cancelled) return;
      if (result.status === "success") {
        setState("success");
        setMessage(result.message ?? "");
      } else {
        setState("error");
        setMessage(result.message ?? "Verification failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (state !== "success") return;
    const id = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2800);
    return () => window.clearTimeout(id);
  }, [state, navigate]);

  const cardTitle =
    state === "loading"
      ? "Verifying email…"
      : state === "success"
        ? "Email verified"
        : state === "missing"
          ? "Invalid link"
          : "Could not verify";

  const cardDescription =
    state === "loading"
      ? "Confirming your email with the server."
      : state === "success"
        ? "You’re all set."
        : state === "missing" || state === "error"
          ? "Here’s what we know."
          : undefined;

  return (
    <AuthLayout cardTitle={cardTitle} cardDescription={cardDescription}>
      <div className="space-y-5">
        {state === "loading" ? (
          <div className="flex items-center justify-center gap-3 py-8 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
            <span className="text-sm">Working…</span>
          </div>
        ) : null}

        {state !== "loading" ? (
          <div
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm",
              state === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : state === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-amber-500/25 bg-amber-500/[0.08] text-amber-100/95"
            )}
            role="status"
          >
            {message}
          </div>
        ) : null}

        {state === "success" ? (
          <div className="space-y-2">
            <p className="text-center text-xs text-slate-500">
              Redirecting to Login…
            </p>
            <Link
              to="/login"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35 transition hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              Continue to Login
            </Link>
          </div>
        ) : null}

        {state === "error" || state === "missing" ? (
          <p className="text-center text-sm text-slate-500">
            <Link to="/signup" className="font-semibold text-sky-400 hover:text-sky-300">
              Back to signup
            </Link>
            {" · "}
            <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300">
              Login
            </Link>
          </p>
        ) : null}
      </div>
    </AuthLayout>
  );
}
