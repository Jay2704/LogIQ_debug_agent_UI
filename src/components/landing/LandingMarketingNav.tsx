import { Link } from "react-router-dom";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#top", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#workspace-explore", label: "Utilities" },
  { href: "#contact", label: "Contact" },
] as const;

export function LandingMarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-[#080d18]/55 backdrop-blur-md supports-[backdrop-filter]:bg-[#080d18]/45">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-2 px-3 sm:h-12 sm:gap-3 sm:px-5 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 shrink items-center rounded-md outline-none ring-offset-2 ring-offset-[#080d18] transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
        >
          <LogIQFullLogo className="h-8 w-auto max-w-[min(220px,48vw)] object-contain object-left sm:h-9 sm:max-w-[min(260px,52vw)]" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            to="/login"
            className="hidden rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200 sm:inline-block"
          >
            Login
          </Link>
          <Link
            to="/login"
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white sm:px-3 sm:text-[13px]",
              ctaButtonGradient,
              ctaGlowBlueOnly,
              "ring-1 ring-blue-400/30 transition hover:opacity-95"
            )}
          >
            Open Workspace
          </Link>
        </div>
      </div>
    </header>
  );
}
