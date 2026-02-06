"use client";

import { useFinancial } from "@/contexts/FinancialContext";
import { CATEGORY_META, type SpendingEntry, type CurrencyCode } from "@/lib/types";
import { formatCurrency } from "@/lib/parseInput";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

function ActivitySkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 bg-slate-200 rounded-xl" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-slate-200 rounded mb-1" />
        <div className="h-3 w-16 bg-slate-200 rounded" />
      </div>
      <div className="h-4 w-16 bg-slate-200 rounded" />
    </div>
  );
}

function ActivityItem({ entry, currency }: { entry: SpendingEntry; currency: CurrencyCode }) {
  const meta = CATEGORY_META[entry.category];
  // Default to debit (expense) unless explicitly marked as income
  const isIncome = entry.type === "income";
  const isDebit = !isIncome;

  const formatDate = (dateValue: string) => {
    if (!dateValue) return "Recent";
    const date = new Date(dateValue);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    // Check if it's a full ISO string with time (contains 'T' and ':')
    const hasTime = dateValue.includes("T") || dateValue.includes(":");

    if (isToday) {
      if (hasTime) {
        return `Today, ${date.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })}`;
      }
      return "Today";
    }

    // Calculate days difference
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1)
      return `Yesterday${hasTime ? `, ${date.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })}` : ""}`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      hour: hasTime ? "numeric" : undefined,
      minute: hasTime ? "2-digit" : undefined,
    });
  };

  const displayDate = entry.createdAt || entry.date || "";

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ backgroundColor: `${meta.color}15` }}
      >
        {meta.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {entry.description || meta.label}
        </p>
        <p className="text-xs text-slate-500">{formatDate(displayDate)}</p>
      </div>
      <div className="flex items-center gap-1">
        {isDebit ? (
          <ArrowUpRight className="w-3 h-3 text-red-500" />
        ) : (
          <ArrowDownLeft className="w-3 h-3 text-green-500" />
        )}
        <span
          className={`text-sm font-semibold ${isDebit ? "text-red-600" : "text-green-600"}`}
        >
          {isIncome ? "+" : "-"} {formatCurrency(Math.abs(entry.amount), currency)}
        </span>
      </div>
    </div>
  );
}

export function RecentActivityFeed() {
  const { profile, isLoading } = useFinancial();
  const currency = profile.currency;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Recent Activity
        </h3>
        <div className="space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Get last 5 transactions sorted by date
  const recentTransactions = [...profile.monthlySpending]
    .sort((a, b) => {
      const dateA = a.createdAt || a.date;
      const dateB = b.createdAt || b.date;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Recent Activity
        </h3>
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">No transactions yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Upload a statement or tell the AI about your spending
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Recent Activity
        </h3>
        <Link
          href="/activity"
          className="text-xs text-primary font-medium hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="space-y-1">
        {recentTransactions.map((entry) => (
          <ActivityItem key={entry.id} entry={entry} currency={currency} />
        ))}
      </div>
    </div>
  );
}
