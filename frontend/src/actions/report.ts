"use server";

import { openai, OPENAI_MODEL_NAME } from "@/lib/openaiClient";

interface ReportInsightParams {
  monthName: string;
  year: number;
  income: number;
  expenses: number;
  topCategories: any[];
  currencySymbol: string;
}

export async function generateReportInsights(
  params: ReportInsightParams,
): Promise<string> {
  const { monthName, year, income, expenses, topCategories, currencySymbol } =
    params;

  // Simple prompt for report commentary
  const prompt = `
    Analyze this month's financial data for a formal report.
    Month: ${monthName} ${year}
    Income: ${income}
    Expenses: ${expenses}
    Top Spending Categories: ${JSON.stringify(topCategories)}
    Currency Symbol: ${currencySymbol}
    
    Write a professional, concise executive summary (max 100 words) highlighting key trends, warnings, or kudos.
    Address the user directly.
    IMPORTANT: ALL monetary values must be formatted with the currency symbol "${currencySymbol}". Do not use "$" or any other currency symbol unless explicitly part of the data.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL_NAME,
      messages: [{ role: "system", content: prompt }],
    });
    return completion.choices[0].message.content || "No insights generated.";
  } catch (e) {
    console.error("AI Insight failed", e);
    return "AI insights unavailable for this report.";
  }
}
