/** Shared interaction + surface classes for cohesive product UI */
export const ui = {
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-960",
  focusRingInset:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500/40",
  shellBorder: "border-white/[0.08]",
  surfaceInput:
    "border border-white/[0.08] bg-surface-975/70 backdrop-blur-sm shadow-inner transition-all duration-200",
  iconBtn:
    "inline-flex items-center justify-center rounded-lg p-2.5 text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-100",
  transitionColors: "transition-colors duration-200",
  transitionAll: "transition-all duration-200",
} as const;
