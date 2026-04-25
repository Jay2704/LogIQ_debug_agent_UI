
import { Check } from "lucide-react";
import {
  getPasswordRuleChecks,
  MIN_PASSWORD_LENGTH,
} from "@/lib/authValidation";
import { cn } from "@/lib/utils";

const rules: { key: keyof ReturnType<typeof getPasswordRuleChecks>; label: string }[] =
  [
    { key: "minLength", label: `${MIN_PASSWORD_LENGTH}+ characters` },
    { key: "uppercase", label: "One uppercase letter" },
    { key: "lowercase", label: "One lowercase letter" },
    { key: "number", label: "One number" },
    { key: "special", label: "One special character (!@#$…)" },
  ];

interface PasswordStrengthHintProps {
  password: string;
  disabled?: boolean;
}

/**
 * Subtle checklist for signup — matches {@link getPasswordRuleChecks} / backend policy.
 */
export function PasswordStrengthHint({
  password,
  disabled,
}: PasswordStrengthHintProps) {
  const checks = getPasswordRuleChecks(password);
  const anyTyped = password.length > 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-black/[0.94] px-3 py-2.5",
        disabled && "opacity-50"
      )}
      aria-live="polite"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        Password requirements
      </p>
      <ul className="mt-2 space-y-1.5">
        {rules.map(({ key, label }) => {
          const ok = checks[key];
          return (
            <li
              key={key}
              className={cn(
                "flex items-center gap-2 text-[11px] transition-colors duration-200",
                ok
                  ? "text-emerald-400/95"
                  : anyTyped
                    ? "text-slate-500"
                    : "text-slate-600"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                  ok
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                    : "border-white/[0.08] bg-black/[0.94] text-slate-600"
                )}
              >
                {ok ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : ""}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
