import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

interface MaskedSecretInputProps {
  id: string;
  label: string;
  maskedValue: string | null;
  hasSavedSecret: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function MaskedSecretInput({
  id,
  label,
  maskedValue,
  hasSavedSecret,
  value,
  onChange,
  placeholder = "Paste token…",
  required = false,
  disabled = false,
}: MaskedSecretInputProps) {
  const [replacing, setReplacing] = useState(!hasSavedSecret);
  const [visible, setVisible] = useState(false);

  const showMasked = hasSavedSecret && !replacing;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-slate-400">
        {label}
      </label>
      {showMasked ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-[42px] flex-1 items-center rounded-xl border border-white/[0.08] bg-black/[0.55] px-3 font-mono text-sm text-slate-300">
            {maskedValue ?? "••••••••"}
          </span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setReplacing(true);
              onChange("");
            }}
            className="rounded-xl border border-white/[0.12] px-3 py-2 text-xs font-semibold text-sky-300 transition hover:border-sky-400/40 hover:text-white disabled:opacity-50"
          >
            Replace token
          </button>
        </div>
      ) : (
        <div className="relative mt-1.5">
          <input
            id={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete="off"
            className={cn(
              "w-full rounded-xl py-2.5 pl-3 pr-11 text-sm text-slate-100 placeholder:text-slate-500",
              ui.surfaceInput,
              ui.focusRing,
              "outline-none"
            )}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-200 disabled:opacity-50"
            aria-label={visible ? "Hide token" : "Show token"}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      )}
      {hasSavedSecret && !replacing ? (
        <p className="mt-1.5 text-xs text-slate-500">
          Saved token is never shown in full. Use replace to supply a new value.
        </p>
      ) : null}
    </div>
  );
}
