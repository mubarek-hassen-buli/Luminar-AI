import { db } from "../config/drizzle";
import { mindmap_nodes, materials } from "../db/schema";
import { eq } from "drizzle-orm";
import { getModel, MODELS } from "../ai/ai.config";
import { AILogService } from "./ai-log.service";
import { v4 as uuidv4 } from "uuid";

export interface MindMapNode {
  label: string;
  content: string;
  children?: MindMapNode[];
}

export class MindMapService {
  /**
   * Generates a structured mind map from all materials in a workspace.
   */
  static async generateMindMap(workspaceId: string, userId: string) {
    // 1. Get all materials for visual context
    const workspaceMaterials = await db
      .select()
      .from(materials)
      .where(eq(materials.workspaceId, workspaceId));

    if (workspaceMaterials.length === 0) {
      throw new Error("No materials found in this workspace to generate a mind map.");
    }

    const aggregatedText = workspaceMaterials.map((m) => m.extractedText).join("\n\n");

    // 2. Prepare structured prompt for Gemini
    const model = getModel(MODELS.GEMINI_PRO);
    const prompt = `
      You are an expert academic assistant. Analyze the following study materials and generate a structured mind map in JSON format.
      The mind map should be hierarchical, with a central topic and sub-topics.
      
      RULES:
      1. Return ONLY valid JSON.
      2. The structure must be: { "label": "string", "content": "string", "children": [...] }
      3. Focus on key concepts and their relationships.
      4. Limit depth to 3 levels for clarity.
      5. "content" should be a brief 1-2 sentence overview of the node.
      
      STUDY MATERIALS:
      ${aggregatedText.substring(0, 30000)} // Limiting to stay within reasonable context for Pro
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Log request
    try {
      await AILogService.logRequest({
        userId,
        requestType: "mindmap_gen",
        inputTokens: result.response.usageMetadata?.promptTokenCount,
        outputTokens: result.response.usageMetadata?.candidatesTokenCount,
      });
    } catch (e) {
      console.error("Failed to log AI request:", e);
    }

    // 3. Parse JSON from Gemini response (cleaning up markdown if present)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse mind map JSON from AI response.");
    }
    const mindMapData: MindMapNode = JSON.parse(jsonMatch[0]);

    // 4. Save nodes to database recursively
    await db.delete(mindmap_nodes).where(eq(mindmap_nodes.workspaceId, workspaceId)); // Clear existing
    await this.saveNode(workspaceId, mindMapData);

    return mindMapData;
  }

  private static async saveNode(
    workspaceId: string,
    node: MindMapNode,
    parentId: string | null = null,
    depth: number = 0,
    order: number = 0
  ) {
    const nodeId = uuidv4();

    await db.insert(mindmap_nodes).values({
      id: nodeId,
      workspaceId,
      parentId,
      label: node.label,
      content: node.content,
      depth,
      order,
    });

    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        await this.saveNode(workspaceId, node.children[i], nodeId, depth + 1, i);
      }
    }
  }

  static async getWorkspaceMindMap(workspaceId: string) {
    return await db
      .select()
      .from(mindmap_nodes)
      .where(eq(mindmap_nodes.workspaceId, workspaceId))
      .orderBy(mindmap_nodes.depth, mindmap_nodes.order);
  }
}
