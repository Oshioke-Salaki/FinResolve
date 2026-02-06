"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CATEGORY_META, SpendingCategory, CurrencyCode, DEFAULT_CURRENCY } from "@/lib/types";
import { formatCurrency } from "@/lib/parseInput";

// --- Components ---

export function DailyTrendChart({
  data,
  currency = DEFAULT_CURRENCY,
}: {
  data: { day: string; amount: number }[];
  currency?: CurrencyCode;
}) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            dy={10}
          />
          <Tooltip
            cursor={{ fill: "#f1f5f9", radius: 8 }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              padding: "8px 12px",
            }}
            formatter={(value?: number) => [
              formatCurrency(Number(value || 0), currency),
              "Spent",
            ]}
          />
          <Bar
            dataKey="amount"
            fill="#3b82f6"
            radius={[6, 6, 6, 6]}
            barSize={32}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({
  data,
  currency = DEFAULT_CURRENCY,
}: {
  data: { category: SpendingCategory; amount: number; percentage: number }[];
  currency?: CurrencyCode;
}) {
  // Filter out tiny segments for cleaner chart
  const chartData = data.filter((d) => d.percentage > 2);

  return (
    <div className="h-[250px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="amount"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_META[entry.category].color}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, _name: any, props: any) => [
              formatCurrency(Number(value || 0), currency),
              (CATEGORY_META as Record<string, { label: string }>)[props?.payload?.category ?? "other"]?.label ?? "",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="text-xs text-slate-400 font-medium block">Top</span>
          <span className="text-sm font-bold text-slate-700">
            {chartData[0]
              ? CATEGORY_META[chartData[0].category].label.split(" ")[0]
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
