import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NavHeader, NavTab } from "@/components/ui/nav-header";
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
  Github,
  Layers,
  Loader2,
  Mail,
  Network,
  Radar,
  Send,
  Sparkles,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { DEMO_MODE, getCreateAccountPath, getOpenWorkspacePath } from "@/lib/demoMode";
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
                    <span className="text-slate-500">{row.k}</span>
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
                <div className="min-h-[4rem] flex-1 rounded-card border border-cyber/[0.08] bg-black/[0.85] p-5 backdrop-blur-sm">
                  <h3 className="font-display font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.body}</p>
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
              <p className="mt-1 text-sm text-slate-500">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA components ─────────────────────────────────────────────────────────
function PrimaryCta({ className }: { className?: string }) {
  return (
    <Link
      to={getOpenWorkspacePath()}
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
      to={getCreateAccountPath()}
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
const LANDING_NAV_TABS: NavTab[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

function LandingNav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 bg-transparent backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 outline-none transition hover:opacity-90">
          <LogIQFullLogo className="h-8 w-auto max-w-[200px] object-contain object-left sm:h-9" />
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <NavHeader tabs={LANDING_NAV_TABS} />
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {!DEMO_MODE ? (
          <Link
            to="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-200 sm:inline-block"
          >
            Login
          </Link>
          ) : null}
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

// ── Contact section ────────────────────────────────────────────────────────
const TOPIC_OPTIONS = [
  "General Inquiry",
  "Technical Support",
  "Bug Report",
  "Feature Request",
  "Partnership",
  "Other",
] as const;

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, topic: false, message: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: form.name.trim() ? null : "Name is required.",
    email: !form.email.trim()
      ? "Email is required."
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? null
        : "Enter a valid email address.",
    topic: form.topic ? null : "Please select a topic.",
    message: form.message.trim().length >= 10 ? null : "Message must be at least 10 characters.",
  };

  const isValid = Object.values(errors).every((e) => e === null);

  function inputCls(key: keyof typeof errors) {
    return cn(
      "w-full rounded-xl border bg-black/[0.82] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600",
      touched[key] && errors[key]
        ? "border-red-500/40 focus:border-red-400/60 focus:ring-2 focus:ring-red-500/20"
        : "border-white/[0.1] focus:border-cyber/50 focus:ring-2 focus:ring-cyber/20"
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, topic: true, message: true });
    if (!isValid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <section id="contact" className="scroll-mt-20 border-t border-cyber/[0.08] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="ui-section-eyebrow">Contact</p>
          <h2 className="ui-section-title mt-2">Get in touch</h2>
          <p className="ui-section-desc">
            Questions, feedback, or partnership inquiries — we'd love to hear from you.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-16">
          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] px-8 py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl font-bold text-white">Message sent!</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                  Thanks for reaching out. We'll get back to you within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", topic: "", message: "" });
                    setTouched({ name: false, email: false, topic: false, message: false });
                  }}
                  className="mt-6 text-sm font-medium text-cyber/80 transition hover:text-cyan-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => void handleSubmit(e)}
                noValidate
                className="rounded-2xl border border-cyber/[0.12] bg-black/[0.94] p-6 sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Jane Smith"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      className={inputCls("name")}
                    />
                    {touched.name && errors.name ? (
                      <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="jane@company.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      className={inputCls("email")}
                    />
                    {touched.email && errors.email ? (
                      <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="contact-topic" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, topic: true }))}
                    className={cn(inputCls("topic"), "cursor-pointer")}
                  >
                    <option value="">Select a topic…</option>
                    {TOPIC_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0a0f1e] text-slate-100">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {touched.topic && errors.topic ? (
                    <p className="mt-1.5 text-xs text-red-400">{errors.topic}</p>
                  ) : null}
                </div>

                <div className="mt-5">
                  <label htmlFor="contact-message" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us what's on your mind…"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                    className={cn(inputCls("message"), "resize-none")}
                  />
                  {touched.message && errors.message ? (
                    <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70",
                    ctaButtonGradient,
                    ctaGlowBlueOnly,
                    "ring-1 ring-blue-400/35"
                  )}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitting ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* ── Contact info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-5 lg:col-span-2"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Other ways to reach us
            </p>

            <a
              href="mailto:support@logiq.ai"
              className="flex items-start gap-4 rounded-xl border border-cyber/[0.12] bg-black/[0.88] p-5 transition hover:border-cyber/[0.25] hover:bg-black/[0.94]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyber/10 ring-1 ring-cyber/20">
                <Mail className="h-5 w-5 text-cyber" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200">Email support</p>
                <p className="mt-0.5 truncate font-mono text-xs text-cyber/70">assist.logiqdesk@outlook.com</p>
              </div>
            </a>

            <a
              href="https://github.com/Jay2704"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-xl border border-white/[0.08] bg-black/[0.88] p-5 transition hover:border-white/[0.15] hover:bg-black/[0.94]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-white/10">
                <Github className="h-5 w-5 text-slate-300" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200">GitHub</p>
                <p className="mt-0.5 font-mono text-xs text-slate-500">github.com/logiq-ai</p>
              </div>
            </a>

            <div className="rounded-xl border border-white/[0.06] bg-black/[0.6] p-5">
              <p className="text-sm font-semibold text-slate-300">Response time</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                We typically respond to all inquiries within one business day.
              </p>
            </div>
          </motion.div>
        </div>
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
        <ContactSection />

        <footer className="border-t border-cyber/[0.06] py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <p className="font-mono text-xs text-slate-500">
              © {new Date().getFullYear()} LogIQ. All rights reserved.
            </p>
            <div className="flex items-center gap-5 font-mono text-xs text-slate-500">
              <a href="#" className="transition hover:text-slate-400">Privacy</a>
              <a href="#" className="transition hover:text-slate-400">Terms</a>
              <a href="#contact" className="transition hover:text-slate-400">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
