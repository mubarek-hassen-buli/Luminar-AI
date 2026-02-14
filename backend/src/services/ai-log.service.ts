import { db } from "../config/drizzle";
import { ai_requests_log } from "../db/schema";
import { v4 as uuidv4 } from "uuid";

export class AILogService {
  /**
   * Logs an AI request to the database.
   */
  static async logRequest(data: {
    userId: string;
    requestType: "mindmap_gen" | "explanation";
    inputTokens?: number;
    outputTokens?: number;
  }) {
    return await db.insert(ai_requests_log).values({
      id: uuidv4(),
      userId: data.userId,
      requestType: data.requestType,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
    });
  }
}
