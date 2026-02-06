"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useScroll,
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
  Globe,
  Star,
} from "lucide-react";

/* ─── smooth‑scroll anchor ─── */
function A({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const go = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [href]);
  return <a href={href} onClick={go} className={className}>{children}</a>;
}

/* ─── counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const val = useMotionValue(0);
  const display = useTransform(val, (v) => `${Math.round(v).toLocaleString()}${suffix}`);
  const [text, setText] = useState(`0${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const c = animate(val, to, { duration: 1.8, ease: "easeOut" });
    const u = display.on("change", setText);
    return () => { c.stop(); u(); };
  }, [inView, val, to, display]);
  return <span ref={ref}>{text}</span>;
}

/* ─── reveal with blur ─── */
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ─── Nav ─── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,.04)]" : ""}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.5 }} className="size-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </motion.div>
            <span className="font-semibold text-[15px] tracking-tight">FinResolve</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] text-slate-500 font-medium">
            {[["#features", "Features"], ["#how", "How it works"], ["#wall", "Wall of love"]].map(([href, label]) => (
              <A key={href} href={href} className="relative hover:text-slate-900 transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-300 after:rounded-full">
                {label}
              </A>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login" className="hidden sm:block text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5">Log in</Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="/signup" className="text-[13px] font-medium bg-slate-900 text-white rounded-lg px-4 py-1.5 hover:bg-slate-800 transition-colors inline-block">Get started</Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════ */}
      {/*          HERO               */}
      {/* ═══════════════════════════ */}
      <section ref={heroRef} className="pt-28 pb-4 sm:pt-36 sm:pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* badge */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="mb-5">
            <motion.span whileHover={{ scale: 1.06 }} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-indigo-600 bg-indigo-50 rounded-full px-3 py-1 cursor-default">
              <Sparkles className="size-3 animate-float-gentle" />
              AI-Powered Financial Coach
            </motion.span>
          </motion.div>

          {/* headline — word-by-word stagger */}
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-slate-950 mb-4">
            {["The", "smartest", "way", "to"].map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease }}
                className="inline-block mr-[0.28em]"
              >
                {w}
              </motion.span>
            ))}
            <br className="sm:hidden" />
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="text-gradient inline-block"
            >
              manage your money
            </motion.span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="text-[17px] leading-relaxed text-slate-500 max-w-lg mx-auto mb-8"
          >
            Track spending, hit savings goals, and get personalized coaching — all by chatting in plain English. No spreadsheets required.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65, ease }} className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-[15px] rounded-xl px-6 py-3 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                Start free <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <A href="#how" className="inline-flex items-center justify-center text-slate-600 font-semibold text-[15px] rounded-xl px-6 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                How it works
              </A>
            </motion.div>
          </motion.div>

          {/* trust */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.5 }} className="mt-8 flex items-center justify-center gap-2 text-[13px] text-slate-400">
            <div className="flex -space-x-1.5">
              {["bg-indigo-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400"].map((c, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 + i * 0.07, type: "spring", stiffness: 300, damping: 14 }} className={`size-6 rounded-full ${c} ring-2 ring-white`} />
              ))}
            </div>
            <span>Trusted by 10,000+ users</span>
            <span className="text-slate-300">|</span>
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.15 + i * 0.05, type: "spring", stiffness: 400 }}>
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Mockup ─── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.55, ease }}
          style={{ y: mockupY }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <motion.div whileHover={{ scale: 1.003 }} transition={{ duration: 0.5 }} className="rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xl shadow-slate-200/40 overflow-hidden">
            {/* chrome */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="size-[9px] rounded-full bg-slate-200" />
                <div className="size-[9px] rounded-full bg-slate-200" />
                <div className="size-[9px] rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-[11px] text-slate-400 bg-slate-50 rounded-md px-3 py-0.5 font-mono">app.finresolve.ai</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 bg-[#f8f9fb]">
              {/* dashboard */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Income", val: "$4,850", note: "+12% vs last mo", dot: "bg-emerald-500" },
                    { label: "Safe to spend", val: "$89 / day", note: "On track", dot: "bg-blue-500" },
                    { label: "Total savings", val: "$12,400", note: "62% of goal", dot: "bg-violet-500" },
                  ].map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85 + i * 0.12, duration: 0.5, ease }}
                      className="bg-white rounded-xl border border-slate-100 p-3.5 hover:shadow-md hover:shadow-slate-100/60 transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-1.5 mb-1"><div className={`size-1.5 rounded-full ${m.dot}`} /><span className="text-[11px] text-slate-400 font-medium">{m.label}</span></div>
                      <div className="text-[15px] font-bold text-slate-900">{m.val}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{m.note}</div>
                    </motion.div>
                  ))}
                </div>

                {/* chart */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.4 }} className="bg-white rounded-xl border border-slate-100 p-4">
                  <div className="text-[11px] font-semibold text-slate-500 mb-3">Spending trend</div>
                  <div className="flex items-end gap-[5px] h-20">
                    {[35, 55, 40, 72, 48, 64, 82, 52, 68, 78, 44, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${h}%`, opacity: 1 }}
                        transition={{ duration: 0.55, delay: 1.3 + i * 0.045, ease: [0.34, 1.56, 0.64, 1] }}
                        className="flex-1 rounded-[3px] bg-indigo-500 hover:bg-indigo-400 transition-colors duration-200 cursor-default"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* chat */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.7, ease }} className="bg-white rounded-xl border border-slate-100 p-3 flex flex-col text-[13px]">
                <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
                  <Bot className="size-4 text-indigo-500" />
                  <span className="font-semibold text-slate-700 text-[12px]">FinResolve AI</span>
                  <span className="ml-auto size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-2 flex-1">
                  {/* user message */}
                  <motion.div initial={{ opacity: 0, x: 14, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 1.5, duration: 0.45, ease }} className="ml-auto max-w-[88%] bg-indigo-600 text-white text-[12px] rounded-xl rounded-tr-sm px-3 py-2">
                    Where&apos;s my money going?
                  </motion.div>

                  {/* typing dots */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: 1.95, duration: 0.9, times: [0, 0.1, 0.75, 1] }} className="flex gap-1 px-3 py-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.div key={d} animate={{ y: [0, -3, 0] }} transition={{ delay: 1.95 + d * 0.1, duration: 0.45, repeat: 2, ease: "easeInOut" }} className="size-1.5 rounded-full bg-slate-300" />
                    ))}
                  </motion.div>

                  {/* AI reply */}
                  <motion.div initial={{ opacity: 0, x: -14, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 2.8, duration: 0.5, ease }} className="max-w-[92%] bg-slate-50 border border-slate-100 text-[12px] rounded-xl rounded-tl-sm px-3 py-2">
                    <p className="text-slate-600 mb-1.5">Here&apos;s your January breakdown:</p>
                    <div className="space-y-1 text-[11px]">
                      {[["Rent", "$1,200"], ["Food & Dining", "$620"], ["Entertainment", "$340"]].map(([k, v], i) => (
                        <motion.div key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.0 + i * 0.1, duration: 0.3, ease }} className="flex justify-between">
                          <span className="text-slate-400">{k}</span>
                          <span className="font-semibold text-slate-600">{v}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4, duration: 0.4 }} className="text-indigo-600 font-medium text-[11px] mt-1.5">
                      Tip: Entertainment is 18% above your average.
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════ */}
      {/*         FEATURES            */}
      {/* ═══════════════════════════ */}
      <section id="features" className="pt-24 pb-20 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[13px] font-semibold text-indigo-600 mb-2 tracking-wide uppercase">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">Everything you need, nothing you don&apos;t</h2>
          </Reveal>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: <MessageSquare className="size-[18px]" />, c: "text-blue-600 bg-blue-50", t: "Chat-first interface", d: "Ask anything in plain English — track expenses, check budgets, log transactions." },
              { icon: <PieChart className="size-[18px]" />, c: "text-violet-600 bg-violet-50", t: "Smart analytics", d: "Beautiful, auto-generated breakdowns of where your money actually goes." },
              { icon: <Target className="size-[18px]" />, c: "text-emerald-600 bg-emerald-50", t: "Goal tracking", d: "Set savings targets and get nudged when you veer off course." },
              { icon: <Upload className="size-[18px]" />, c: "text-amber-600 bg-amber-50", t: "Statement import", d: "Drop a CSV or PDF — every transaction gets auto-categorized by AI." },
              { icon: <Shield className="size-[18px]" />, c: "text-rose-600 bg-rose-50", t: "Financial health score", d: "A personalized 0–900 score with clear steps to improve it." },
              { icon: <Globe className="size-[18px]" />, c: "text-cyan-600 bg-cyan-50", t: "Multi-currency", d: "Supports USD, EUR, GBP, NGN, INR, KES and more from day one." },
            ].map((f, i) => (
              <motion.div key={i} variants={staggerChild}>
                <motion.div whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }} className="group rounded-2xl border border-slate-100 bg-white p-5 hover:shadow-lg hover:shadow-slate-100/80 hover:border-slate-200 transition-shadow duration-300 h-full cursor-default">
                  <motion.div whileHover={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 0.45 }} className={`size-9 rounded-xl ${f.c} flex items-center justify-center mb-3.5`}>
                    {f.icon}
                  </motion.div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-[15px]">{f.t}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{f.d}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ */}
      {/*       HOW IT WORKS          */}
      {/* ═══════════════════════════ */}
      <section id="how" className="py-20 px-6 bg-slate-50/70 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[13px] font-semibold text-indigo-600 mb-2 tracking-wide uppercase">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">Up and running in 3 minutes</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* animated connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 z-0 origin-left"
            />

            {[
              { icon: <Sparkles className="size-5 text-indigo-600" />, t: "Create account", d: "Quick sign-up with a friendly onboarding wizard that learns your income, spending, and goals." },
              { icon: <Upload className="size-5 text-indigo-600" />, t: "Add your data", d: "Upload a bank statement or type transactions — our AI categorizes everything automatically." },
              { icon: <Bot className="size-5 text-indigo-600" />, t: "Chat & grow", d: "Ask anything about your finances and get personalized coaching to build real wealth." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="relative text-center z-10">
                  <motion.div whileHover={{ scale: 1.1, rotate: 4 }} transition={{ duration: 0.25, ease: "easeOut" }} className="inline-flex size-14 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mb-4">
                    {s.icon}
                  </motion.div>
                  <div className="text-[10px] font-bold text-indigo-600/50 uppercase tracking-widest mb-1">Step 0{i + 1}</div>
                  <h3 className="font-semibold text-slate-900 mb-1.5 text-[15px]">{s.t}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-[260px] mx-auto">{s.d}</p>
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
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: 10000, s: "+", l: "Active users" },
            { v: 2, s: "M+", l: "Money tracked" },
            { v: 98, s: "%", l: "Satisfaction" },
            { v: 50, s: "+", l: "Countries" },
          ].map((d, i) => (
            <motion.div key={i} variants={staggerChild}>
              <div className="text-3xl font-extrabold text-slate-900"><Counter to={d.v} suffix={d.s} /></div>
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
            <p className="text-[13px] font-semibold text-indigo-600 mb-2 tracking-wide uppercase">Wall of love</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">People love FinResolve</h2>
          </Reveal>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="grid md:grid-cols-3 gap-3">
            {[
              { q: "I went from zero savings to a $5k emergency fund in 4 months. It\u2019s like a financial advisor in my pocket.", n: "Sarah K.", r: "Product Designer" },
              { q: "I\u2019ve tried Mint, YNAB, everything. FinResolve is the first one that stuck because I just\u2026 talk to it.", n: "James O.", r: "Software Engineer" },
              { q: "As a freelancer with irregular income, budgeting was impossible. FinResolve actually gets my cash flow.", n: "Amara D.", r: "Freelance Writer" },
            ].map((t, i) => (
              <motion.div key={i} variants={staggerChild}>
                <motion.div whileHover={{ y: -4, transition: { duration: 0.25 } }} className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col h-full hover:shadow-lg hover:shadow-slate-100/80 transition-shadow duration-300 cursor-default">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} className="size-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed flex-1 mb-4">&ldquo;{t.q}&rdquo;</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <div className="size-7 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center justify-center">{t.n[0]}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 leading-none">{t.n}</div>
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
            Join thousands who stopped stressing and started building real wealth — one conversation at a time.
          </p>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link href="/signup" className="group inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold text-[15px] rounded-xl px-7 py-3.5 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Get started for free <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
          <p className="mt-3 text-[12px] text-slate-400">Free forever &middot; No credit card required</p>
        </Reveal>
      </section>

      {/* ─── Footer ─── */}
      <Reveal>
        <footer className="border-t border-slate-100 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-6 rounded-md bg-indigo-600 flex items-center justify-center"><span className="text-white text-[10px] font-bold">F</span></div>
              <span className="text-[13px] font-semibold text-slate-900">FinResolve</span>
            </div>
            <p className="text-[12px] text-slate-400">&copy; {new Date().getFullYear()} FinResolve AI. All rights reserved.</p>
            <div className="flex gap-5 text-[12px] text-slate-400">
              {["Privacy", "Terms", "Twitter"].map((l) => <a key={l} href="#" className="hover:text-slate-600 transition-colors">{l}</a>)}
            </div>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}
