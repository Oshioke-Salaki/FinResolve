"use client";

import { motion } from "framer-motion";
import { type SpendingInsight } from "@/lib/coach/generateInsight";
import { ArrowUp, ArrowDown, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyInsightProps {
  insight: SpendingInsight;
  onAccept?: () => void;
  onReject?: () => void;
}

export function WeeklyInsight({
  insight,
  onAccept,
  onReject,
}: WeeklyInsightProps) {
  const isNegative = insight.type === "spending_spike";
  const isPositive = insight.type === "saving_opportunity";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-border"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "p-3 rounded-2xl flex-shrink-0",
            isNegative
              ? "bg-red-50 text-red-600"
              : isPositive
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-blue-600",
          )}
        >
          {isNegative ? (
            <ArrowUp className="w-6 h-6" />
          ) : isPositive ? (
            <ArrowDown className="w-6 h-6" />
          ) : (
            <Info className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-slate-800">
              {insight.type === "spending_spike"
                ? "Spending Alert"
                : insight.type === "saving_opportunity"
                  ? "Savings Opportunity"
                  : "Weekly Check-in"}
            </h3>
            {insight.confidence && (
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">
            {insight.message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onAccept}
              className="flex-1 bg-slate-900 text-white font-medium py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              I'll do this
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
