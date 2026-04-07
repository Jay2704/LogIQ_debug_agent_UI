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
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 sm:h-14 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 shrink items-center rounded-md outline-none ring-offset-2 ring-offset-[#080d18] transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
        >
          <LogIQFullLogo className="h-8 w-auto max-w-[min(240px,50vw)] object-contain object-left sm:h-9 sm:max-w-[min(280px,54vw)] lg:h-10" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex lg:gap-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-200 lg:text-[15px] lg:leading-snug"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <Link
            to="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold leading-tight text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200 sm:inline-block"
          >
            Login
          </Link>
          <Link
            to="/login"
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-semibold leading-tight text-white sm:px-5 sm:py-2.5 sm:text-sm",
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
