"use client";

import { useState } from "react";
import { useFinancial } from "@/contexts/FinancialContext";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { RecurringBills } from "@/components/dashboard/RecurringBills";
import {
  Target,
  Calendar,
  TrendingDown,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/parseInput";

export default function BudgetsPage() {
  const { profile } = useFinancial();

  const totalBudgetLimit = profile.budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = profile.budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalSubs = profile.recurringItems.reduce(
    (sum, r) => sum + r.amount,
    0,
  );

  const budgetUtilization =
    totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-1 hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <Link href="/dashboard" className="text-sm font-medium">
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Budgets & Subscriptions
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your spending limits and recurring commitments.
          </p>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              Total Budget
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-800">
                {formatCurrency(totalBudgetLimit)}
              </h3>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${budgetUtilization > 100 ? "bg-rose-500" : "bg-blue-500"}`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {formatCurrency(totalBudgetSpent)} spent this month (
              {Math.round(budgetUtilization)}%)
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              Monthly Subscriptions
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-slate-800">
              {formatCurrency(totalSubs)}
            </h3>
            <p className="text-xs text-slate-400">
              Across {profile.recurringItems.length} recurring items
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Briefcase className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              Safe to Spend Remainder
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-slate-800">
              {formatCurrency(
                Math.max(
                  0,
                  (profile.income?.amount || 0) - totalBudgetSpent - totalSubs,
                ),
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Remaining after budgets & bills
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Full Budgets List */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              All Monthly Budgets
            </h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {profile.budgets.length} sets
            </span>
          </div>
          <div className="bg-slate-50/50 p-6 rounded-4xl border border-slate-100">
            <BudgetProgress />
          </div>
        </section>

        {/* Full Subscriptions List */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              All Subscriptions
            </h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {profile.recurringItems.length} active
            </span>
          </div>
          <div className="bg-slate-50/50 p-6 rounded-4xl border border-slate-100">
            <RecurringBills />
          </div>
        </section>
      </div>
    </div>
  );
}
