import { db } from "../config/drizzle";
import { workspaces, materials, ai_requests_log } from "../db/schema";
import { count, eq, and, gt } from "drizzle-orm";

export class UsageService {
  /**
   * Checks if a user can create another workspace (Limit: 3)
   */
  static async canCreateWorkspace(userId: string): Promise<boolean> {
    const [result] = await db
      .select({ value: count() })
      .from(workspaces)
      .where(eq(workspaces.userId, userId));
    return Number(result.value) < 3;
  }

  /**
   * Checks if a workspace can have another material (Limit: 1)
   */
  static async canUploadMaterial(workspaceId: string): Promise<boolean> {
    const [result] = await db
      .select({ value: count() })
      .from(materials)
      .where(eq(materials.workspaceId, workspaceId));
    return Number(result.value) < 1;
  }

  /**
   * Checks if a user has exceeded their daily AI request limit (Limit: 10 per 24h)
   */
  static async canMakeAIRequest(userId: string): Promise<boolean> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [result] = await db
      .select({ value: count() })
      .from(ai_requests_log)
      .where(
        and(
          eq(ai_requests_log.userId, userId), 
          gt(ai_requests_log.createdAt, twentyFourHoursAgo)
        )
      );
    return Number(result.value) < 10;
  }
}
