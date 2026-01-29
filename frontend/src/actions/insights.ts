"use server";

import { generateWeeklyInsight } from "@/lib/coach/generateInsight";
import { type UserFinancialProfile } from "@/lib/types";

export async function getWeeklyInsightAction(profile: UserFinancialProfile) {
  // Simple wrapper to call the tracing-enabled logic on the server
  return await generateWeeklyInsight(profile);
}
