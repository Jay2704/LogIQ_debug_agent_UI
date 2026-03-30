/**
 * Explicit blue → indigo/violet gradients + blue-only outer glows (no magenta-heavy
 * violet in shadows — those can read as “red” on dark UIs).
 */
export const ctaButtonGradient =
  "bg-[linear-gradient(135deg,#3B82F6_0%,#6366f1_48%,#7C3AED_100%)] hover:bg-[linear-gradient(135deg,#60A5FA_0%,#818cf8_45%,#8B5CF6_100%)]";

/** Sidebar / quick-nav active pill — indigo-forward, less magenta than pure violet */
export const navItemActiveGradient =
  "bg-[linear-gradient(135deg,rgba(59,130,246,0.44)_0%,rgba(79,70,229,0.28)_48%,rgba(15,23,42,0.48)_100%)]";

/** Replace shadow-glow-cta where a strictly blue halo is needed (auth + primary buttons) */
export const ctaGlowBlueOnly =
  "shadow-[0_0_0_1px_rgba(59,130,246,0.42),0_10px_36px_-8px_rgba(59,130,246,0.22),0_0_52px_-14px_rgba(96,165,250,0.16)]";

/** Inset ring for active nav — blue/indigo, not purple-pink */
export const navActiveInsetShadow =
  "shadow-[inset_0_0_0_1px_rgba(59,130,246,0.28),inset_0_1px_0_0_rgba(255,255,255,0.06)]";
