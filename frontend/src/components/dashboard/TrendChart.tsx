"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", spend: 4000 },
  { name: "Tue", spend: 3000 },
  { name: "Wed", spend: 2000 },
  { name: "Thu", spend: 2780 },
  { name: "Fri", spend: 1890 },
  { name: "Sat", spend: 2390 },
  { name: "Sun", spend: 3490 },
];

export function TrendChart() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-6 text-slate-800">
        Weekly Spending Trend
      </h3>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
              tickFormatter={(value) => `₦${value}`}
            />
            <Tooltip
              cursor={{ fill: "#F1F5F9" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: any) => [
                `₦${Number(value).toLocaleString()}`,
                "Spent",
              ]}
            />
            <Bar
              dataKey="spend"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
