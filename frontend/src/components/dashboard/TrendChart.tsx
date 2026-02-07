"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { useFinancial } from "@/contexts/FinancialContext";
import { formatCurrency } from "@/lib/parseInput";
import { CURRENCIES } from "@/lib/types";

function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col animate-pulse">
      <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
      <div className="flex-1 min-h-[300px] flex items-end gap-2">
        {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TrendChart() {
  const { profile, isLoading } = useFinancial();
  const currency = profile.currency;
  const currencySymbol = CURRENCIES[currency]?.symbol || "$";

  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Calculate monthly spending for the last 6 months
  const chartData = [];
  const today = new Date();

  // Normalize monthly income
  let monthlyBudget = profile.income?.amount || 0;
  if (profile.income?.frequency === "weekly") monthlyBudget *= 4.33;
  if (profile.income?.frequency === "yearly") monthlyBudget /= 12;

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = d.getMonth();
    const year = d.getFullYear();
    const monthName = d.toLocaleDateString("en-US", { month: "short" });

    // Calculate total spend for this month
    const monthlySpend = profile.monthlySpending
      .filter((t) => {
        if (!t.date && !t.createdAt) return false;
        const tDate = new Date(t.date || t.createdAt || "");
        return (
          tDate.getMonth() === month &&
          tDate.getFullYear() === year &&
          t.type === "expense"
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    chartData.push({
      name: monthName,
      spend: Math.round(monthlySpend),
      budget: Math.round(monthlyBudget),
    });
  }

  const hasData = chartData.some((d) => d.spend > 0);

  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-6 text-slate-800">
          Monthly Spending Trend
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-slate-400">No spending data yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Your monthly spending trend will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Monthly Spending Trend
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-slate-500">Spending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-slate-300" />
            <span className="text-slate-500">Income</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(value) =>
                `${currencySymbol}${(value / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              cursor={{ fill: "#F1F5F9" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => [
                formatCurrency(Number(value), currency),
                name === "spend" ? "Spent" : "Income Goal",
              ]}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpend)"
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#CBD5E1"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
