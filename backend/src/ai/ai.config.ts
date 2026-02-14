import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model constants for consistent usage across the app
export const MODELS = {
  GEMINI_PRO: "gemini-2.5-flash",
  GEMINI_FLASH: "gemini-2.5-flash",
  EMBEDDING: "gemini-embedding-001",
};

/**
 * Utility to get a generative model instance (for text generation)
 */
export const getModel = (modelName: string = MODELS.GEMINI_FLASH, apiVersion: string = "v1beta") => {
  return genAI.getGenerativeModel({ model: modelName }, { apiVersion });
};

/**
 * Utility to get embedding model instance
 */
export const getEmbeddingModel = () => {
  return genAI.getGenerativeModel({ model: MODELS.EMBEDDING }, { apiVersion: "v1beta" });
};
