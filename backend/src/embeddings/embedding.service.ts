import { db } from "../config/drizzle";
import { embeddings } from "../db/schema";
import { genAI, MODELS } from "../ai/ai.config";
import { v4 as uuidv4 } from "uuid";

export class EmbeddingService {
  /**
   * Chunks text into smaller pieces for embedding generation.
   * Uses a simple character-based chunking with overlap.
   */
  private static chunkText(text: string, size: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + size, text.length);
      chunks.push(text.substring(start, end));
      start += size - overlap;
    }

    return chunks;
  }

  /**
   * Generates embeddings for a material and stores them in the database.
   */
  static async processMaterial(materialId: string, fullText: string) {
    const textChunks = this.chunkText(fullText);
    const model = genAI.getGenerativeModel({ model: MODELS.EMBEDDING });

    const embeddingOperations = textChunks.map(async (chunk, index) => {
      // 1. Generate embedding vector
      const result = await model.embedContent(chunk);
      const vector = result.embedding.values;

      // 2. Store in database
      return db.insert(embeddings).values({
        id: uuidv4(),
        materialId,
        chunkText: chunk,
        embedding: vector,
        chunkIndex: index,
      });
    });

    await Promise.all(embeddingOperations);
    return { chunksProcessed: textChunks.length };
  }

  /**
   * Helper to generate a single query embedding for vector search (RAG).
   */
  static async generateQueryEmbedding(query: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: MODELS.EMBEDDING });
    const result = await model.embedContent(query);
    return result.embedding.values;
  }
}
