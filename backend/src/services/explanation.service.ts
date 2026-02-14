import { db } from "../config/drizzle";
import { mindmap_nodes, embeddings, materials } from "../db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getModel, MODELS } from "../ai/ai.config";
import { EmbeddingService } from "../embeddings/embedding.service";
import { AILogService } from "./ai-log.service";

export type ExplanationStyle = "funny" | "real-world" | "movie-analogy";

export class ExplanationService {
  /**
   * Generates a context-aware explanation for a mind map node.
   * Uses RAG (Retrieval Augmented Generation) to find relevant material chunks.
   */
  static async getExplanation(nodeId: string, style: ExplanationStyle, userId: string) {
    // 1. Get the node details
    const [node] = await db.select().from(mindmap_nodes).where(eq(mindmap_nodes.id, nodeId));
    if (!node) throw new Error("Node not found.");

    // 2. RAG: Generate embedding for the node label/content to search materials
    const query = `${node.label}: ${node.content}`;
    const queryEmbedding = await EmbeddingService.generateQueryEmbedding(query);

    // 3. Find top 3 most relevant chunks from the same material/workspace
    // We use cosine similarity (1 - cosine distance)
    const contextChunks = await db
      .select({
        chunkText: embeddings.chunkText,
        similarity: sql<number>`1 - (${embeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
      })
      .from(embeddings)
      .innerJoin(materials, eq(embeddings.materialId, materials.id))
      .where(eq(materials.workspaceId, node.workspaceId))
      .orderBy((t) => desc(t.similarity))
      .limit(3);

    const contextText = contextChunks.map((c) => c.chunkText).join("\n\n---\n\n");

    // 4. Prompt Gemini with context and style
    const model = getModel(MODELS.GEMINI_FLASH); // Flash is faster for summaries/explanations
    
    const stylePrompts: Record<ExplanationStyle, string> = {
      funny: "Explain this like a stand-up comedian. Use jokes and sarcasm but keep it educational.",
      "real-world": "Explain this using a practical, everyday example that a student can relate to.",
      "movie-analogy": "Explain this concept by comparing it to a famous movie plot, character, or scene.",
    };

    const prompt = `
      You are an elite tutor. Explain the following concept from a student's study material.
      
      CONCEPT: ${node.label}
      OVERVIEW: ${node.content}
      
      STUDY CONTEXT:
      ${contextText}
      
      INSTRUCTION: ${stylePrompts[style]}
      
      Keep the explanation engaging and under 250 words.
    `;

    const result = await model.generateContent(prompt);
    
    // Log request
    try {
      await AILogService.logRequest({
        userId,
        requestType: "explanation",
        inputTokens: result.response.usageMetadata?.promptTokenCount,
        outputTokens: result.response.usageMetadata?.candidatesTokenCount,
      });
    } catch (e) {
      console.error("Failed to log AI request:", e);
    }

    return result.response.text();
  }
}
