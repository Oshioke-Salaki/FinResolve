"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  PieChart,
  Shield,
  Sparkles,
  Target,
  Upload,
  Star,
} from "lucide-react";

/* ─── smooth‑scroll anchor ─── */
function A({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const go = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [href],
  );
  return (
    <a href={href} onClick={go} className={className}>
      {children}
    </a>
  );
}

/* ─── counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const val = useMotionValue(0);
  const display = useTransform(
    val,
    (v) => `${Math.round(v).toLocaleString()}${suffix}`,
  );
  const [text, setText] = useState(`0${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const c = animate(val, to, { duration: 1.8, ease: "easeOut" });
    const u = display.on("change", setText);
    return () => {
      c.stop();
      u();
    };
  }, [inView, val, to, display]);
  return <span ref={ref}>{text}</span>;
}

/* ─── reveal with blur ─── */
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── stagger variants ─── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const staggerChild = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease },
  },
};

/* ═════════════════════════════════════════ */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* subtle parallax on mockup */
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ─── Nav ─── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,.04)]" : ""}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
              className="size-7 rounded-lg bg-indigo-600 flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">F</span>
            </motion.div>
            <span className="font-semibold text-[15px] tracking-tight">
              FinResolve
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] text-slate-500 font-medium">
            {[
              ["#features", "Features"],
              ["#how", "How it works"],
              ["#wall", "Wall of love"],
            ].map(([href, label]) => (
              <A
                key={href}
                href={href}
                className="relative hover:text-slate-900 transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-300 after:rounded-full"
              >
                {label}
              </A>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden sm:block text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/signup"
                className="text-[13px] font-medium bg-slate-900 text-white rounded-lg px-4 py-1.5 hover:bg-slate-800 transition-colors inline-block"
              >
                Get started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════ */}
      {/*          HERO               */}
      {/* ═══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 px-6 overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-500/10 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 backdrop-blur-sm shadow-sm text-sm font-medium text-slate-600">
              <Sparkles className="size-4 text-amber-500" />
              <span>The future of personal finance is here</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            Master your money with <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-indigo-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
              AI-powered precision.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing where your money goes. FinResolve analyzes your
            spending, automates your savings, and helps you build
            wealth—effortlessly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group h-12 px-8 rounded-full bg-slate-900 text-white font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
            >
              Get Started Free{" "}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <A
              href="#how"
              className="h-12 px-8 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all hover:border-slate-300"
            >
              See How It Works
            </A>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-500"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="size-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start leading-tight">
              <div className="flex gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <span className="font-medium">Trusted by 10,000+ users</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.4,
            type: "spring",
            bounce: 0.2,
          }}
          style={{ perspective: "1000px" }}
          className="mt-20 max-w-6xl mx-auto px-4"
        >
          <div className="relative rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 overflow-hidden ring-1 ring-slate-900/5">
            {/* Window Controls */}
            <div className="absolute top-0 inset-x-0 h-10 border-b border-slate-100 bg-white/50 flex items-center px-4 gap-2 z-20">
              <div className="size-3 rounded-full bg-red-400/80" />
              <div className="size-3 rounded-full bg-amber-400/80" />
              <div className="size-3 rounded-full bg-emerald-400/80" />
            </div>

            {/* App UI */}
            <div className="pt-10 bg-slate-50/50 min-h-125 sm:min-h-175 relative overflow-hidden">
              {/* Sidebar (Abstract) */}
              <div className="hidden md:block absolute left-0 top-10 bottom-0 w-64 border-r border-slate-100 bg-white p-6 opacity-60">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg mb-8" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-3 w-full bg-slate-100 rounded-full"
                      style={{ width: `${80 - i * 10}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="md:ml-64 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
                    <div className="h-4 w-32 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="size-10 rounded-full bg-slate-200" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      label: "Total Balance",
                      val: "$24,562.00",
                      color: "bg-indigo-500",
                    },
                    {
                      label: "Monthly Spending",
                      val: "$1,240.50",
                      color: "bg-rose-500",
                    },
                    {
                      label: "Savings Goal",
                      val: "85%",
                      color: "bg-emerald-500",
                    },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <div
                        className={`size-10 rounded-lg ${c.color} mb-4 opacity-10`}
                      />
                      <div className="text-sm text-slate-400 font-medium mb-1">
                        {c.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-800">
                        {c.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8 h-64 flex items-end gap-2 px-10 pb-4">
                  {[30, 45, 25, 60, 80, 50, 70, 40, 55, 90, 65, 35].map(
                    (h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: "10%" }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="flex-1 bg-indigo-500/10 rounded-t-sm hover:bg-indigo-500/20 transition-colors"
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Floating Chat Interface */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute bottom-10 right-10 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-30"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3">
                  <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      FinResolve Assistant
                    </div>
                    <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                      Online
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="bg-indigo-50 text-indigo-900 p-3 rounded-2xl rounded-tl-none">
                    How can I help you optimize your budget today?
                  </div>
                  <div className="bg-slate-100 text-slate-700 p-3 rounded-2xl rounded-tr-none ml-8">
                    Show me my subscription costs for this month.
                  </div>
                  <div className="bg-indigo-50 text-indigo-900 p-3 rounded-2xl rounded-tl-none">
                    You spent <strong>$145.90</strong> on subscriptions. You
                    could save $30 by canceling...
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════ */}
      {/*         FEATURES            */}
      {/* ═══════════════════════════ */}
      {/* ═══════════════════════════ */}
      {/*         FEATURES            */}
      {/* ═══════════════════════════ */}
      <section
        id="features"
        className="py-24 px-6 bg-slate-50 relative scroll-mt-20 overflow-hidden"
      >
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-100/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-sm font-semibold text-indigo-600 mb-3 tracking-wide uppercase">
              Powerhouse Features
            </h2>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Everything you need to{" "}
              <span className="text-indigo-600">thrive financially</span>
            </p>
            <p className="text-lg text-slate-600">
              We&apos;ve packed FinResolve with intelligent tools designed to
              replace your accountant, financial advisor, and budgeting
              spreadsheet.
            </p>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
          >
            {/* ─── Conversational AI (Span 2 cols) ─── */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -5 }}
              className="md:col-span-2 rounded-[2.5rem] bg-white p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-1">
                  <div className="size-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30">
                    <MessageSquare className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Conversational AI Coach
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Don&apos;t just look at charts—talk to your data. Ask
                    &quot;How much did I spend on Uber?&quot; or &quot;Can I
                    afford a vacation?&quot; and get instant answers.
                  </p>
                </div>

                {/* Chat Bubbles Visual */}
                <div className="w-full md:w-64 flex flex-col gap-3 text-[11px] font-medium select-none">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-500 self-start max-w-[90%]">
                    Hey, you overspent on dining out.
                  </div>
                  <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-lg shadow-indigo-200 text-white self-end max-w-[90%]">
                    How much exactly?
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-500 self-start max-w-[90%]">
                    $450 over budget.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─── Smart Goal Tracking (Dark Card, Span 1 col, Row Span 2) ─── */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -5 }}
              className="md:row-span-2 rounded-[2.5rem] bg-slate-950 p-10 border border-slate-800 shadow-2xl relative overflow-hidden group flex flex-col"
            >
              <div className="size-14 rounded-2xl bg-indigo-500 flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30">
                <Target className="size-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Smart Goal Tracking
              </h3>
              <p className="text-slate-400 leading-relaxed mb-10 text-sm">
                Set clearer goals. FinResolve automatically sets aside money
                when you can afford it, ensuring you hit your targets without
                feeling the pinch.
              </p>

              {/* Chart Visual */}
              <div className="mt-auto flex justify-center pb-4">
                <div className="relative size-40">
                  <svg className="size-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#1e293b"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#6366f1"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="440"
                      strokeDashoffset="100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-4xl font-bold">76%</span>
                    <span className="text-xs text-slate-400 mt-1">New Car</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─── Deep Analytics (Span 1 col) ─── */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -5 }}
              className="rounded-[2.5rem] bg-white p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
            >
              <div className="size-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                <PieChart className="size-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Deep Analytics
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Visualize your financial habits with auto-generated, beautiful
                breakdowns.
              </p>
            </motion.div>

            {/* ─── Auto-Import (Span 1 col) ─── */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -5 }}
              className="rounded-[2.5rem] bg-white p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
            >
              <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <Upload className="size-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Auto-Import
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Drag & drop statements. We extract, categorize, and sync
                instantly.
              </p>
            </motion.div>

            {/* ─── Bank-Grade Security (Full Width) ─── */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -5 }}
              className="md:col-span-3 rounded-[2.5rem] bg-[#635BFF] p-10 shadow-2xl shadow-indigo-600/30 relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-10"
            >
              <div className="relative z-10 max-w-xl">
                <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                  <Shield className="size-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Bank-Grade Security
                </h3>
                <p className="text-indigo-100 leading-relaxed">
                  Your data is encrypted end-to-end. We don&apos;t sell your
                  data, and we can&apos;t touch your money. Peace of mind,
                  built-in.
                </p>
              </div>

              {/* Status Badge */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 min-w-70">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-10 rounded-full bg-[#00D66E] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Shield className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-indigo-200 font-medium uppercase tracking-wider">
                      Status
                    </div>
                    <div className="text-lg font-bold text-white">
                      Protected
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-[#00D66E]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ */}
      {/*       HOW IT WORKS          */}
      {/* ═══════════════════════════ */}
      <section id="how" className="py-20 px-6 bg-slate-50/70 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[13px] font-semibold text-indigo-600 mb-2 tracking-wide uppercase">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Up and running in 3 minutes
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* animated connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-linear-to-r from-slate-200 via-indigo-200 to-slate-200 z-0 origin-left"
            />

            {[
              {
                icon: <Sparkles className="size-5 text-indigo-600" />,
                t: "Create account",
                d: "Quick sign-up with a friendly onboarding wizard that learns your income, spending, and goals.",
              },
              {
                icon: <Upload className="size-5 text-indigo-600" />,
                t: "Add your data",
                d: "Upload a bank statement or type transactions our AI categorizes everything automatically.",
              },
              {
                icon: <Bot className="size-5 text-indigo-600" />,
                t: "Chat & grow",
                d: "Ask anything about your finances and get personalized coaching to build real wealth.",
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="relative text-center z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="inline-flex size-14 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mb-4"
                  >
                    {s.icon}
                  </motion.div>
                  <div className="text-[10px] font-bold text-indigo-600/50 uppercase tracking-widest mb-1">
                    Step 0{i + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5 text-[15px]">
                    {s.t}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-65 mx-auto">
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ */}
      {/*          STATS              */}
      {/* ═══════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { v: 100, s: "+", l: "Active users" },
            { v: 10, s: "k", l: "Money tracked" },
            { v: 98, s: "%", l: "Satisfaction" },
            { v: 20, s: "+", l: "Countries" },
          ].map((d, i) => (
            <motion.div key={i} variants={staggerChild}>
              <div className="text-3xl font-extrabold text-slate-900">
                <Counter to={d.v} suffix={d.s} />
              </div>
              <div className="text-[13px] text-slate-400 mt-0.5">{d.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════ */}
      {/*       WALL OF LOVE          */}
      {/* ═══════════════════════════ */}
      <section id="wall" className="py-20 px-6 bg-slate-50/70 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[13px] font-semibold text-indigo-600 mb-2 tracking-wide uppercase">
              Wall of love
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              People love FinResolve
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid md:grid-cols-3 gap-3"
          >
            {[
              {
                q: "I went from zero savings to a $5k emergency fund in 4 months. It\u2019s like a financial advisor in my pocket.",
                n: "Sarah K.",
                r: "Product Designer",
              },
              {
                q: "I\u2019ve tried Mint, YNAB, everything. FinResolve is the first one that stuck because I just\u2026 talk to it.",
                n: "James O.",
                r: "Software Engineer",
              },
              {
                q: "As a freelancer with irregular income, budgeting was impossible. FinResolve actually gets my cash flow.",
                n: "Amara D.",
                r: "Freelance Writer",
              },
            ].map((t, i) => (
              <motion.div key={i} variants={staggerChild}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col h-full hover:shadow-lg hover:shadow-slate-100/80 transition-shadow duration-300 cursor-default"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed flex-1 mb-4">
                    &ldquo;{t.q}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <div className="size-7 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center justify-center">
                      {t.n[0]}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 leading-none">
                        {t.n}
                      </div>
                      <div className="text-[11px] text-slate-400">{t.r}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ */}
      {/*           CTA               */}
      {/* ═══════════════════════════ */}
      <section className="py-24 px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-[2.5rem] font-extrabold tracking-tight text-slate-950 leading-tight mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-[17px] text-slate-500 mb-8 max-w-md mx-auto">
            Join thousands who stopped stressing and started building real
            wealth one conversation at a time.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold text-[15px] rounded-xl px-7 py-3.5 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Get started for free{" "}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
          <p className="mt-3 text-[12px] text-slate-400">
            Free forever &middot; No credit card required
          </p>
        </Reveal>
      </section>

      {/* ─── Footer ─── */}
      <Reveal>
        <footer className="border-t border-slate-100 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-6 rounded-md bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">F</span>
              </div>
              <span className="text-[13px] font-semibold text-slate-900">
                FinResolve
              </span>
            </div>
            <p className="text-[12px] text-slate-400">
              &copy; {new Date().getFullYear()} FinResolve AI. All rights
              reserved.
            </p>
            <div className="flex gap-5 text-[12px] text-slate-400">
              {["Privacy", "Terms", "Twitter"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="hover:text-slate-600 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}
