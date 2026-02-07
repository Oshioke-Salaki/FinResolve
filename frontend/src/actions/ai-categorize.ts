"use server";

import { openai, OPENAI_MODEL_NAME } from "@/lib/openaiClient";
import { type SpendingCategory } from "@/lib/types";
import { opikClient } from "@/lib/opikClient";

interface RawTransaction {
  id: string;
  description: string;
  amount: number;
}

export interface CategorizedTransaction {
  id: string;
  merchantName: string;
  category: SpendingCategory;
  confidence: "high" | "medium" | "low";
  reasoning?: string;
}

export async function categorizeTransactionsAI(
  transactions: RawTransaction[],
): Promise<CategorizedTransaction[]> {
  if (transactions.length === 0) return [];

  const startTime = Date.now();

  // Process in batches of 20 to avoid token limits
  const BATCH_SIZE = 20;
  const batches = [];
  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    batches.push(transactions.slice(i, i + BATCH_SIZE));
  }

  const results: CategorizedTransaction[] = [];

  for (const batch of batches) {
    try {
      const prompt = `
      You are a financial data analyst. Clean and categorize these raw bank transaction descriptions.
      
      Input Format: ID | Description | Amount
      Output Format: JSON Array of objects with keys: id, merchantName (clean), category (enum), confidence (high/medium/low).

      Allowed Categories:
      - food (restaurants, groceries, delivery)
      - transport (fuel, uber, bus, flight, car maintenance)
      - utilities (electricity, water, internet, phone bill, cable tv)
      - housing (rent, repairs, furniture)
      - entertainment (movies, games, streaming, betting)
      - shopping (clothes, electronics, online stores)
      - health (pharmacy, hospital, gym, doctor)
      - education (school fees, courses, books)
      - savings (transfers to savings apps like PiggyVest, Cowrywise, Kuda Save)
      - data_airtime (airtime, data bundles)
      - family (childcare, support to parents)
      - debt (loan repayments)
      - personal_care (haircut, salon, spa)
      - investment (stocks, crypto, mutual funds)
      - tax (government levies)
      - salary (income from employment)
      - business (income from business/freelance)
      - gift (received or given)
      - travel (flights, hotels, airbnb, uber for trips)
      - insurance (life, health, car, property)
      - subscriptions (spotify, netflix, appstore, google play)
      - charity (donations, tithing, non-profits)
      - other (uncategorized)

      Rules:
      1. 'merchantName': Extract the real business or person name. Remove "TRF", "POS", dates, location codes.
         Example: "POS PAYMENT - CHICKEN REPUB 2342 LAGOS" -> "Chicken Republic"
         Example: "TRF FROM JOHN DOE" -> "John Doe"
      2. 'category': strictly one of the allowed categories.
      3. 'confidence': 'high' if clear match (e.g. Uber, Netflix), 'medium' if generic but likely (e.g. 'Pharmacy'), 'low' if ambiguous (e.g. 'Transfer').

      Transactions to process:
      ${batch.map((t) => `${t.id} | ${t.description} | ${t.amount}`).join("\n")}
      `;

      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL_NAME,
        messages: [{ role: "system", content: prompt }],
        temperature: 0,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) throw new Error("No response from AI");

      const parsed = JSON.parse(responseContent);
      // Expecting { "transactions": [...] } or just an array
      const batchResults = Array.isArray(parsed)
        ? parsed
        : parsed.transactions || parsed.results || [];

      results.push(...batchResults);

      // Opik Tracing for this batch
      const trace = opikClient.trace({
        name: "ai-categorization",
        input: { batchSize: batch.length, sample: batch[0].description },
        output: { processed: batchResults.length },
        tags: ["categorization", "batch"],
      });
      trace.end();
    } catch (error) {
      console.error("Batch categorization error:", error);
      // Fallback: Return original description as merchant and 'other' category
      batch.forEach((t) => {
        results.push({
          id: t.id,
          merchantName: t.description,
          category: "other",
          confidence: "low",
        });
      });
    }
  }

  // Allowed categories set for validation
  const ALLOWED_CATEGORIES = new Set<SpendingCategory>([
    "food",
    "transport",
    "utilities",
    "housing",
    "entertainment",
    "shopping",
    "health",
    "education",
    "savings",
    "data_airtime",
    "family",
    "debt",
    "salary",
    "business",
    "gift",
    "other",
    "personal_care",
    "investment",
    "tax",
    "travel",
    "insurance",
    "subscriptions",
    "charity",
  ]);

  // Ensure we return results for all inputs even if AI dropped some
  // Map back to guarantee order and existence
  return transactions.map((original) => {
    const found = results.find((r) => r.id === original.id);

    // Validate category
    let category = found?.category || "other";
    if (!ALLOWED_CATEGORIES.has(category)) {
      category = "other";
    }

    return found
      ? { ...found, category }
      : {
          id: original.id,
          merchantName: original.description,
          category: "other",
          confidence: "low",
        };
  });
}
