import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  UserFinancialProfile,
  SpendingEntry,
  CATEGORY_META,
} from "@/lib/types";

// Helper to format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

interface ReportOptions {
  profile: UserFinancialProfile;
  month: number; // 0-11
  year: number;
  aiInsights?: string;
}

export const generateMonthlyReport = async ({
  profile,
  month,
  year,
  aiInsights,
}: ReportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });
  const reportTitle = `Monthly Financial Report - ${monthName} ${year}`;
  const userName = profile.name || "FinResolve User";

  // Filter Data for the Month
  const monthlyTransactions = profile.monthlySpending.filter((t) => {
    if (!t.date) return false;
    const date = new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const incomeTransactions = monthlyTransactions.filter(
    (t) => t.type === "income",
  );
  const expenseTransactions = monthlyTransactions.filter(
    (t) => t.type === "expense",
  );

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenseTransactions.reduce(
    (acc, t) => acc + t.amount,
    0,
  );
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // --- PAGE 1: EXECUTIVE SUMMARY ---

  // Header
  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243); // Primary Blue
  doc.text("FinResolve", margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth - margin,
    20,
    { align: "right" },
  );

  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(margin, 25, pageWidth - margin, 25);

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text(reportTitle, margin, 40);
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Prepared for: ${userName}`, margin, 48);

  // Financial Pulse Grid
  const startY = 60;
  const boxWidth = (pageWidth - margin * 3) / 2;
  const boxHeight = 35;

  // Box 1: Income
  doc.setFillColor(240, 253, 244); // Light Green
  doc.rect(margin, startY, boxWidth, boxHeight, "F");
  doc.setFontSize(10);
  doc.setTextColor(22, 163, 74);
  doc.text("TOTAL INCOME", margin + 5, startY + 10);
  doc.setFontSize(16);
  doc.text(
    formatCurrency(totalIncome, profile.currency),
    margin + 5,
    startY + 25,
  );

  // Box 2: Expenses
  doc.setFillColor(254, 242, 242); // Light Red
  doc.rect(margin + boxWidth + margin, startY, boxWidth, boxHeight, "F");
  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38);
  doc.text("TOTAL EXPENSES", margin + boxWidth + margin + 5, startY + 10);
  doc.setFontSize(16);
  doc.text(
    formatCurrency(totalExpense, profile.currency),
    margin + boxWidth + margin + 5,
    startY + 25,
  );

  // Box 3: Net Savings
  doc.setFillColor(239, 246, 255); // Light Blue
  doc.rect(margin, startY + boxHeight + 10, boxWidth, boxHeight, "F");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text("NET SAVINGS", margin + 5, startY + boxHeight + 20);
  doc.setFontSize(16);
  doc.text(
    formatCurrency(netSavings, profile.currency),
    margin + 5,
    startY + boxHeight + 35,
  );

  // Box 4: Savings Rate
  doc.setFillColor(255, 251, 235); // Light Yellow
  doc.rect(
    margin + boxWidth + margin,
    startY + boxHeight + 10,
    boxWidth,
    boxHeight,
    "F",
  );
  doc.setFontSize(10);
  doc.setTextColor(217, 119, 6);
  doc.text(
    "SAVINGS RATE",
    margin + boxWidth + margin + 5,
    startY + boxHeight + 20,
  );
  doc.setFontSize(16);
  doc.text(
    `${savingsRate.toFixed(1)}%`,
    margin + boxWidth + margin + 5,
    startY + boxHeight + 35,
  );

  // Visual Bar (Income vs Expense)
  const barY = startY + boxHeight * 2 + 30;
  const maxBarWidth = pageWidth - margin * 2;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Cash Flow Visualization", margin, barY - 5);

  // Background bar
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, barY, maxBarWidth, 10, "F");

  // Expense Bar (Red)
  const expenseWidth =
    totalIncome > 0 ? (totalExpense / totalIncome) * maxBarWidth : 0;
  const clampedExpenseWidth = Math.min(expenseWidth, maxBarWidth);

  if (clampedExpenseWidth > 0) {
    doc.setFillColor(239, 68, 68);
    doc.rect(margin, barY, clampedExpenseWidth, 10, "F");
  }

  // Income Marker context (Simple representation)
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("0%", margin, barY + 15);
  doc.text("100% of Income", margin + maxBarWidth - 20, barY + 15);

  // --- CATEGORY BREAKDOWN ---

  const breakdownY = barY + 30;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Spending by Category", margin, breakdownY);

  // Calculate Aggregates
  const categoryTotals: Record<string, number> = {};
  expenseTransactions.forEach((t) => {
    const cat = t.category || "other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });

  const categoryRows = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amount]) => {
      const meta =
        CATEGORY_META[cat as keyof typeof CATEGORY_META] || CATEGORY_META.other;
      const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return [
        `${meta.emoji} ${meta.label}`,
        formatCurrency(amount, profile.currency),
        `${percent.toFixed(1)}%`,
      ];
    });

  autoTable(doc, {
    startY: breakdownY + 5,
    head: [["Category", "Amount", "% of Total"]],
    body: categoryRows,
    theme: "striped",
    headStyles: { fillColor: [33, 150, 243] },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // --- PAGE 2: TRANSACTIONS & INSIGHTS ---
  doc.addPage();

  // AI Insights Section
  if (aiInsights) {
    doc.setFontSize(14);
    doc.setTextColor(33, 150, 243);
    doc.text("AI Financial Commentary", margin, 20);

    doc.setFontSize(10);
    doc.setTextColor(50);
    const splitText = doc.splitTextToSize(aiInsights, pageWidth - margin * 2);
    doc.text(splitText, margin, 30);
  }

  // Top Transactions
  const transactionsY = aiInsights ? 80 : 30;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Top Expenses", margin, transactionsY);

  const topTransactions = expenseTransactions
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 15)
    .map((t) => [
      new Date(t.date || "").toLocaleDateString(),
      t.merchantName || t.description || "Unknown",
      CATEGORY_META[t.category]?.label || t.category,
      formatCurrency(t.amount, profile.currency),
    ]);

  autoTable(doc, {
    startY: transactionsY + 5,
    head: [["Date", "Merchant", "Category", "Amount"]],
    body: topTransactions,
    theme: "grid",
    headStyles: { fillColor: [239, 68, 68] }, // Red for expenses
    styles: { fontSize: 9 },
  });

  // Save the PDF
  doc.save(`FinResolve_Report_${monthName}_${year}.pdf`);
};
