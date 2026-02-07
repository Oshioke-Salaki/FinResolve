"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { generateMonthlyReport } from "@/lib/report-generator";
import { useFinancial } from "@/contexts/FinancialContext";
import { toast } from "sonner";
import { generateReportInsights } from "@/actions/report";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/types";

export function ReportModal() {
  const { profile } = useFinancial();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString(),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);
      const monthName = new Date(year, month).toLocaleString("default", {
        month: "long",
      });

      // 1. Generate AI Insights specifically for the report
      toast.info("Analyzing data for insights...");

      const monthlyData = profile.monthlySpending.filter((t) => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      const income = profile.monthlySpending
        .filter(
          (t) =>
            t.type === "income" &&
            new Date(t.date!).getMonth() === month &&
            new Date(t.date!).getFullYear() === year,
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthlyData
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      let aiSummary = "No insights generated.";
      try {
        aiSummary = await generateReportInsights({
          monthName,
          year,
          income,
          expenses,
          topCategories: monthlyData.slice(0, 5),
          currencySymbol:
            CURRENCIES[profile.currency || DEFAULT_CURRENCY]?.symbol || "$",
        });
      } catch (e) {
        console.error("AI Insight failed", e);
        aiSummary = "AI insights unavailable for this report.";
      }

      toast.success("Generating PDF...");

      // 2. Generate PDF
      await generateMonthlyReport({
        profile,
        month,
        year,
        aiInsights: aiSummary,
      });

      toast.success("Report downloaded successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [2024, 2025, 2026];

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <FileText className="h-4 w-4" />
        Download Report
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Generate Monthly Report"
        className="sm:max-w-[425px]"
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              Includes specific AI analysis of your spending habits for the
              selected month.
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Download PDF Report"
          )}
        </Button>
      </Modal>
    </>
  );
}
