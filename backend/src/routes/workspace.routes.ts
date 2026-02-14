import { Hono } from "hono";
import { WorkspaceService } from "../services/workspace.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { z } from "zod";
import { validator, AppEnv } from "../middleware/validation";

const workspaceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

const workspaces = new Hono<AppEnv>();

// All workspace routes require authentication
workspaces.use("*", authMiddleware);

workspaces.get("/", async (c) => {
  const user = c.get("user");
  const list = await WorkspaceService.listByUserId(user.id);
  return c.json(list);
});

workspaces.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const workspace = await WorkspaceService.getById(id, user.id);
  
  if (!workspace) {
    return c.json({ error: "Workspace not found" }, 404);
  }
  
  return c.json(workspace);
});

workspaces.post("/", validator("json", workspaceSchema), async (c) => {
  const user = c.get("user");
  const body = c.req.valid("json");
  
  try {
    const newWorkspace = await WorkspaceService.create(user.id, body);
    return c.json(newWorkspace, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

workspaces.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  const deleted = await WorkspaceService.delete(id, user.id);
  
  if (!deleted) {
    return c.json({ error: "Workspace not found or unauthorized" }, 404);
  }
  
  return c.json({ message: "Workspace deleted successfully" });
});

export default workspaces;
