"use server";

import { geminiModel } from "@/lib/geminiClient";

/**
 * Answer a general question or respond to a statement during onboarding
 * Returns a 1-2 sentence response
 */
export async function answerGeneralQuestion(input: string): Promise<string> {
  try {
    const prompt = `You are a friendly, warm assistant helping a user set up their financial profile. Respond to the following in exactly 1-2 sentences.

Rules:
- If it's a question, give a direct, factual answer (concrete definition or fact)
- If it's a statement or comment, acknowledge it warmly and naturally
- Be friendly but brief
- Never be vague or philosophical
- Never ask follow-up questions
- Use a warm, conversational tone

User input: ${input}

Your response (1-2 sentences only):`;

    const result = await geminiModel.generateContent([{ text: prompt }]);
    const response = result.response.text().trim();

    // Ensure response isn't too long (max 2 sentences)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 2) {
      return sentences.slice(0, 2).join(". ").trim() + ".";
    }

    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    return "That's interesting! 😊";
  }
}
