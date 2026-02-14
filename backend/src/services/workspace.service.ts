import { db } from "../config/drizzle";
import { workspaces } from "../db/schema";
import { eq, and, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export class WorkspaceService {
  static async listByUserId(userId: string) {
    return await db.select().from(workspaces).where(eq(workspaces.userId, userId)).orderBy(workspaces.createdAt);
  }

  static async getById(id: string, userId: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, id), eq(workspaces.userId, userId)));
    return workspace;
  }

  static async create(userId: string, data: { title: string; description?: string }) {
    // Enforce 3-workspace limit for free tier
    const [workspaceCount] = await db
      .select({ count: count() })
      .from(workspaces)
      .where(eq(workspaces.userId, userId));

    if (workspaceCount.count >= 3) {
      throw new Error("Free tier limit reached: Maximum 3 workspaces allowed.");
    }

    const newWorkspace = {
      id: uuidv4(),
      userId,
      title: data.title,
      description: data.description,
      createdAt: new Date(),
    };

    const [inserted] = await db.insert(workspaces).values(newWorkspace).returning();
    return inserted;
  }

  static async delete(id: string, userId: string) {
    const [deleted] = await db
      .delete(workspaces)
      .where(and(eq(workspaces.id, id), eq(workspaces.userId, userId)))
      .returning();
    return deleted;
  }
}
