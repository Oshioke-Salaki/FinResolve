"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Food", value: 45000, color: "#ef4444" },
  { name: "Transport", value: 15000, color: "#f59e0b" },
  { name: "Rent", value: 120000, color: "#3b82f6" },
  { name: "Savings", value: 50000, color: "#10b981" },
];

export function SpendingChart() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">
        Spending This Month
      </h3>
      <div className="flex-1 min-h-[200px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                `₦${Number(value).toLocaleString()}`,
                "Amount",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-800">
              ₦230k
            </span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-x-4 gap-y-2 mt-6 flex-wrap">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
