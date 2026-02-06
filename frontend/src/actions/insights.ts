"use server";

import { generateWeeklyInsight, type SpendingInsight } from "@/lib/coach/generateInsight";
import { type UserFinancialProfile, type SpendingCategory } from "@/lib/types";

export interface DashboardAnalytics {
  totalSpent: number;
  dailyTrend: { day: string; amount: number; fullDate: string }[];
  categoryBreakdown: {
    category: SpendingCategory;
    amount: number;
    percentage: number;
  }[];
  topCategory: { category: SpendingCategory; amount: number } | null;
  insight: SpendingInsight;
}

export async function getWeeklyInsightAction(
  profile: UserFinancialProfile,
): Promise<DashboardAnalytics> {
  // 1. Get AI Insight
  const aiInsight = await generateWeeklyInsight(profile);

  // 2. Calculate Analytics Locally
  // Filter for THIS week (simple approximation: last 7 days)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklyTransactions = profile.monthlySpending.filter((t) => {
    const tDate = new Date(t.date || t.createdAt || 0);
    return tDate >= oneWeekAgo && tDate <= now && t.type !== "income"; // Only expenses
  });

  // Calculate Total
  const totalSpent = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate Daily Trend (Mon, Tue, etc.)
  const daysMap = new Map<string, number>();
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"
    if (!daysMap.has(dayName)) daysMap.set(dayName, 0);
  }

  weeklyTransactions.forEach((t) => {
    const d = new Date(t.date || t.createdAt || 0);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    daysMap.set(dayName, (daysMap.get(dayName) || 0) + t.amount);
  });

  const dailyTrend = Array.from(daysMap.entries()).map(([day, amount]) => ({
    day,
    amount,
    fullDate: day, // Simplified for chart
  }));

  // Calculate Category Breakdown
  const categoryMap = new Map<SpendingCategory, number>();
  weeklyTransactions.forEach((t) => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory =
    categoryBreakdown.length > 0
      ? {
          category: categoryBreakdown[0].category,
          amount: categoryBreakdown[0].amount,
        }
      : null;

  return {
    totalSpent,
    dailyTrend,
    categoryBreakdown,
    topCategory,
    insight: aiInsight,
  };
}
