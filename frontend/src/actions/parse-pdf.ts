"use server";

// 1. GLOBAL POLYFILLS (Must be at the very top before any imports that might trigger side effects)
// Polyfill for PDF.js in Node environment (required by pdf-parse and pdfjs-dist)
if (
  typeof global !== "undefined" &&
  typeof (global as any).DOMMatrix === "undefined"
) {
  (global as any).DOMMatrix = class DOMMatrix {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;
    constructor() {}
  };
}

import { getOpenAIClient, OPENAI_MODEL_NAME } from "@/lib/openaiClient";
import { type UploadedTransaction } from "@/lib/types";

export type PDFParseResult = {
  success: boolean;
  transactions?: UploadedTransaction[];
  error?: string;
};

export async function parsePDFStatement(
  formData: FormData,
): Promise<PDFParseResult> {
  // 1. Initial Logging
  console.log("[parsePDFStatement] Starting PDF parse with UNPDF...");

  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file uploaded" };

  try {
    const arrayBuffer = await file.arrayBuffer();

    // 2. Extract Text using unpdf (optimized for Vercel/Serverless)
    console.log("[parsePDFStatement] Extracting text using unpdf...");

    // We import dynamically to keep the initial server action bundle light
    const { extractText } = await import("unpdf");

    const result = await extractText(new Uint8Array(arrayBuffer));
    const fullText = Array.isArray(result.text)
      ? result.text.join("\n")
      : result.text;

    if (!fullText || fullText.trim().length === 0) {
      console.warn("[parsePDFStatement] No text extracted from PDF");
      return {
        success: false,
        error:
          "No text could be extracted from this PDF. It might be an image-only scan.",
      };
    }

    console.log(`[parsePDFStatement] Extracted ${fullText.length} characters`);

    // 3. AI Extraction
    const truncatedText = fullText.slice(0, 15000);
    const prompt = `
    You are a financial data parser. Extract bank transactions from the following raw PDF text.
    
    Raw Text:
    """
    ${truncatedText}
    """

    Current Year: ${new Date().getFullYear()}
    Current Date: ${new Date().toISOString().split("T")[0]}

    Instructions:
    1. Identify the transaction table or list.
    2. Extract Date, Description, Amount, and Type (Credit/Debit or Income/Expense).
    3. Output dates ALWAYS in YYYY-MM-DD format.
    4. Ignore headers and footers.
    5. Return a JSON object with a key "transactions" containing an array of objects.
    
    Output Format (JSON):
    {
      "transactions": [
        {
          "date": "YYYY-MM-DD",
          "description": "string",
          "amount": 123.45,
          "type": "credit" | "debit" 
        }
      ]
    }
    `;

    console.log("[parsePDFStatement] Calling OpenAI...");
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL_NAME,
      messages: [{ role: "system", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) throw new Error("No response from AI parser");

    const parsed = JSON.parse(responseContent);
    const rawTransactions = parsed.transactions || [];

    const transactions = rawTransactions.map((t: any) => ({
      id: crypto.randomUUID(),
      date: t.date,
      description: t.description,
      amount: Number(t.amount),
      type: t.type,
      confirmed: false,
    }));

    console.log(
      `[parsePDFStatement] Successfully parsed ${transactions.length} transactions`,
    );
    return { success: true, transactions };
  } catch (error: any) {
    console.error("[parsePDFStatement] CRITICAL ERROR DETAILS:", error);
    let errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      error: `PDF Parsing error (unpdf): ${errorMessage}`,
    };
  }
}
