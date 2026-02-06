"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  TrendingUp,
  Wallet,
  MessageSquare,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              FinResolve
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-primary transition-colors"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-primary transition-colors"
            >
              Stories
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              AI Financial Coach
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Master your money,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                conversationaly.
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
              Stop stressing over spreadsheets. Just chat with FinResolve to
              track spending, set goals, and build wealth—in plain English.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white text-slate-700 text-lg font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                View Demo
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
              <p>Trusted by 10,000+ users</p>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Abstract Background Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-50 -z-10 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-50 -z-10 animate-blob animation-delay-2000"></div>

            {/* UI Mockup Card */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Can I afford a trip to Paris?
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Sent 2 mins ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-lg shadow-primary/20 ml-8">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 text-white font-bold text-xs flex items-center justify-center">
                      AI
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Yes! ✈️ Based on your savings goal of ₦50k/mo, you have a
                      surplus of ₦200,000 this quarter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Financial clarity, simplified.
            </h2>
            <p className="text-slate-600 text-lg">
              Everything you need to manage your finances without the headache
              of complex spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-white" />}
              iconBg="bg-blue-500"
              title="Natural Language"
              description="Ask questions like finding a friend. No complex queries or filters needed."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              iconBg="bg-indigo-500"
              title="Smart Analytics"
              description="Visual breakdowns that explain your spending habits instantly."
            />
            <FeatureCard
              icon={<Wallet className="w-6 h-6 text-white" />}
              iconBg="bg-emerald-500"
              title="Goal Tracking"
              description="Set realistic targets and get nudged when you go off track."
            />
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              FinResolve
            </span>
          </div>
          <p className="text-sm">© 2024 FinResolve AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, iconBg, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div
        className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
