import type { FormEvent } from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthInput, AuthPasswordInput } from "@/components/auth/AuthField";
import { submitLogin } from "@/lib/authHandlers";
import {
  hasFieldErrors,
  isLoginFormValid,
  validateLogin,
} from "@/lib/authValidation";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { AuthSubmitStatus, LoginFormValues } from "@/types";

const initial: LoginFormValues = {
  email: "",
  password: "",
};

function visibleLoginError(
  field: keyof LoginFormValues,
  errs: Partial<Record<keyof LoginFormValues, string>>,
  values: LoginFormValues,
  touched: Partial<Record<keyof LoginFormValues, boolean>>
): string | undefined {
  const e = errs[field];
  if (!e) return undefined;
  if (field === "email") {
    return touched.email || values.email.length > 0 ? e : undefined;
  }
  if (field === "password") {
    return touched.password || values.password.length > 0 ? e : undefined;
  }
  return undefined;
}

export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, user } = useCurrentUser();
  const [values, setValues] = useState<LoginFormValues>(initial);
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormValues, boolean>>
  >({});
  const [submitStatus, setSubmitStatus] = useState<AuthSubmitStatus>("idle");
  const [banner, setBanner] = useState("");

  const loading = submitStatus === "loading";
  const errs = validateLogin(values);
  const formValid = isLoginFormValid(values);
  /** Only the submit button respects invalid form; inputs stay editable unless submitting. */
  const submitDisabled = loading || !formValid;

  function touch(field: keyof LoginFormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function update<K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setBanner("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validateLogin(values);
    if (hasFieldErrors(next)) return;

    setSubmitStatus("loading");
    setBanner("");
    const result = await submitLogin(values.email, values.password);
    if (result.status === "success" && result.user) {
      setCurrentUser(result.user);
      setValues((v) => ({ ...v, password: "" }));
      navigate("/", { replace: true });
      return;
    }
    setSubmitStatus("error");
    setBanner(result.message ?? "Login failed.");
  }

  if (user?.userId?.trim()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      cardTitle="Login"
      cardDescription="Enter your email and password. Your password is not stored in the browser — only the returned user profile is saved for this session."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {submitStatus === "error" && banner ? (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
            role="alert"
            aria-live="polite"
          >
            {banner}
          </div>
        ) : null}

        <AuthField
          id="login-email"
          label="Email"
          error={visibleLoginError("email", errs, values, touched)}
        >
          <AuthInput
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => touch("email")}
            disabled={loading}
            error={visibleLoginError("email", errs, values, touched)}
            success={Boolean(
              values.email.trim() && !errs.email && submitStatus !== "error"
            )}
          />
        </AuthField>

        <AuthField
          id="login-password"
          label="Password"
          error={visibleLoginError("password", errs, values, touched)}
        >
          <AuthPasswordInput
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            onBlur={() => touch("password")}
            disabled={loading}
            error={visibleLoginError("password", errs, values, touched)}
            success={Boolean(
              values.password && !errs.password && submitStatus !== "error"
            )}
          />
        </AuthField>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-sky-400/90 transition hover:text-sky-300"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitDisabled}
          className={cn(
            "relative flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
            ctaButtonGradient,
            ctaGlowBlueOnly,
            "ring-1 ring-blue-400/35 transition-all duration-300 ease-out",
            "hover:shadow-[0_0_0_1px_rgba(56,189,248,0.45),0_12px_40px_-12px_rgba(59,130,246,0.25)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in…
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-sky-400 transition hover:text-sky-300"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
