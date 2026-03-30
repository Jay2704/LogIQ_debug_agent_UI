import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
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
        <p className="text-xs font-medium text-red-400" role="alert">
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
  return (
    <input
      id={id}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl border bg-surface-975/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500",
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
      className={cn(
        "w-full cursor-pointer appearance-none rounded-xl border bg-surface-975/80 px-3.5 py-2.5 text-sm text-slate-100",
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
