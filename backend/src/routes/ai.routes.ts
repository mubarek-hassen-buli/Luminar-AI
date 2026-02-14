import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { MindMapService } from "../services/mindmap.service";
import { ExplanationService, ExplanationStyle } from "../services/explanation.service";
import { AppEnv } from "../middleware/validation";

const ai = new Hono<AppEnv>();

ai.use("*", authMiddleware);

/**
 * Trigger mind map generation for a workspace
 */
ai.post("/mindmap/:workspaceId", async (c) => {
  const workspaceId = c.req.param("workspaceId");
  const user = c.get("user");
  try {
    const mindMap = await MindMapService.generateMindMap(workspaceId, user.id);
    return c.json(mindMap, 201);
  } catch (error: any) {
    console.error("Mind map generation error:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get existing mind map nodes for a workspace
 */
ai.get("/mindmap/:workspaceId", async (c) => {
  const workspaceId = c.req.param("workspaceId");
  try {
    const nodes = await MindMapService.getWorkspaceMindMap(workspaceId);
    return c.json(nodes);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get an AI explanation for a specific node
 */
ai.get("/explanation/:nodeId", async (c) => {
  const nodeId = c.req.param("nodeId");
  const style = (c.req.query("style") as ExplanationStyle) || "real-world";
  const user = c.get("user");

  try {
    const explanation = await ExplanationService.getExplanation(nodeId, style, user.id);
    return c.json({ explanation });
  } catch (error: any) {
    console.error("Explanation generation error:", error);
    return c.json({ error: error.message }, 500);
  }
});

export default ai;
