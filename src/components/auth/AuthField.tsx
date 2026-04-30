import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function AuthField({
  id,
  label,
  error,
  hint,
  className,
  children,
}: AuthFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {hint && !error ? (
        <p className="text-xs text-slate-600">{hint}</p>
      ) : null}
    </div>
  );
}

interface AuthInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  className?: string;
  error?: string;
  success?: boolean;
}

export function AuthInput({
  id,
  error,
  success,
  disabled,
  className,
  ...props
}: AuthInputProps) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <input
      id={id}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={errId}
      className={cn(
        "w-full rounded-xl border bg-black/[0.94] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500",
        "shadow-inner outline-none transition-all duration-200",
        "focus:ring-0",
        error
          ? "border-red-500/40 focus:border-red-500/55 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
          : success
            ? "border-emerald-500/35 focus:border-emerald-500/50 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.1)]"
            : "border-white/[0.08] focus:border-sky-500/45 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    />
  );
}

export type AuthPasswordInputProps = Omit<AuthInputProps, "type">;

/**
 * Password field with show/hide toggle. Visibility is local UI state only — value stays in the controlled input.
 */
export function AuthPasswordInput({
  id,
  error,
  success,
  disabled,
  className,
  ...props
}: AuthPasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const errId = error ? `${id}-error` : undefined;
  const toggleLabel = visible ? "Hide password" : "Show password";

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        className={cn(
          "w-full rounded-xl border bg-black/[0.94] py-2.5 pl-3.5 pr-11 text-sm text-slate-100 placeholder:text-slate-500",
          "shadow-inner outline-none transition-all duration-200",
          "focus:ring-0",
          error
            ? "border-red-500/40 focus:border-red-500/55 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
            : success
              ? "border-emerald-500/35 focus:border-emerald-500/50 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.1)]"
              : "border-white/[0.08] focus:border-sky-500/45 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      />
      <button
        type="button"
        className={cn(
          "absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg",
          "text-slate-400 outline-none transition hover:bg-white/[0.06] hover:text-slate-200",
          "focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-975",
          disabled && "pointer-events-none opacity-40"
        )}
        onClick={() => setVisible((v) => !v)}
        aria-label={toggleLabel}
        aria-pressed={visible}
        disabled={disabled}
      >
        {visible ? (
          <EyeOff className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        ) : (
          <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
}

interface AuthSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  className?: string;
  error?: string;
  success?: boolean;
}

export function AuthSelect({
  id,
  error,
  success,
  disabled,
  className,
  children,
  ...props
}: AuthSelectProps) {
  return (
    <select
      id={id}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "w-full cursor-pointer appearance-none rounded-xl border bg-black/[0.94] px-3.5 py-2.5 text-sm text-slate-100",
        "shadow-inner outline-none transition-all duration-200",
        "focus:ring-0",
        "bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%2394a3b8%27 d=%27M6 8L1 3h10z%27/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat pr-10",
        error
          ? "border-red-500/40 focus:border-red-500/55 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
          : success
            ? "border-emerald-500/35 focus:border-emerald-500/50 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.1)]"
            : "border-white/[0.08] focus:border-sky-500/45 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
