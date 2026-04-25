import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  FileSearch,
  GitBranch,
  Headphones,
  Layers,
  ListTree,
  Network,
  Radar,
  Shield,
  Sparkles,
  Terminal,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

// ── Animated number counter ────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);
  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.floor(v).toLocaleString()));
  }, [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ── Features bento grid ────────────────────────────────────────────────────
const features = [
  {
    title: "Root Cause in Seconds",
    desc: "Pinpoint the exact failure using deterministic signal analysis. No guessing — graph-based correlation across logs, traces, and deploys.",
    icon: Sparkles,
    size: "lg",
    accentColor: "from-cyber/20 to-cyber/5",
    borderColor: "border-cyber/[0.2]",
    glowColor: "hover:shadow-glow-cyber",
    iconColor: "text-cyber",
    iconBg: "bg-cyber/10 ring-cyber/20",
  },
  {
    title: "AI-Powered Debug Agent",
    desc: "LLM-assisted explanations in plain English. Understand what went wrong and exactly why.",
    icon: Brain,
    size: "sm",
    accentColor: "from-violet-500/15 to-violet-500/5",
    borderColor: "border-violet-500/[0.18]",
    glowColor: "hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.3)]",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 ring-violet-500/20",
  },
  {
    title: "Smart Log Analysis",
    desc: "Upload logs. Uncover hidden patterns instantly.",
    icon: Network,
    size: "sm",
    accentColor: "from-nexus/15 to-nexus/5",
    borderColor: "border-nexus/[0.18]",
    glowColor: "hover:shadow-glow-nexus",
    iconColor: "text-nexus",
    iconBg: "bg-nexus/10 ring-nexus/20",
  },
  {
    title: "Real-Time Anomaly Detection",
    desc: "Catch issues before they escalate. Detect unusual patterns across services the moment they appear.",
    icon: Workflow,
    size: "sm",
    accentColor: "from-amber-500/15 to-amber-500/5",
    borderColor: "border-amber-500/[0.18]",
    glowColor: "hover:shadow-glow-amber",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 ring-amber-500/20",
  },
  {
    title: "Role-Aware Collaboration",
    desc: "One workspace — tuned views for each role. Developers, SREs, testers, and support all move at different speeds.",
    icon: Layers,
    size: "sm",
    accentColor: "from-rose-500/15 to-rose-500/5",
    borderColor: "border-rose-500/[0.18]",
    glowColor: "hover:shadow-glow-rose",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10 ring-rose-500/20",
  },
] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [lg, sm] = [features[0], features.slice(1)];

  return (
    <section
      id="features"
      className="border-t border-cyber/[0.08] bg-black/[0.94] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="ui-section-eyebrow">Platform</p>
          <h2 className="ui-section-title mt-2 max-w-2xl">
            Everything you need to debug production faster
          </h2>
          <p className="ui-section-desc">
            From raw logs to root cause — one intelligent debugging workspace.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2"
        >
          {/* Large card */}
          <motion.div
            variants={cardVariants}
            className={cn(
              "nexus-card-scanline group relative overflow-hidden rounded-card border p-6 transition-all duration-300",
              "lg:col-span-5 lg:row-span-2",
              lg.borderColor,
              lg.glowColor,
              "bg-gradient-to-br from-black/[0.85] to-black/[0.96]"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30",
                lg.accentColor
              )}
            />
            <div className="relative">
              <span
                className={cn(
                  "inline-flex h-14 w-14 items-center justify-center rounded-card ring-1",
                  lg.iconBg
                )}
              >
                <lg.icon className={cn("h-7 w-7", lg.iconColor)} strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">{lg.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{lg.desc}</p>

              {/* Mini evidence mockup */}
              <div className="mt-6 space-y-2 rounded-card border border-cyber/[0.1] bg-black/[0.94] p-4">
                {[
                  { k: "Deploy delta", v: "checkout-svc@v2.4.1", color: "text-cyber" },
                  { k: "Error spike", v: "+340% vs baseline", color: "text-rose-400" },
                  { k: "Code anchor", v: "CartValidator.ts:L128", color: "text-nexus" },
                  { k: "Confidence", v: "94%", color: "text-amber-400" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between gap-3 font-mono text-[11px]"
                  >
                    <span className="text-slate-600">{row.k}</span>
                    <span className={cn("font-semibold", row.color)}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Small cards */}
          {sm.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              className={cn(
                "nexus-card-scanline group relative overflow-hidden rounded-card border p-5 transition-all duration-300",
                "lg:col-span-7",
                f.borderColor,
                f.glowColor,
                "bg-gradient-to-br from-black/[0.85] to-black/[0.96]"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-25",
                  f.accentColor
                )}
              />
              <div className="relative flex items-start gap-4">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-card ring-1",
                    f.iconBg
                  )}
                >
                  <f.icon className={cn("h-5 w-5", f.iconColor)} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── How it works ───────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Ingest anomaly", body: "Route from alerts, manual trigger, or API. Capture context immediately.", icon: Radar },
  { n: "02", title: "Run RCA pipeline", body: "Deterministic correlation across traces, deploys, and code diffs.", icon: Cpu },
  { n: "03", title: "Review evidence", body: "Ranked hypotheses with evidence panels and LLM-assisted explanations.", icon: FileSearch },
  { n: "04", title: "Take action", body: "Track fixes, rollbacks, and owner handoff without leaving the surface.", icon: CheckCircle2 },
] as const;

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="ui-section-eyebrow">Flow</p>
          <h2 className="ui-section-title mt-2">How investigations run</h2>
          <p className="ui-section-desc">Signal to action — a clear pipeline your whole org can follow.</p>
        </motion.div>

        <div className="relative mt-14">
          {/* Vertical connector line on desktop */}
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-cyber/40 via-cyber/20 to-transparent lg:block" aria-hidden />

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="relative flex items-start gap-6 lg:pl-20"
              >
                {/* Step node */}
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-card border border-cyber/[0.2] bg-black/[0.88] shadow-glow-cyber lg:absolute lg:left-0 lg:top-0">
                  <s.icon className="h-6 w-6 text-cyber" strokeWidth={1.75} />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyber text-[10px] font-bold text-surface-975">
                    {s.n.slice(-1)}
                  </span>
                </div>
                <div className="min-h-[4rem] flex-1 rounded-card border border-cyber/[0.08] bg-black/[0.84] p-5 backdrop-blur-sm">
                  <h3 className="font-display font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: 94, suffix: "%", label: "RCA confidence", sub: "on matched investigations" },
    { value: 134, suffix: "s", label: "Median triage time", sub: "P50 first-touch to hypothesis" },
    { value: 2847, suffix: "", label: "Log events analyzed", sub: "per investigation on avg" },
  ];
  return (
    <section className="border-y border-cyber/[0.08] bg-black/[0.94] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <p className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
                <span className="text-gradient-cyber">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </span>
              </p>
              <p className="mt-2 font-display text-base font-semibold text-slate-200">{s.label}</p>
              <p className="mt-1 text-sm text-slate-600">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Roles strip ────────────────────────────────────────────────────────────
const roles = [
  { label: "Developer", icon: Cpu, desc: "Code anchors & deploy context" },
  { label: "Tester", icon: Layers, desc: "Repro & regression trails" },
  { label: "Support Eng.", icon: Headphones, desc: "Customer-impacting incidents" },
  { label: "SRE", icon: Zap, desc: "Production reliability & SLOs" },
  { label: "Viewer", icon: Shield, desc: "Read-only dashboards & RCA" },
] as const;

// ── CTA components ─────────────────────────────────────────────────────────
function PrimaryCta({ className }: { className?: string }) {
  return (
    <Link
      to="/login"
      className={cn(
        "cta-shimmer-primary inline-flex items-center justify-center gap-2 rounded-card px-6 py-3 text-sm font-semibold text-white transition",
        ctaButtonGradient,
        ctaGlowBlueOnly,
        "ring-1 ring-cyber/35",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70",
        className
      )}
    >
      <span className="relative z-10">Open Workspace</span>
      <ArrowRight className="relative z-10 h-4 w-4" />
    </Link>
  );
}

function SecondaryCta({ className }: { className?: string }) {
  return (
    <Link
      to="/signup"
      className={cn(
        "cta-shimmer-secondary inline-flex items-center justify-center gap-2 rounded-card border border-cyber/[0.2] bg-black/[0.82] px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition",
        "hover:border-cyber/[0.35] hover:bg-black/[0.82] hover:text-white",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70",
        className
      )}
    >
      <span className="relative z-10">Create account</span>
    </Link>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#contact", label: "Contact" },
] as const;

function LandingNav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-cyber/[0.06] bg-black/[0.94] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 outline-none transition hover:opacity-90">
          <LogIQFullLogo className="h-8 w-auto max-w-[200px] object-contain object-left sm:h-9" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-200 hover:bg-cyber/[0.06]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-200 sm:inline-block"
          >
            Login
          </Link>
          <PrimaryCta className="px-4 py-2 text-sm" />
        </div>
      </div>
    </motion.header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function HeroSection() {
  const [typeIdx, setTypeIdx] = useState(0);
  const headlines = [
    "Debug production incidents with precision.",
    "Root cause analysis in seconds, not hours.",
    "Ship with certainty when production breaks.",
  ];

  useEffect(() => {
    const t = setInterval(() => setTypeIdx((i) => (i + 1) % headlines.length), 4000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="top" className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main hero card — dark immersive container */}
        <div className="relative w-full rounded-2xl bg-black/[0.96] overflow-hidden border border-cyber/[0.15] shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

          <div className="flex flex-col lg:flex-row min-h-[560px]">
            {/* Left: copy */}
            <div className="flex-1 p-8 lg:p-14 relative z-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300 ring-1 ring-cyber/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexus/70 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-nexus" />
                  </span>
                  AI-Powered Deterministic RCA
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="mt-6"
              >
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={typeIdx}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:leading-[1.08] bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
                    >
                      {headlines[typeIdx]}
                    </motion.h1>
                  </AnimatePresence>
                </div>
                <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg max-w-lg">
                  Upload logs, trace anomalies, identify root cause, and generate evidence-backed
                  explanations in one intelligent debugging workspace.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <PrimaryCta />
                <SecondaryCta />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-2"
              >
                {["Deterministic RCA", "Graph-based reasoning", "LLM explanations", "Role-aware"].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-neutral-400 backdrop-blur-sm"
                  >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-cyber/70" />
                    {pill}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Spline 3D scene */}
            <div className="flex-1 relative min-h-[320px] lg:min-h-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Below hero card: quick stats strip */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: Activity, val: "94%", label: "Avg confidence" },
            { icon: TrendingUp, val: "2m14s", label: "P50 triage" },
            { icon: AlertTriangle, val: "340%", label: "Spike caught" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-card border border-cyber/[0.1] bg-black/[0.6] p-3 text-center backdrop-blur-sm"
            >
              <s.icon className="mx-auto h-4 w-4 text-cyber/70" strokeWidth={1.75} />
              <p className="mt-1.5 font-display text-lg font-bold text-white">{s.val}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Demo section ───────────────────────────────────────────────────────────
function DemoSection() {
  return (
    <section
      id="demo"
      className="border-t border-cyber/[0.08] bg-gradient-to-b from-black/[0.94] to-transparent py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="ui-section-eyebrow">In product</p>
          <h2 className="ui-section-title mt-2">Investigation workspace</h2>
          <p className="ui-section-desc">
            RCA summaries, evidence lists, and AI explanations — all in one surface.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-card border border-cyber/[0.14] bg-black/[0.9] shadow-glow-cyber"
        >
          {/* Tab bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-cyber/[0.08] bg-black/[0.94] px-4 py-2.5">
            {["RCA Summary", "Evidence", "AI Explanation"].map((tab, idx) => (
              <button
                key={tab}
                type="button"
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  idx === 0
                    ? "bg-cyber/[0.12] text-cyan-300 ring-1 ring-cyber/25"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                )}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 font-mono text-[10px] text-slate-600">
              <Terminal className="h-3.5 w-3.5" />
              job · dbg_inv_7f2a
            </div>
          </div>

          {/* Content grid */}
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="border-b border-cyber/[0.06] p-5 lg:col-span-5 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Top hypothesis
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                Deployment{" "}
                <span className="font-mono text-cyber/90">checkout-svc@v2.4.1</span>{" "}
                correlated with error rate and p99 latency in the cart path.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex gap-2">
                  <ListTree className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nexus/80" />
                  Trace: checkout → payment edge timeout cluster
                </li>
                <li className="flex gap-2">
                  <GitBranch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400/80" />
                  Diff touches validation in{" "}
                  <span className="font-mono">CartValidator</span>
                </li>
              </ul>
            </div>
            <div className="border-b border-cyber/[0.06] p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Evidence
              </p>
              <div className="mt-3 space-y-2">
                {[
                  { k: "Metric", v: "5xx rate +340% vs baseline" },
                  { k: "Deploy", v: "v2.4.1 @ 14:02 UTC" },
                  { k: "Anchor", v: "src/cart/validate.ts:L128" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex justify-between gap-3 rounded-lg border border-cyber/[0.06] bg-black/[0.94] px-2.5 py-2 text-[11px]"
                  >
                    <span className="text-slate-500">{row.k}</span>
                    <span className="truncate text-right font-mono text-slate-300">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 lg:col-span-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Remediation
              </p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Rollback or hotfix validation path",
                  "Notify #incident-441",
                  "Open PR with guardrail test",
                ].map((line, idx) => (
                  <li key={line} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-cyber/[0.15] bg-black/[0.88] text-[10px] text-cyber/70">
                      {idx + 1}
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Final CTA section ──────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-cyber/[0.08] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-2xl bg-black/[0.96] overflow-hidden border border-cyber/[0.15] shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            <div className="relative z-10 flex flex-col lg:flex-row min-h-[340px]">
              {/* Left: text content */}
              <div className="flex-1 p-10 lg:p-14 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-nexus/30 bg-nexus/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-nexus/90 w-fit">
                  <Sparkles className="h-3 w-3" />
                  Production ready
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Ship with confidence when production breaks
                </h2>
                <p className="mt-4 text-base text-neutral-300 max-w-lg">
                  Join the debugging workflow that respects evidence, speed, and accountability — not vibes.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PrimaryCta />
                  <SecondaryCta />
                </div>
                <Link
                  to="/login"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-cyber/80 transition hover:text-cyan-300 w-fit"
                >
                  Already have an account? <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Right: Spline 3D */}
              <div className="flex-1 relative hidden lg:block min-h-[340px]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page root ──────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-200">
      <LandingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />

        {/* Roles */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <p className="ui-section-eyebrow">Teams</p>
              <h2 className="ui-section-title mt-2">Role-aware collaboration</h2>
              <p className="ui-section-desc">
                Same workspace — tuned views for how each role triages and ships fixes.
              </p>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
            >
              {roles.map(({ label, icon: Icon, desc }) => (
                <motion.div
                  key={label}
                  variants={cardVariants}
                  className="nexus-card-scanline flex min-w-[10rem] max-w-[14rem] flex-1 cursor-default flex-col rounded-card border border-cyber/[0.1] bg-black/[0.84] px-4 py-4 text-center transition hover:border-cyber/[0.25] hover:bg-black/[0.84]"
                >
                  <Icon className="mx-auto h-5 w-5 text-cyber/80" strokeWidth={1.75} />
                  <p className="mt-2 font-display text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <CtaSection />

        <footer
          id="contact"
          className="scroll-mt-16 border-t border-cyber/[0.06] py-8 text-center font-mono text-xs text-slate-700"
        >
          © {new Date().getFullYear()} LogIQ · Debug engine
        </footer>
      </main>
    </div>
  );
}
