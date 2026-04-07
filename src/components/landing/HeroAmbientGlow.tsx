import { cn } from "@/lib/utils";

type HeroAmbientGlowProps = {
  /** Tighter orbs inside rounded dashboard card */
  variant?: "landing" | "dashboard";
  className?: string;
};

/**
 * Soft blurred gradient orbs + faint dust — sits behind hero content only.
 * Parent must be `relative overflow-hidden`.
 */
export function HeroAmbientGlow({ variant = "landing", className }: HeroAmbientGlowProps) {
  const isDash = variant === "dashboard";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Blue / indigo — upper area */}
      <div
        className={cn(
          "hero-ambient-orb hero-ambient-orb-1 absolute rounded-full blur-3xl",
          isDash
            ? "-left-[25%] top-0 h-[min(14rem,42vw)] w-[min(14rem,42vw)] bg-gradient-to-br from-sky-500/20 via-blue-600/12 to-transparent sm:h-72 sm:w-72"
            : "-left-[15%] -top-[8%] h-[min(18rem,50vw)] w-[min(18rem,50vw)] bg-gradient-to-br from-sky-500/[0.18] via-blue-600/[0.12] to-transparent md:h-96 md:w-96"
        )}
      />
      {/* Purple — mid */}
      <div
        className={cn(
          "hero-ambient-orb hero-ambient-orb-2 absolute rounded-full blur-3xl",
          isDash
            ? "left-[35%] top-[20%] h-[min(12rem,38vw)] w-[min(12rem,38vw)] bg-gradient-to-br from-violet-500/18 via-indigo-600/10 to-transparent sm:left-[40%] sm:h-64 sm:w-64"
            : "left-[30%] top-[25%] h-[min(16rem,45vw)] w-[min(16rem,45vw)] bg-gradient-to-br from-violet-500/[0.16] via-indigo-500/[0.1] to-transparent md:h-80 md:w-80"
        )}
      />
      {/* Cyan — lower right */}
      <div
        className={cn(
          "hero-ambient-orb hero-ambient-orb-3 absolute rounded-full blur-3xl",
          isDash
            ? "-bottom-[10%] -right-[15%] h-[min(13rem,40vw)] w-[min(13rem,40vw)] bg-gradient-to-tl from-cyan-500/16 via-sky-500/10 to-transparent sm:h-60 sm:w-60"
            : "-bottom-[5%] -right-[10%] h-[min(17rem,48vw)] w-[min(17rem,48vw)] bg-gradient-to-tl from-cyan-500/[0.14] via-sky-500/[0.1] to-transparent md:h-72 md:w-72"
        )}
      />
      {/* Fourth orb — purple/cyan blend — hidden on small screens to reduce noise */}
      <div
        className={cn(
          "hero-ambient-orb hero-ambient-orb-4 absolute hidden rounded-full blur-3xl sm:block",
          isDash
            ? "bottom-[15%] left-[10%] h-48 w-48 bg-gradient-to-tr from-fuchsia-500/10 via-violet-500/8 to-cyan-500/8"
            : "bottom-[20%] left-[5%] h-56 w-56 bg-gradient-to-tr from-fuchsia-500/[0.1] via-violet-500/[0.08] to-cyan-500/[0.08] md:h-72 md:w-72"
        )}
      />

      {/* Minimal dust — very low contrast */}
      <span className="hero-ambient-particle absolute left-[22%] top-[35%] h-1 w-1 rounded-full bg-sky-400/25 sm:left-[28%]" />
      <span className="hero-ambient-particle hero-ambient-particle--delayed absolute right-[30%] top-[55%] h-1 w-1 rounded-full bg-violet-400/20" />
      <span className="hero-ambient-particle hero-ambient-particle--slow absolute bottom-[40%] left-[45%] hidden h-1 w-1 rounded-full bg-cyan-400/22 sm:block" />
    </div>
  );
}
