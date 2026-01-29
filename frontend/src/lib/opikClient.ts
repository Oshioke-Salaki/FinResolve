import { Opik } from "opik";

// Initialize Opik client
// Ensure env vars OPIK_API_KEY, OPIK_WORKSPACE_NAME (optional), OPIK_PROJECT_NAME are set
export const opikClient = new Opik({
  projectName: process.env.OPIK_PROJECT_NAME || "FinResolve1",
});

/**
 * Configure Opik for the current session
 * Useful for client-side usage if needed, though strictly Opik SDK is better server-side
 * For now we use it in our server actions or API routes mostly.
 */
export const OP_CONFIG = {
  projectName: "FinResolve1",
};
