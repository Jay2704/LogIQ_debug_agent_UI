import type { FormEvent } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthInput } from "@/components/auth/AuthField";
import { submitForgotPassword } from "@/lib/authHandlers";
import { validateEmailField } from "@/lib/authValidation";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

const GENERIC_SUCCESS =
  "If an account exists for this email, a reset link has been sent.";

export function ForgotPassword() {
  const { user } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [banner, setBanner] = useState("");

  if (user?.userId?.trim()) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const eErr = validateEmailField(email);
    setError(eErr);
    if (eErr) return;

    setSubmitting(true);
    setBanner("");
    try {
      await submitForgotPassword(email);
      setDone(true);
    } catch (err) {
      setBanner(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      cardTitle="Forgot password"
      cardDescription={
        done
          ? "Check your inbox for next steps."
          : "Enter your account email. We’ll send reset instructions if an account exists."
      }
    >
      {done ? (
        <div className="space-y-5">
          <div
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200"
            role="status"
          >
            {GENERIC_SUCCESS}
          </div>
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
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
          {banner ? (
            <div
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
              role="alert"
            >
              {banner}
            </div>
          ) : null}

          <AuthField id="forgot-email" label="Email" error={error}>
            <AuthInput
              id="forgot-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(undefined);
              }}
              disabled={submitting}
              error={error}
              success={Boolean(email.trim() && !error)}
            />
          </AuthField>

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "relative flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
              ctaButtonGradient,
              ctaGlowBlueOnly,
              "ring-1 ring-blue-400/35 transition-all duration-200",
              "hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300">
              Back to Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
